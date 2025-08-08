using server.DTOs;

namespace server.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsersAsync();
        Task<UserDTO?> GetUserByIdAsync(string userId);
        Task<bool> UpdateUserByAdminAsync(string userId, UpdateUserDTO dto);
    }
}
