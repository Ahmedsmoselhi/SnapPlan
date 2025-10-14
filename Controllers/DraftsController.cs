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
    public class DraftsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public DraftsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // OrganizerOnly: list my drafts
        [HttpGet]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> List()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var drafts = await _db.Drafts
                .Where(d => d.OrganizerId == userId && !d.IsConvertedToEvent)
                .Include(d => d.Venue)
                .AsNoTracking()
                .ToListAsync();

            return Ok(drafts);
        }

        // OrganizerOnly: get my draft by id
        [HttpGet("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Get(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var draft = await _db.Drafts
                .Where(d => d.Id == id && d.OrganizerId == userId && !d.IsConvertedToEvent)
                .Include(d => d.Venue)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (draft == null) return NotFound();
            return Ok(draft);
        }

        // OrganizerOnly: create new draft
        [HttpPost]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Create(CreateDraftDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Verify venue exists if provided
            if (req.VenueId.HasValue)
            {
                var venue = await _db.Venues.FindAsync(req.VenueId.Value);
                if (venue == null) return BadRequest("Venue not found.");
            }

            var draft = new Draft
            {
                Title = req.Title,
                Description = req.Description,
                StartDate = req.StartDate,
                EndDate = req.EndDate,
                OrganizerId = userId,
                VenueId = req.VenueId,
                CreatedAtUtc = DateTime.UtcNow
            };

            _db.Drafts.Add(draft);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = draft.Id }, draft);
        }

        // OrganizerOnly: update my draft
        [HttpPut("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Update(int id, UpdateDraftDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var draft = await _db.Drafts.FindAsync(id);
            if (draft == null) return NotFound();
            if (draft.OrganizerId != userId) return Forbid();
            if (draft.IsConvertedToEvent) return BadRequest("Cannot update converted draft.");

            if (!string.IsNullOrWhiteSpace(req.Title)) draft.Title = req.Title;
            if (!string.IsNullOrWhiteSpace(req.Description)) draft.Description = req.Description;
            if (req.StartDate.HasValue) draft.StartDate = req.StartDate.Value;
            if (req.EndDate.HasValue) draft.EndDate = req.EndDate.Value;
            if (req.VenueId.HasValue)
            {
                var venue = await _db.Venues.FindAsync(req.VenueId.Value);
                if (venue == null) return BadRequest("Venue not found.");
                draft.VenueId = req.VenueId.Value;
            }

            draft.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(draft);
        }

        // OrganizerOnly: delete my draft
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var draft = await _db.Drafts.FindAsync(id);
            if (draft == null) return NotFound();
            if (draft.OrganizerId != userId) return Forbid();

            _db.Drafts.Remove(draft);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // OrganizerOnly: convert draft to event
        [HttpPost("{id:int}/convert")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> ConvertToEvent(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var draft = await _db.Drafts
                .Where(d => d.Id == id && d.OrganizerId == userId && !d.IsConvertedToEvent)
                .FirstOrDefaultAsync();

            if (draft == null) return NotFound();

            // Validate required fields
            if (string.IsNullOrWhiteSpace(draft.Title) || 
                string.IsNullOrWhiteSpace(draft.Description) ||
                !draft.StartDate.HasValue ||
                !draft.EndDate.HasValue ||
                !draft.VenueId.HasValue)
            {
                return BadRequest("Draft must have all required fields (title, description, start date, end date, venue) to convert to event.");
            }

            var evt = new Event
            {
                Title = draft.Title,
                Description = draft.Description,
                StartDate = draft.StartDate.Value,
                EndDate = draft.EndDate.Value,
                OrganizerId = userId,
                VenueId = draft.VenueId.Value,
                Status = EventStatus.Pending
            };

            _db.Events.Add(evt);
            draft.IsConvertedToEvent = true;
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = evt.Id }, evt);
        }
    }
}
