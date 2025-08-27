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
    public class SessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public SessionsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Public: list sessions for an event (only for accepted events)
        [HttpGet("event/{eventId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var sessions = await _db.Sessions
                .Where(s => s.EventId == eventId)
                .Include(s => s.Speaker)
                .Include(s => s.Room)
                .AsNoTracking()
                .ToListAsync();

            return Ok(sessions);
        }

        // Public: get session by id
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var session = await _db.Sessions
                .Include(s => s.Speaker)
                .Include(s => s.Room)
                .Include(s => s.Event)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();
            return Ok(session);
        }

        // OrganizerOnly: create new session for own event
        [HttpPost]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Create(CreateSessionDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Verify event exists and belongs to organizer
            var evt = await _db.Events.FindAsync(req.EventId);
            if (evt == null) return BadRequest("Event not found.");
            if (evt.OrganizerId != userId) return Forbid();

            // Verify speaker exists
            var speaker = await _db.Speakers.FindAsync(req.SpeakerId);
            if (speaker == null) return BadRequest("Speaker not found.");

            // Verify room exists
            var room = await _db.Rooms.FindAsync(req.RoomId);
            if (room == null) return BadRequest("Room not found.");

            var session = new Session
            {
                Title = req.Title,
                StartTime = req.StartTime,
                EndTime = req.EndTime,
                EventId = req.EventId,
                SpeakerId = req.SpeakerId,
                RoomId = req.RoomId
            };

            _db.Sessions.Add(session);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = session.Id }, session);
        }

        // OrganizerOnly: update session for own event
        [HttpPut("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Update(int id, UpdateSessionDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var session = await _db.Sessions
                .Include(s => s.Event)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();
            if (session.Event.OrganizerId != userId) return Forbid();

            if (!string.IsNullOrWhiteSpace(req.Title)) session.Title = req.Title;
            if (req.StartTime.HasValue) session.StartTime = req.StartTime.Value;
            if (req.EndTime.HasValue) session.EndTime = req.EndTime.Value;
            if (req.SpeakerId.HasValue)
            {
                var speaker = await _db.Speakers.FindAsync(req.SpeakerId.Value);
                if (speaker == null) return BadRequest("Speaker not found.");
                session.SpeakerId = req.SpeakerId.Value;
            }
            if (req.RoomId.HasValue)
            {
                var room = await _db.Rooms.FindAsync(req.RoomId.Value);
                if (room == null) return BadRequest("Room not found.");
                session.RoomId = req.RoomId.Value;
            }

            await _db.SaveChangesAsync();
            return Ok(session);
        }

        // OrganizerOnly: delete session from own event
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var session = await _db.Sessions
                .Include(s => s.Event)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();
            if (session.Event.OrganizerId != userId) return Forbid();

            _db.Sessions.Remove(session);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
