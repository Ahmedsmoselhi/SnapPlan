using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SnapPlan.Data;
using SnapPlan.Models;
using SnapPlan.Models.DTOs;

namespace SnapPlan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public EventsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Public: list all accepted events
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> List()
        {
            var events = await _db.Events
                .Where(e => e.Status == EventStatus.Accepted)
                .Include(e => e.Organizer)
                .Include(e => e.Venue)
                .Include(e => e.Sessions)
                .AsNoTracking()
                .ToListAsync();

            return Ok(events);
        }

        // Public: get event by id (only accepted events)
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var evt = await _db.Events
                .Where(e => e.Id == id && e.Status == EventStatus.Accepted)
                .Include(e => e.Organizer)
                .Include(e => e.Venue)
                .Include(e => e.Sessions)
                .ThenInclude(s => s.Speaker)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (evt == null) return NotFound();
            return Ok(evt);
        }

        // OrganizerOnly: create new event
        [HttpPost]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Create(CreateEventDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Verify venue exists
            var venue = await _db.Venues.FindAsync(req.VenueId);
            if (venue == null) return BadRequest("Venue not found.");

            var evt = new Event
            {
                Title = req.Title,
                Description = req.Description,
                StartDate = req.StartDate,
                EndDate = req.EndDate,
                OrganizerId = userId,
                VenueId = req.VenueId,
                Status = EventStatus.Pending
            };

            _db.Events.Add(evt);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = evt.Id }, evt);
        }

        // OrganizerOnly: update own event (only if pending)
        [HttpPut("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Update(int id, UpdateEventDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var evt = await _db.Events.FindAsync(id);
            if (evt == null) return NotFound();
            if (evt.OrganizerId != userId) return Forbid();
            if (evt.Status != EventStatus.Pending) return BadRequest("Can only update pending events.");

            if (!string.IsNullOrWhiteSpace(req.Title)) evt.Title = req.Title;
            if (!string.IsNullOrWhiteSpace(req.Description)) evt.Description = req.Description;
            if (req.StartDate.HasValue) evt.StartDate = req.StartDate.Value;
            if (req.EndDate.HasValue) evt.EndDate = req.EndDate.Value;
            if (req.VenueId.HasValue)
            {
                var venue = await _db.Venues.FindAsync(req.VenueId.Value);
                if (venue == null) return BadRequest("Venue not found.");
                evt.VenueId = req.VenueId.Value;
            }

            await _db.SaveChangesAsync();
            return Ok(evt);
        }

        // OrganizerOnly: delete own event (only if pending)
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var evt = await _db.Events.FindAsync(id);
            if (evt == null) return NotFound();
            if (evt.OrganizerId != userId) return Forbid();
            if (evt.Status != EventStatus.Pending) return BadRequest("Can only delete pending events.");

            _db.Events.Remove(evt);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // AdminOnly: update event status
        [HttpPut("{id:int}/status")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateEventStatusDto req)
        {
            var evt = await _db.Events.FindAsync(id);
            if (evt == null) return NotFound();

            evt.Status = req.Status;
            await _db.SaveChangesAsync();
            return Ok(evt);
        }

        // AdminOnly: list all events (including pending and rejected)
        [HttpGet("admin/all")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> AdminListAll()
        {
            var events = await _db.Events
                .Include(e => e.Organizer)
                .Include(e => e.Venue)
                .Include(e => e.Sessions)
                .AsNoTracking()
                .ToListAsync();

            return Ok(events);
        }

        // AdminOnly: list pending events
        [HttpGet("admin/pending")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> AdminListPending()
        {
            var events = await _db.Events
                .Where(e => e.Status == EventStatus.Pending)
                .Include(e => e.Organizer)
                .Include(e => e.Venue)
                .AsNoTracking()
                .ToListAsync();

            return Ok(events);
        }

        // OrganizerOnly: get my events (all statuses)
        [HttpGet("my-events")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> MyEvents()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var events = await _db.Events
                .Where(e => e.OrganizerId == userId)
                .Include(e => e.Venue)
                .Include(e => e.Sessions)
                .AsNoTracking()
                .ToListAsync();

            return Ok(events);
        }
    }
}
