using Models;
using server.DTOs;

namespace server.Services
{
    public interface IStudentService : IService<ApplicationUser>
    {
        Task<ApplicationUser> CreateStudentAsync(CreateStudentDTO createStudentDTO);
        Task<ApplicationUser> UpdateStudentAsync(string id, UpdateStudentDTO updateStudentDTO);
        Task<StudentDTO> GetStudentByIdAsync(string id);
        Task<IEnumerable<ApplicationUser>> GetAllStudentsAsync();
        Task<bool> DeleteStudentAsync(string id);

        Task<IEnumerable<ApplicationUser>> GetStudentsByGradYearAsync(int gradYear);
        // Other methods as needed for student-related logic
        Task<IEnumerable<ApplicationUser>> GetStudentsByInstrumentAsync(string studentId, string instrument);
        Task<IEnumerable<Video>> GetStudentVideosAsync(string studentId);
        Task<IEnumerable<Offer>> GetStudentScholarshipOffersAsync(string studentId);
        Task<IEnumerable<Rating>> GetStudentRatingsAsync(string studentId);
        Task<IEnumerable<Comment>> GetStudentCommentsAsync(string studentId);
        Task<int> GetStudentOfferCountAsync(string studentId);

        Task<InterestDTO> AddInterestAsync(CreateInterestDTO createInterestDTO);
        Task<IEnumerable<InterestDTO>> GetStudentInterestsAsync(string studentId);
    }
}
