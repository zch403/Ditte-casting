using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using NameApp.Api.Data;          // your DbContext namespace
using NameApp.Api.Models;        // your AdminUser model namespace

namespace NameApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly PasswordHasher<AdminUser> _hasher;

        public AuthController(AppDbContext db)
        {
            _db = db;
            _hasher = new PasswordHasher<AdminUser>();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            var admin = _db.AdminUsers.SingleOrDefault(u => u.Username == model.Username);

            if (admin == null)
                return Unauthorized();

            // check password hash
            var result = _hasher.VerifyHashedPassword(admin, admin.PasswordHash, model.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized();

            // generate JWT token
            var key = Encoding.ASCII.GetBytes("supersecretkey12345678901234560000"); // same as Program.cs
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, admin.Username),
                    new Claim(ClaimTypes.Role, "Admin")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(new { token = jwt });
        }
    }

    public class LoginModel
    {
        public  LoginModel(string Username, string Password)
        {
            this.Username = Username;
            this.Password = Password;
        }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}