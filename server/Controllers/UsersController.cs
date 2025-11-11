using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Database;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ServerDbContext _db;

        public UsersController(ServerDbContext db)
        {
            _db = db;
        }

        // Create new user with hashed password and generate jwt token
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromForm] SignupDto dto, [FromServices] JwtService jwtService)
        {
            var lowercaseEmail = dto.Email.Trim().ToLower();

            var existingUser = await _db.Users.SingleOrDefaultAsync(u => u.Email == lowercaseEmail);
            if (existingUser != null)
            {
                return Conflict("Email already in use");
            }

            var hasher = new PasswordHasher<User>(); 

            var newUser = new User
            {
                Username = dto.Username,
                Email = lowercaseEmail
            };

            newUser.PasswordHash = hasher.HashPassword(newUser, dto.Password);

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            var token = jwtService.GenerateToken(newUser);
            return Ok(new {token});
        }

        // Login in user if email exists and password matches with the hashed password
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] LoginDto dto, [FromServices] JwtService jwtService)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return Unauthorized("User does not exist");
            }

            var hasher =  new PasswordHasher<User>();

            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid password");
            }

            var token = jwtService.GenerateToken(user);

            return Ok(new { token });
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var userId = int.Parse(User.FindFirst("id")?.Value!);

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserDto dto)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value!);

            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.Title = dto.Title;
            user.Description = dto.Description;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("reports/myuploads")]
        public async Task<IActionResult> GetUserUploadReport()
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);

            var models = await _db.Models3D
                .Where(m => m.UserId == userId)
                .Select(m => new
                {
                    m.Name,
                    m.Description,
                    CreatedAt = m.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                })
                .ToListAsync();

            return Ok(models);
        }
    }
}
