using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Models;
using server.DTOs;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                // Generate JWT token
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7); // Set the expiry time for the refresh token
                await _userManager.UpdateAsync(user);

                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new
                {
                    Token = token,
                    Role = roles.FirstOrDefault(),
                    RefreshToken = refreshToken,
                    UserId = user.Id,
                });
            }
            return BadRequest("Invalid login attempt.");
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserDTO model)
        {
            if (model.UserType == "Recruiter")
            {
                var recruiter = new Recruiter
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    UserType = model.UserType,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    BandId = model.BandId,
                    Phone = model.Phone,
                    CreatedAt = DateTime.UtcNow,
                    RefreshToken = GenerateRefreshToken(), // Generate and assign a refresh token
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7) // Example expiration time, adjust as needed
                };

                var result = await _userManager.CreateAsync(recruiter, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(recruiter, model.UserType);

                    var token = GenerateJwtToken(recruiter);
                    var roles = await _userManager.GetRolesAsync(recruiter);

                    return Ok(new
                    {
                        Token = token,
                        Role = roles.FirstOrDefault()
                    });
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return BadRequest(ModelState);
            }
            else if (model.UserType == "Student")
            {
                var student = new Student
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    UserType = model.UserType,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Phone = model.Phone,
                    Instrument = model.Instrument,
                    HighSchool = model.HighSchool,
                    CreatedAt = DateTime.UtcNow,
                    RefreshToken = GenerateRefreshToken(), // Generate and assign a refresh token
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7) // Example expiration time, adjust as needed
                };

                var result = await _userManager.CreateAsync(student, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(student, model.UserType);

                    var token = GenerateJwtToken(student);
                    var roles = await _userManager.GetRolesAsync(student);

                    return Ok(new
                    {
                        Token = token,
                        Role = roles.FirstOrDefault()
                    });
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return BadRequest(ModelState);
            }
            else
            {
                // Handle other user types (like Student or Admin)
                var user = new User
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    UserType = model.UserType,
                    RefreshToken = GenerateRefreshToken(), // Generate and assign a refresh token
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7) // Example expiration time, adjust as needed
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, model.UserType);

                    var token = GenerateJwtToken(user);
                    var roles = await _userManager.GetRolesAsync(user);

                    return Ok(new
                    {
                        Token = token,
                        Role = roles.FirstOrDefault()
                    });
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return BadRequest(ModelState);
            }
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDTO tokenRequest)
        {
            if (tokenRequest is null)
            {
                return BadRequest("Invalid client request");
            }

            string accessToken = tokenRequest.AccessToken;
            string refreshToken = tokenRequest.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);
            var user = await _userManager.FindByNameAsync(principal.Identity.Name);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid client request");
            }

            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponseDTO
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }


        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = false // here we are saying that we don't care about the token's expiration date
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }


        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Role, user.UserType) // Assuming UserType is your role
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
