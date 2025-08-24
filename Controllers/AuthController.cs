using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SnapPlan.Data;
using SnapPlan.Models;
using SnapPlan.Utils;

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

        public record RegisterAttenderRequest(string Username, string Email, string Password, string PhoneNumber);
        public record RegisterOrganizerRequest(string Username, string Email, string Password, string OrganizationName);
        public record LoginRequest(string UsernameOrEmail, string Password);

        [HttpPost("register/attender")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAttender(RegisterAttenderRequest req)
        {
            var exists = _db.Attenders.Any(a => a.Username == req.Username || a.Email == req.Email)
                      || _db.Staffs.Any(s => s.Username == req.Username || s.Email == req.Email);
            if (exists) return BadRequest("Username or email already exists.");

            var att = new Attender
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = SimplePasswordHasher.ComputeSha256(req.Password),
                PhoneNumber = req.PhoneNumber
            };
            _db.Attenders.Add(att);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("register/organizer")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterOrganizer(RegisterOrganizerRequest req)
        {
            var exists = _db.Attenders.Any(a => a.Username == req.Username || a.Email == req.Email)
                      || _db.Staffs.Any(s => s.Username == req.Username || s.Email == req.Email);
            if (exists) return BadRequest("Username or email already exists.");

            var org = new Staff
            {
                Username = req.Username,
                Email = req.Email,
                PasswordHash = SimplePasswordHasher.ComputeSha256(req.Password),
                Role = StaffRole.Organizer,
                OrganizationName = req.OrganizationName
            };
            _db.Staffs.Add(org);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login(LoginRequest req)
        {
            // Staff
            var staff = _db.Staffs.FirstOrDefault(s => s.Username == req.UsernameOrEmail || s.Email == req.UsernameOrEmail);
            if (staff != null && staff.PasswordHash == SimplePasswordHasher.ComputeSha256(req.Password))
            {
                return Ok(new { token = GenerateJwt(staff.Id, staff.Username, staff.Role.ToString()) });
            }

            // Attender
            var att = _db.Attenders.FirstOrDefault(a => a.Username == req.UsernameOrEmail || a.Email == req.UsernameOrEmail);
            if (att != null && att.PasswordHash == SimplePasswordHasher.ComputeSha256(req.Password))
            {
                return Ok(new { token = GenerateJwt(att.Id, att.Username, "Attender") });
            }

            return Unauthorized("Invalid credentials.");
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            return Ok(new
            {
                name = User.Identity?.Name,
                roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToArray()
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