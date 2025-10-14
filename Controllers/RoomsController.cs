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
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RoomsController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Public: list rooms for a venue
        [HttpGet("venue/{venueId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByVenue(int venueId)
        {
            var rooms = await _db.Rooms
                .Where(r => r.VenueId == venueId)
                .AsNoTracking()
                .ToListAsync();

            return Ok(rooms);
        }

        // Public: get room by id
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var room = await _db.Rooms
                .Include(r => r.Venue)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null) return NotFound();
            return Ok(room);
        }

        // StaffOnly: create new room
        [HttpPost]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Create(CreateRoomDto req)
        {
            // Verify venue exists
            var venue = await _db.Venues.FindAsync(req.VenueId);
            if (venue == null) return BadRequest("Venue not found.");

            var room = new Room
            {
                Name = req.Name,
                Capacity = req.Capacity,
                VenueId = req.VenueId
            };

            _db.Rooms.Add(room);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = room.Id }, room);
        }

        // StaffOnly: update room
        [HttpPut("{id:int}")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Update(int id, UpdateRoomDto req)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.Name)) room.Name = req.Name;
            if (req.Capacity.HasValue) room.Capacity = req.Capacity.Value;

            await _db.SaveChangesAsync();
            return Ok(room);
        }

        // StaffOnly: delete room
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            // Check if room is being used by any sessions
            var hasSessions = await _db.Sessions.AnyAsync(s => s.RoomId == id);
            if (hasSessions) return BadRequest("Cannot delete room that has associated sessions.");

            _db.Rooms.Remove(room);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
