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
    public class RegistrationsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RegistrationsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // AttenderOnly: register for an event
        [HttpPost]
        [Authorize(Policy = "AttenderOnly")]
        public async Task<IActionResult> Register(CreateRegistrationDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Verify event exists and is accepted
            var evt = await _db.Events.FindAsync(req.EventId);
            if (evt == null) return BadRequest("Event not found.");
            if (evt.Status != EventStatus.Accepted) return BadRequest("Event is not available for registration.");

            // Check if already registered
            var existingRegistration = await _db.Registrations
                .FirstOrDefaultAsync(r => r.AttenderId == userId && r.EventId == req.EventId);
            if (existingRegistration != null) return BadRequest("Already registered for this event.");

            var registration = new Registration
            {
                AttenderId = userId,
                EventId = req.EventId,
                RegistrationDate = DateTime.UtcNow
            };

            _db.Registrations.Add(registration);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = registration.Id }, registration);
        }

        // AttenderOnly: get my registrations
        [HttpGet("my-registrations")]
        [Authorize(Policy = "AttenderOnly")]
        public async Task<IActionResult> MyRegistrations()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var registrations = await _db.Registrations
                .Where(r => r.AttenderId == userId)
                .Include(r => r.Event)
                .ThenInclude(e => e.Venue)
                .AsNoTracking()
                .ToListAsync();

            return Ok(registrations);
        }

        // AttenderOnly: cancel registration
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "AttenderOnly")]
        public async Task<IActionResult> CancelRegistration(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var registration = await _db.Registrations.FindAsync(id);
            if (registration == null) return NotFound();
            if (registration.AttenderId != userId) return Forbid();

            _db.Registrations.Remove(registration);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // OrganizerOnly: get registrations for my event
        [HttpGet("event/{eventId:int}")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            // Verify event belongs to organizer
            var evt = await _db.Events.FindAsync(eventId);
            if (evt == null) return NotFound();
            if (evt.OrganizerId != userId) return Forbid();

            var registrations = await _db.Registrations
                .Where(r => r.EventId == eventId)
                .Include(r => r.Attender)
                .AsNoTracking()
                .ToListAsync();

            return Ok(registrations);
        }

        // Public: get registration count for an event
        [HttpGet("event/{eventId:int}/count")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRegistrationCount(int eventId)
        {
            var count = await _db.Registrations
                .CountAsync(r => r.EventId == eventId);

            return Ok(new { eventId, registrationCount = count });
        }

        // AttenderOnly: get specific registration
        [HttpGet("{id:int}")]
        [Authorize(Policy = "AttenderOnly")]
        public async Task<IActionResult> Get(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var registration = await _db.Registrations
                .Where(r => r.Id == id && r.AttenderId == userId)
                .Include(r => r.Event)
                .ThenInclude(e => e.Venue)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (registration == null) return NotFound();
            return Ok(registration);
        }
    }
}
