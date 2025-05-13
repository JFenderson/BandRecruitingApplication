using Models;
using server.DTOs;

namespace server.Services
{
    public interface IRecruiterService : IService<ApplicationUser>
    {
        Task<IEnumerable<ApplicationUser>> GetRecruitersAsync();
        Task<IEnumerable<ApplicationUser>> GetRecruitersByBandAsync(Guid bandId);
        Task<IEnumerable<Rating>> GetRecruiterRatingsAsync(string recruiterId);
        Task<IEnumerable<Comment>> GetRecruiterCommentsAsync(string recruiterId);
        Task<IEnumerable<Offer>> GetRecruiterOffersAsync(string recruiterId);
        Task<UserDTO> GetRecruiterByIdAsync(string recruiterId);
        Task<ApplicationUser> CreateRecruiterAsync(CreateUserDTO recruiterDTO);
        Task<bool> UpdateRecruiterAsync(string recruiterId, UpdateUserDTO recruiterDTO);
        Task<bool> DeleteRecruiterAsync(string recruiterId);
    }
}
