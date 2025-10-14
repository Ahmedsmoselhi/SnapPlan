using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SnapPlan.Data;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SnapPlan.Middleware
{
	public class BanMiddleware
	{
		private readonly RequestDelegate _next;
		public BanMiddleware(RequestDelegate next)
		{
			_next = next;
		}

		public async Task InvokeAsync(HttpContext context, ApplicationDbContext db)
		{
			var userIdStr = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

			if (!string.IsNullOrEmpty(userIdStr) && int.TryParse(userIdStr, out var userId))
			{
				if (role == "Attender")
				{
					var att = await db.Attenders.AsNoTracking().FirstOrDefaultAsync(a => a.Id == userId);
					if (att != null && att.IsBanned)
					{
						context.Response.StatusCode = StatusCodes.Status403Forbidden;
						await context.Response.WriteAsync("Account is banned.");
						return;
					}
				}
				else if (role == "Admin" || role == "Organizer")
				{
					var staff = await db.Staffs.AsNoTracking().FirstOrDefaultAsync(s => s.Id == userId);
					if (staff != null && staff.IsBanned)
					{
						context.Response.StatusCode = StatusCodes.Status403Forbidden;
						await context.Response.WriteAsync("Account is banned.");
						return;
					}
				}
			}

			await _next(context);
		}
	}
}


