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
    public class StaffController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public StaffController(ApplicationDbContext db)
        {
            _db = db;
        }

        // AdminOnly: list all staff (organizers and admins)
        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> List()
        {
            var staff = await _db.Staffs
                .AsNoTracking()
                .Include(s => s.ManagedEvents)
                .ToListAsync();
            
            var result = staff.Select(MapToResponseDto).ToList();
            return Ok(result);
        }

        // AdminOnly: get staff by id
        [HttpGet("{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Get(int id)
        {
            var staff = await _db.Staffs
                .Include(s => s.ManagedEvents)
                .FirstOrDefaultAsync(s => s.Id == id);
            
            if (staff == null) return NotFound();
            return Ok(MapToResponseDto(staff));
        }

        // AdminOnly: create new staff member
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create(CreateStaffDto req)
        {
            var exists = _db.Staffs.Any(s => s.Username == req.Username || s.Email == req.Email)
                      || _db.Attenders.Any(a => a.Username == req.Username || a.Email == req.Email);
            
            if (exists) return BadRequest("Username or email already exists.");

            var staff = new Staff
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = req.Password,
                Role = req.Role
            };
            
            _db.Staffs.Add(staff);
            await _db.SaveChangesAsync();
            
            return CreatedAtAction(nameof(Get), new { id = staff.Id }, MapToResponseDto(staff));
        }

        // AdminOnly: update staff member
        [HttpPut("{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Update(int id, UpdateStaffDto req)
        {
            var staff = await _db.Staffs.FindAsync(id);
            if (staff == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.Username)) staff.Username = req.Username;
            if (!string.IsNullOrWhiteSpace(req.Email)) staff.Email = req.Email;
            if (!string.IsNullOrWhiteSpace(req.Password)) staff.PasswordHash = req.Password;
            if (req.Role.HasValue) staff.Role = req.Role.Value;

            await _db.SaveChangesAsync();
            return Ok(MapToResponseDto(staff));
        }

        // AdminOnly: delete staff member
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            var staff = await _db.Staffs.FindAsync(id);
            if (staff == null) return NotFound();
            
            _db.Staffs.Remove(staff);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // Self profile for any authenticated staff member
        [HttpGet("me")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> Me()
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();
            
            var staff = await _db.Staffs
                .Include(s => s.ManagedEvents)
                .FirstOrDefaultAsync(s => s.Id == userId);
            
            if (staff == null) return NotFound();
            return Ok(MapToResponseDto(staff));
        }

        // Update own staff profile
        [HttpPut("me")]
        [Authorize(Policy = "StaffOnly")]
        public async Task<IActionResult> UpdateMe(UpdateStaffDto req)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var staff = await _db.Staffs.FindAsync(userId);
            if (staff == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(req.Username)) staff.Username = req.Username;
            if (!string.IsNullOrWhiteSpace(req.Email)) staff.Email = req.Email;
            if (!string.IsNullOrWhiteSpace(req.Password)) staff.PasswordHash = req.Password;
            // Staff cannot change their own role

            await _db.SaveChangesAsync();
            return Ok(MapToResponseDto(staff));
        }

        // OrganizerOnly: get my events
        [HttpGet("me/events")]
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

        // OrganizerOnly: get my drafts
        [HttpGet("me/drafts")]
        [Authorize(Policy = "OrganizerOnly")]
        public async Task<IActionResult> MyDrafts()
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

        // AdminOnly: list organizers only
        [HttpGet("organizers")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> ListOrganizers()
        {
            var organizers = await _db.Staffs
                .Where(s => s.Role == StaffRole.Organizer)
                .AsNoTracking()
                .ToListAsync();
            
            var result = organizers.Select(MapToResponseDto).ToList();
            return Ok(result);
        }

        // AdminOnly: list admins only
        [HttpGet("admins")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> ListAdmins()
        {
            var admins = await _db.Staffs
                .Where(s => s.Role == StaffRole.Admin)
                .AsNoTracking()
                .ToListAsync();
            
            var result = admins.Select(MapToResponseDto).ToList();
            return Ok(result);
        }

        private static StaffResponseDto MapToResponseDto(Staff s)
        {
            return new StaffResponseDto
            {
                Id = s.Id,
                Username = s.Username,
                Email = s.Email,
                Role = s.Role.ToString(),
                ManagedEventsCount = s.ManagedEvents?.Count ?? 0
            };
        }
    }
}
