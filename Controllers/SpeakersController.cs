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
    public class SpeakersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public SpeakersController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Public: list all speakers
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> List()
        {
            var speakers = await _db.Speakers
                .Include(s => s.Sessions)
                .AsNoTracking()
                .ToListAsync();

            return Ok(speakers);
        }

        // Public: get speaker by id
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var speaker = await _db.Speakers
                .Include(s => s.Sessions)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (speaker == null) return NotFound();
            return Ok(speaker);
        }

        // StaffOnly: create new speaker
        [HttpPost]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Create(CreateSpeakerDto req)
        {
            var speaker = new Speaker
            {
                FullName = req.FullName,
                Email = req.Email,
                Bio = req.Bio
            };

            _db.Speakers.Add(speaker);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = speaker.Id }, speaker);
        }

        // StaffOnly: update speaker
        [HttpPut("{id:int}")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Update(int id, UpdateSpeakerDto req)
        {
            var speaker = await _db.Speakers.FindAsync(id);
            if (speaker == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.FullName)) speaker.FullName = req.FullName;
            if (!string.IsNullOrWhiteSpace(req.Email)) speaker.Email = req.Email;
            if (!string.IsNullOrWhiteSpace(req.Bio)) speaker.Bio = req.Bio;

            await _db.SaveChangesAsync();
            return Ok(speaker);
        }

        // StaffOnly: delete speaker
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var speaker = await _db.Speakers.FindAsync(id);
            if (speaker == null) return NotFound();

            // Check if speaker is associated with any sessions
            var hasSessions = await _db.Sessions.AnyAsync(s => s.SpeakerId == id);
            if (hasSessions) return BadRequest("Cannot delete speaker that has associated sessions.");

            _db.Speakers.Remove(speaker);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
