## SnapPlan Authentication and Authorization (JWT) – Simple Deep Guide

### 1) Core ideas

- **Authentication (AuthN)**: Proves who you are.
- **Authorization (AuthZ)**: Decides what you can do after we know who you are.
- We use **JWT Bearer**: the server issues a signed token after login. You send this token with each request.

### 2) Why JWT for SnapPlan

- You have roles with different abilities:
  - **Attender**: register for events
  - **Organizer**: create/manage events and sessions
  - **Admin**: approve/reject events
- JWT lets the server embed your role(s) as a claim, which APIs can check quickly without a database lookup on every request.

### 3) JWT in 60 seconds

- A JWT is a string like: `xxxxx.yyyyy.zzzzz` (Header.Payload.Signature), each part Base64Url-encoded.
- **Header**: the algorithm + token type, e.g. `{ "alg": "HS256", "typ": "JWT" }`
- **Payload**: claims about the user, e.g. `{ "sub": "123", "unique_name": "ahmed", "role": "Organizer", "exp": 1730000000 }`
- **Signature**: HMAC of header+payload using your secret key. The server verifies it to ensure the token is genuine and unmodified.

Example payload (simplified):

```json
{
  "sub": "42",
  "unique_name": "ahmed",
  "role": "Organizer",
  "iss": "SnapPlan",
  "aud": "SnapPlanClients",
  "exp": 1730000000
}
```

### 4) Where the secret lives

- In `appsettings.json` (local only) under `Jwt:Key`.
- Never commit real secrets; commit only `appsettings.json.example` with placeholders.

### 5) Login flow (issuing a token)

1. User sends username/email + password to `POST /api/auth/login`.
2. Server verifies the password against the saved hash.
3. Server creates a JWT with claims: user id, name, and role (Attender/Organizer/Admin).
4. Server returns the token: `{ token: "<jwt>" }`.

### 6) Using the token (calling protected APIs)

- Client adds this HTTP header to requests:
  - `Authorization: Bearer <your-jwt-token>`
- Server middleware validates:
  - Signature (using `Jwt:Key`)
  - Issuer (`Jwt:Issuer`) and Audience (`Jwt:Audience`)
  - Expiration (`exp` claim)
- If valid, `User.Identity` and `User.Claims` are populated for the controller action.

### 7) Roles and policies in SnapPlan

- Policies defined in `Program.cs`:
  - `AttenderOnly`: `RequireRole("Attender")`
  - `OrganizerOnly`: `RequireRole("Organizer")`
  - `AdminOnly`: `RequireRole("Admin")`
- Controllers protect endpoints using attributes, e.g.:

```csharp
[Authorize(Policy = "OrganizerOnly")]
[HttpPost("/api/events")]
public IActionResult CreateEvent(...) { ... }
```

- If the token is missing/invalid → 401 Unauthorized.
- If the token is valid but the role is wrong → 403 Forbidden.

### 8) Passwords (simple now, upgradable later)

- We store a **hash** of the password (not the plaintext). In this project we use a simple SHA-256 hasher for now.
- Later, you can upgrade to BCrypt/Argon2 without changing the JWT design.

### 9) Common errors and fixes

- "ConnectionString not initialized": ensure `ConnectionStrings:DefaultConnection` exists in `appsettings.json` and points to a reachable SQL instance.
- 401 Unauthorized: missing/expired/invalid token, or wrong `Jwt` config (Key/Issuer/Audience).
- 403 Forbidden: token is valid, but the user’s role doesn’t meet the endpoint’s policy.
- SQL "multiple cascade paths": we configured minimal `DeleteBehavior.Restrict` to avoid conflicting cascade deletes.

### 10) Quick start checklist

1. Create local `appsettings.json` from the example. Fill in `ConnectionStrings:DefaultConnection` and `Jwt` values.
2. Run DB migrations: `dotnet ef database update`.
3. Register users:
   - POST `api/auth/register/attender`
   - POST `api/auth/register/organizer`
4. Login: POST `api/auth/login` → copy `token`.
5. In Swagger, click "Authorize" and paste: `Bearer <token>`.
6. Call role-protected endpoints.

### 11) FAQ

- "Where do I see who I am?" → GET `api/auth/me` returns your name and roles from the token.
- "How long does a token last?" → `Jwt:ExpiresMinutes` in config determines this.
- "Do we need refresh tokens?" → Optional. For now, log in again when the token expires. You can add refresh tokens later if needed.

### 12) Visual flow (high level)

```
[ Client ] --(username+password)--> [ Login API ] --(verify)--> [ DB ]
   |                                             |
   +----(JWT) <----------------------------------+
   |
   +--(Authorization: Bearer <JWT>)--> [ Protected API ] --(validate JWT)--> [ OK ]
```

### 13) How to export this to PDF

- Open this file in VS Code → right-click → "Open Preview" → Print (Ctrl+P) → Destination: "Save as PDF".
- Or open the file on GitHub → browser menu → Print → "Save as PDF".

---

If you want, I can also add a short section with examples of protected endpoints for Attender/Organizer/Admin to test immediately.
