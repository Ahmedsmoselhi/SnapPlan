using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SnapPlan.Data;
using SnapPlan.Models;
 

namespace SnapPlan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;
        
        public AuthController(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // Request models
        public record RegisterAttenderRequest(string Username, string Email, string Password, string PhoneNumber);
        public record LoginStaffRequest(string UsernameOrEmail, string Password);
        public record LoginAttenderRequest(string UsernameOrEmail, string Password);

        // Attender registration (only Attenders can register)
        [HttpPost("register/attender")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAttender(RegisterAttenderRequest req)
        {
            // Check if username or email already exists
            var exists = _db.Attenders.Any(a => a.Username == req.Username || a.Email == req.Email)
                      || _db.Staffs.Any(s => s.Username == req.Username || s.Email == req.Email);
            
            if (exists) 
                return BadRequest("Username or email already exists.");

            var attender = new Attender
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = req.Password,
                PhoneNumber = req.PhoneNumber
            };
            
            _db.Attenders.Add(attender);
            await _db.SaveChangesAsync();
            
            return Ok(new { message = "Attender registered successfully" });
        }

        // Staff login (Admin and Organizer use the same endpoint)
        [HttpPost("login/staff")]
        [AllowAnonymous]
        public IActionResult LoginStaff(LoginStaffRequest req)
        {
            var staff = _db.Staffs.FirstOrDefault(s => 
                s.Username == req.UsernameOrEmail || s.Email == req.UsernameOrEmail);
            
            if (staff == null || staff.PasswordHash != req.Password)
                return Unauthorized("Invalid credentials.");

            var token = GenerateJwt(staff.Id, staff.Username, staff.Role.ToString());
            
            return Ok(new { 
                token = token,
                user = new {
                    id = staff.Id,
                    username = staff.Username,
                    email = staff.Email,
                    role = staff.Role.ToString()
                }
            });
        }

        // Attender login (separate endpoint)
        [HttpPost("login/attender")]
        [AllowAnonymous]
        public IActionResult LoginAttender(LoginAttenderRequest req)
        {
            var attender = _db.Attenders.FirstOrDefault(a => 
                a.Username == req.UsernameOrEmail || a.Email == req.UsernameOrEmail);
            
            if (attender == null || attender.PasswordHash != req.Password)
                return Unauthorized("Invalid credentials.");

            var token = GenerateJwt(attender.Id, attender.Username, "Attender");
            
            return Ok(new { 
                token = token,
                user = new {
                    id = attender.Id,
                    username = attender.Username,
                    email = attender.Email,
                    role = "Attender",
                    phoneNumber = attender.PhoneNumber
                }
            });
        }

        // Get current user info
        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.Identity?.Name;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                id = userId,
                name = username,
                role = role
            });
        }

        private string GenerateJwt(int userId, string username, string role)
        {
            var jwtSection = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };
            
            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSection["ExpiresMinutes"]!)),
                signingCredentials: creds);
                
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
