using server.DTOs;
using Models;

namespace server.Services
{
    public interface IStudentService : IService<Student>
    {
        Task<Student> CreateStudentAsync(CreateStudentDTO createStudentDTO);
        Task<Student> UpdateStudentAsync(string id, UpdateStudentDTO updateStudentDTO);
        Task<StudentDTO> GetStudentByIdAsync(string id);
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task<bool> DeleteStudentAsync(string id);

        Task<IEnumerable<Student>> GetStudentsByGradYearAsync(int gradYear);
        // Other methods as needed for student-related logic
        Task<IEnumerable<Student>> GetStudentsByInstrumentAsync(string studentId, string instrument);
        Task<IEnumerable<Video>> GetStudentVideosAsync(string studentId);
        Task<IEnumerable<Offer>> GetStudentScholarshipOffersAsync(string studentId);
        Task<IEnumerable<Rating>> GetStudentRatingsAsync(string studentId);
        Task<IEnumerable<Comment>> GetStudentCommentsAsync(string studentId);
        Task<int> GetStudentOfferCountAsync(string studentId);

        Task<InterestDTO> AddInterestAsync(CreateInterestDTO createInterestDTO);
        Task<IEnumerable<InterestDTO>> GetStudentInterestsAsync(string studentId);
    }
}
