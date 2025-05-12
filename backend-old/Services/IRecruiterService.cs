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
        Task<RecruiterDTO> GetRecruiterByIdAsync(string recruiterId);
        Task<ApplicationUser> CreateRecruiterAsync(CreateRecruiterDTO recruiterDTO);
        Task<bool> UpdateRecruiterAsync(string recruiterId, UpdateRecruiterDTO recruiterDTO);
        Task<bool> DeleteRecruiterAsync(string recruiterId);
    }
}
