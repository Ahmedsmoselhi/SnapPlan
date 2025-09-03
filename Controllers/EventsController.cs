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
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Description,
                    e.StartDate,
                    e.EndDate,
                    e.Status,
                    e.MaxTickets,
                    e.AvailableTickets,
                    Organizer = new { e.Organizer.Id, e.Organizer.Username, e.Organizer.Email },
                    Venue = new { e.Venue.Id, e.Venue.Name, e.Venue.Location },
                    Sessions = e.Sessions.Select(s => new { s.Id, s.Title, s.StartTime, s.EndTime })
                })
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
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Description,
                    e.StartDate,
                    e.EndDate,
                    e.Status,
                    e.MaxTickets,
                    e.AvailableTickets,
                    Organizer = new { e.Organizer.Id, e.Organizer.Username, e.Organizer.Email },
                    Venue = new { e.Venue.Id, e.Venue.Name, e.Venue.Location },
                    Sessions = e.Sessions.Select(s => new { s.Id, s.Title, s.StartTime, s.EndTime, Speaker = s.Speaker != null ? new { s.Speaker.Id, s.Speaker.FullName, s.Speaker.Email } : null })
                })
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
                Status = EventStatus.Pending,
                MaxTickets = req.MaxTickets,
                AvailableTickets = req.MaxTickets // Initially, all tickets are available
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

            // Handle MaxTickets update - ensure we don't reduce below current registrations
            if (req.MaxTickets.HasValue)
            {
                var currentRegistrations = await _db.Registrations.CountAsync(r => r.EventId == id);
                if (req.MaxTickets.Value < currentRegistrations)
                {
                    return BadRequest($"Cannot reduce max tickets to {req.MaxTickets.Value} as there are already {currentRegistrations} registrations.");
                }
                
                var difference = req.MaxTickets.Value - evt.MaxTickets;
                evt.MaxTickets = req.MaxTickets.Value;
                evt.AvailableTickets += difference; // Adjust available tickets accordingly
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
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Description,
                    e.StartDate,
                    e.EndDate,
                    e.Status,
                    e.MaxTickets,
                    e.AvailableTickets,
                    SoldTickets = e.MaxTickets - e.AvailableTickets,
                    Organizer = new { e.Organizer.Id, e.Organizer.Username, e.Organizer.Email },
                    Venue = new { e.Venue.Id, e.Venue.Name, e.Venue.Location },
                    Sessions = e.Sessions.Select(s => new { s.Id, s.Title, s.StartTime, s.EndTime })
                })
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
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Description,
                    e.StartDate,
                    e.EndDate,
                    e.Status,
                    e.MaxTickets,
                    e.AvailableTickets,
                    SoldTickets = e.MaxTickets - e.AvailableTickets,
                    Organizer = new { e.Organizer.Id, e.Organizer.Username, e.Organizer.Email },
                    Venue = new { e.Venue.Id, e.Venue.Name, e.Venue.Location }
                })
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
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Description,
                    e.StartDate,
                    e.EndDate,
                    e.Status,
                    e.MaxTickets,
                    e.AvailableTickets,
                    SoldTickets = e.MaxTickets - e.AvailableTickets,
                    Venue = new { e.Venue.Id, e.Venue.Name, e.Venue.Location },
                    Sessions = e.Sessions.Select(s => new { s.Id, s.Title, s.StartTime, s.EndTime })
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(events);
        }

        // OrganizerOnly: get event statistics including ticket information
        [HttpGet("{id:int}/statistics")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> GetEventStatistics(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var evt = await _db.Events
                .Where(e => e.Id == id && e.OrganizerId == userId)
                .FirstOrDefaultAsync();

            if (evt == null) return NotFound();

            var registrations = await _db.Registrations
                .Where(r => r.EventId == id)
                .CountAsync();

            var statistics = new
            {
                EventId = evt.Id,
                EventTitle = evt.Title,
                MaxTickets = evt.MaxTickets,
                AvailableTickets = evt.AvailableTickets,
                SoldTickets = evt.MaxTickets - evt.AvailableTickets,
                TotalRegistrations = registrations,
                TicketUtilization = evt.MaxTickets > 0 ? (double)(evt.MaxTickets - evt.AvailableTickets) / evt.MaxTickets * 100 : 0
            };

            return Ok(statistics);
        }
    }
}
