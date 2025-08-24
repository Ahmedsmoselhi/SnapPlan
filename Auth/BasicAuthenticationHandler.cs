using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using SnapPlan.Data;
using SnapPlan.Models;
using SnapPlan.Utils;

namespace SnapPlan.Auth
{
    public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly ApplicationDbContext _dbContext;

        public BasicAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            ApplicationDbContext dbContext) : base(options, logger, encoder, clock)
        {
            _dbContext = dbContext;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.ContainsKey("Authorization"))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            try
            {
                var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
                if (!"Basic".Equals(authHeader.Scheme, StringComparison.OrdinalIgnoreCase))
                {
                    return Task.FromResult(AuthenticateResult.NoResult());
                }

                var credentialBytes = Convert.FromBase64String(authHeader.Parameter ?? string.Empty);
                var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);
                if (credentials.Length != 2) return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header"));

                var usernameOrEmail = credentials[0];
                var password = credentials[1];
                var passwordHash = SimplePasswordHasher.ComputeSha256(password);

                // Try Staff first (Organizer/Admin)
                Staff? staff = _dbContext.Staffs.FirstOrDefault(s => s.Username == usernameOrEmail || s.Email == usernameOrEmail);
                if (staff != null && staff.PasswordHash == passwordHash)
                {
                    var claims = new[]
                    {
                        new Claim(ClaimTypes.Name, staff.Username),
                        new Claim(ClaimTypes.Role, staff.Role.ToString())
                    };
                    var identity = new ClaimsIdentity(claims, Scheme.Name);
                    var principal = new ClaimsPrincipal(identity);
                    var ticket = new AuthenticationTicket(principal, Scheme.Name);
                    return Task.FromResult(AuthenticateResult.Success(ticket));
                }

                // Then Attender
                Attender? attender = _dbContext.Attenders.FirstOrDefault(a => a.Username == usernameOrEmail || a.Email == usernameOrEmail);
                if (attender != null && attender.PasswordHash == passwordHash)
                {
                    var claims = new[]
                    {
                        new Claim(ClaimTypes.Name, attender.Username),
                        new Claim(ClaimTypes.Role, "Attender")
                    };
                    var identity = new ClaimsIdentity(claims, Scheme.Name);
                    var principal = new ClaimsPrincipal(identity);
                    var ticket = new AuthenticationTicket(principal, Scheme.Name);
                    return Task.FromResult(AuthenticateResult.Success(ticket));
                }

                return Task.FromResult(AuthenticateResult.Fail("Invalid username or password"));
            }
            catch
            {
                return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization header"));
            }
        }

        protected override Task HandleChallengeAsync(AuthenticationProperties properties)
        {
            Response.Headers["WWW-Authenticate"] = "Basic realm=\"SnapPlan\"";
            return base.HandleChallengeAsync(properties);
        }
    }
} 