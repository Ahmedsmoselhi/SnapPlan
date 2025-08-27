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
    public class VenuesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public VenuesController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Public: list all venues
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> List()
        {
            var venues = await _db.Venues
                .Include(v => v.Rooms)
                .AsNoTracking()
                .ToListAsync();

            return Ok(venues);
        }

        // Public: get venue by id
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var venue = await _db.Venues
                .Include(v => v.Rooms)
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == id);

            if (venue == null) return NotFound();
            return Ok(venue);
        }

        // StaffOnly: create new venue
        [HttpPost]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Create(CreateVenueDto req)
        {
            var venue = new Venue
            {
                Name = req.Name,
                Location = req.Address // Map Address to Location
            };

            _db.Venues.Add(venue);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = venue.Id }, venue);
        }

        // StaffOnly: update venue
        [HttpPut("{id:int}")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Update(int id, UpdateVenueDto req)
        {
            var venue = await _db.Venues.FindAsync(id);
            if (venue == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.Name)) venue.Name = req.Name;
            if (!string.IsNullOrWhiteSpace(req.Address)) venue.Location = req.Address; // Map Address to Location

            await _db.SaveChangesAsync();
            return Ok(venue);
        }

        // StaffOnly: delete venue
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var venue = await _db.Venues.FindAsync(id);
            if (venue == null) return NotFound();

            // Check if venue is being used by any events
            var hasEvents = await _db.Events.AnyAsync(e => e.VenueId == id);
            if (hasEvents) return BadRequest("Cannot delete venue that has associated events.");

            _db.Venues.Remove(venue);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
