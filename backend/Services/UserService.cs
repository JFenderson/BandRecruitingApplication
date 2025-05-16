using Microsoft.AspNetCore.Identity;
using server.DTOs;
using server.Services.Interfaces;

namespace server.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<UserDTO>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();

            var result = new List<UserDTO>();

            foreach (var user in users)
            {
                result.Add(new UserDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    UserType = user.UserType
                });
            }

            return result;
        }
    }
}
