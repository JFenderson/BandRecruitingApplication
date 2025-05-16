using server.DTOs;

namespace server.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsersAsync();
    }
}
