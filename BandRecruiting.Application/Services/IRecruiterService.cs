using BandRecruiting.Application.DTOs;

namespace BandRecruitingApp.Application.Services
{
    public interface IRecruiterService
    {
        void CreateRecruiter(string userId, CreateRecruiterDTO dto);
        Recruiter? GetByUserId(string userId);
        Recruiter? GetById(Guid id);
        RecruiterProfileDTO? GetRecruiterProfile(string userId);
        IEnumerable<Recruiter> GetAll();
        bool UpdateRecruiter(string userId, UpdateRecruiterDTO dto);
        bool DeleteByUserId(string userId);
        Task<RecruiterProfileDTO?> GetRecruiterProfileAsync(string userId);
        IEnumerable<RecruiterProfileDTO> GetRecruitersByBand(Guid bandId);

        IEnumerable<RecruiterProfileDTO> GetByBandId(Guid bandId);
    }
}
