using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SnapPlan.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        [AllowAnonymous]
        public IActionResult Public()
        {
            return Ok(new { message = "This is a public endpoint - no authentication required" });
        }

        [HttpGet("attender-only")]
        [Authorize(Policy = "AttenderOnly")]
        public IActionResult AttenderOnly()
        {
            return Ok(new { 
                message = "This endpoint is for Attenders only",
                user = User.Identity?.Name,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
        }

        [HttpGet("organizer-only")]
        [Authorize(Policy = "OrganizerOnly")]
        public IActionResult OrganizerOnly()
        {
            return Ok(new { 
                message = "This endpoint is for Organizers only",
                user = User.Identity?.Name,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
        }

        [HttpGet("admin-only")]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult AdminOnly()
        {
            return Ok(new { 
                message = "This endpoint is for Admins only",
                user = User.Identity?.Name,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
        }

        [HttpGet("staff-only")]
        [Authorize(Policy = "StaffOnly")]
        public IActionResult StaffOnly()
        {
            return Ok(new { 
                message = "This endpoint is for Staff (Admin or Organizer) only",
                user = User.Identity?.Name,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
        }

        [HttpGet("authenticated")]
        [Authorize]
        public IActionResult Authenticated()
        {
            return Ok(new { 
                message = "This endpoint requires any authenticated user",
                user = User.Identity?.Name,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
        }
    }
}
