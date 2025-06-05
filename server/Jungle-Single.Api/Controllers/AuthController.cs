
using Jungle_Single.Core.DtosModels;
using Jungle_Single.Core.Iservices;
using Jungle_Single.Core.Models;
using Jungle_Single.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Jungle_Single.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IConfiguration configuration, IUserService userService) : ControllerBase
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly IUserService _userService=userService;

        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] LoginModel loginModel )
        {
            var user = await _userService.GetUserByEmailAsync(loginModel.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginModel.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
            var token = GenerateJwtToken(user);
            return Ok(new { message = "You logined successfully", token,user});
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {
            var user = await _userService.GetUserByEmailAsync(registerModel.Email);
            if (user != null)
            {
                return BadRequest(new { message = "Username already exists" });
            }
            var newUser = new User
            {
                UserName = registerModel.UserName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerModel.Password),
                Role = Roles.User,
                Email = registerModel.Email,
               
            };
            await _userService.AddUserAsync(newUser);
            var token = GenerateJwtToken(newUser);
            return Ok(new { message = "You registered successfully", token,newUser });
        }


    private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        }),
                Issuer = _configuration["Jwt:Issuer"], 
                Audience = _configuration["Jwt:Audience"], 
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }
}
