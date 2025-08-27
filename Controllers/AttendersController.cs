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
    public class AttendersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AttendersController(ApplicationDbContext db)
        {
            _db = db;
        }

        // AdminOnly: list all attenders
        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> List()
        {
            var attenders = await _db.Attenders.AsNoTracking().ToListAsync();
            var result = attenders.Select(MapToResponseDto).ToList();
            return Ok(result);
        }

        // AdminOnly: get attender by id
        [HttpGet("{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Get(int id)
        {
            var attender = await _db.Attenders.FindAsync(id);
            if (attender == null) return NotFound();
            return Ok(MapToResponseDto(attender));
        }

        

        // Anyone can create via AuthController, but allow Admin to create too
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create(CreateAttenderDto req)
        {
            var exists = _db.Attenders.Any(a => a.Username == req.Username || a.Email == req.Email)
                      || _db.Staffs.Any(s => s.Username == req.Username || s.Email == req.Email);
            if (exists) return BadRequest("Username or email already exists.");

            var attender = new Attender
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = req.Password,
                PhoneNumber = req.PhoneNumber
            };
            _db.Attenders.Add(attender);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = attender.Id }, MapToResponseDto(attender));
        }

        // AdminOnly: update attender
        [HttpPut("{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Update(int id, UpdateAttenderDto req)
        {
            var attender = await _db.Attenders.FindAsync(id);
            if (attender == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.Username)) attender.Username = req.Username;
            if (!string.IsNullOrWhiteSpace(req.Email)) attender.Email = req.Email;
            if (!string.IsNullOrWhiteSpace(req.Password)) attender.PasswordHash = req.Password;
            if (!string.IsNullOrWhiteSpace(req.PhoneNumber)) attender.PhoneNumber = req.PhoneNumber;

            await _db.SaveChangesAsync();
            return Ok(MapToResponseDto(attender));
        }



        // AdminOnly: delete attender
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var attender = await _db.Attenders.FindAsync(id);
            if (attender == null) return NotFound();
            _db.Attenders.Remove(attender);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        

        // Self profile for any authenticated user (Attender)
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();
            var attender = await _db.Attenders.FindAsync(userId);
            if (attender == null) return NotFound();
            return Ok(MapToResponseDto(attender));
        }

        // Update own attender profile
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe(UpdateAttenderDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var attender = await _db.Attenders.FindAsync(userId);
            if (attender == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.Username)) attender.Username = req.Username;
            if (!string.IsNullOrWhiteSpace(req.Email)) attender.Email = req.Email;
            if (!string.IsNullOrWhiteSpace(req.Password)) attender.PasswordHash = req.Password;
            if (!string.IsNullOrWhiteSpace(req.PhoneNumber)) attender.PhoneNumber = req.PhoneNumber;

            await _db.SaveChangesAsync();
            return Ok(MapToResponseDto(attender));
        }

        // Delete own attender account
        [HttpDelete("me")]
        [Authorize]
        public async Task<IActionResult> DeleteMe()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var attender = await _db.Attenders.FindAsync(userId);
            if (attender == null) return NotFound();

            _db.Attenders.Remove(attender);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        private static AttenderResponseDto MapToResponseDto(Attender a)
        {
            return new AttenderResponseDto
            {
                Id = a.Id,
                Username = a.Username,
                Email = a.Email,
                PhoneNumber = a.PhoneNumber
            };
        }
    }
}


