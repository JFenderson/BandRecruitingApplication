using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using server.Constants;
using server.Controllers;
using server.DTOs;
using server.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Tests.Controllers
{
    public class AccountControllerTests
    {
        private static Mock<UserManager<ApplicationUser>> MockUserManager()
        {
            var store = new Mock<IUserStore<ApplicationUser>>();
            return new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);
        }

        private static Mock<SignInManager<ApplicationUser>> MockSignInManager(Mock<UserManager<ApplicationUser>> userManager)
        {
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var claimsFactory = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
            return new Mock<SignInManager<ApplicationUser>>(userManager.Object, contextAccessor.Object, claimsFactory.Object, null, null, null, null);
        }

        private static IConfiguration BuildConfig()
        {
            var dict = new Dictionary<string, string?>
            {
                {"Jwt:Key", "verySecretKeyverySecretKeyverySecretKey"},
                {"Jwt:Issuer", "testIssuer"},
                {"Jwt:Audience", "testAudience"},
                {"Jwt:AccessTokenLifetimeMinutes", "60"}
            };
            return new ConfigurationBuilder().AddInMemoryCollection(dict).Build();
        }

        [Fact]
        public async Task Register_ValidDto_ReturnsOkObjectResultWithExpectedMessage()
        {
            var userManager = MockUserManager();
            var signInManager = MockSignInManager(userManager);
            var config = BuildConfig();
            var userService = new Mock<IUserService>();
            var controller = new AccountController(userManager.Object, signInManager.Object, config);

            var dto = new CreateUserDTO
            {
                Email = "john@example.com",
                Password = "Pass123!",
                FirstName = "John",
                LastName = "Doe",
                Phone = "1234567890",
                UserType = Roles.Student,
                Instrument = "Guitar",
                HighSchool = "HS",
                GraduationYear = 2025
            };

            userManager.Setup(u => u.CreateAsync(It.IsAny<ApplicationUser>(), dto.Password))
                       .ReturnsAsync(IdentityResult.Success);
            userManager.Setup(u => u.AddToRoleAsync(It.IsAny<ApplicationUser>(), dto.UserType))
                       .ReturnsAsync(IdentityResult.Success);

            var result = await controller.Register(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var message = okResult.Value?.GetType().GetProperty("message")?.GetValue(okResult.Value) as string;
            Assert.Equal($"{dto.UserType} registered successfully", message);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOkObjectResult()
        {
            var userManager = MockUserManager();
            var signInManager = MockSignInManager(userManager);
            var config = BuildConfig();
            var userService = new Mock<IUserService>();
            var controller = new AccountController(userManager.Object, signInManager.Object, config);

            var dto = new LoginDTO { Email = "john@example.com", Password = "Pass123!" };
            var user = new ApplicationUser { Id = "1", Email = dto.Email, UserName = dto.Email };

            userManager.Setup(u => u.FindByEmailAsync(dto.Email)).ReturnsAsync(user);
            userManager.Setup(u => u.CheckPasswordAsync(user, dto.Password)).ReturnsAsync(true);
            userManager.Setup(u => u.GetRolesAsync(user)).ReturnsAsync(new List<string> { Roles.Student });
            userManager.Setup(u => u.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

            var result = await controller.Login(dto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = okResult.Value!;
            var userId = value.GetType().GetProperty("userId")?.GetValue(value) as string;
            var role = value.GetType().GetProperty("role")?.GetValue(value) as string;
            Assert.Equal(user.Id, userId);
            Assert.Equal(Roles.Student, role);
        }

        [Theory]
        [InlineData("notfound@example.com", "Pass123!")]
        [InlineData("john@example.com", "WrongPassword")]
        public async Task Login_InvalidCredentials_ReturnsUnauthorizedObjectResult(string email, string password)
        {
            var userManager = MockUserManager();
            var signInManager = MockSignInManager(userManager);
            var config = BuildConfig();
            var userService = new Mock<IUserService>();
            var controller = new AccountController(userManager.Object, signInManager.Object, config);

            var dto = new LoginDTO { Email = email, Password = password };
            var user = new ApplicationUser { Id = "1", Email = "john@example.com", UserName = "john@example.com" };

            userManager.Setup(u => u.FindByEmailAsync(email)).ReturnsAsync(email == user.Email ? user : null);
            userManager.Setup(u => u.CheckPasswordAsync(user, password)).ReturnsAsync(false);

            var result = await controller.Login(dto);

            Assert.IsType<UnauthorizedObjectResult>(result);
        }
    }
}
