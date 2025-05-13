using Models;
using server.DTOs;

namespace server.Services
{
    public interface IRatingService
    {
        Task<Rating> AddOrUpdateRatingAsync(string studentId, string recruiterId, int score);
        Task<IEnumerable<Rating>> GetRatingsByStudentId(string studentId);
        Task<IEnumerable<Rating>> GetRatingsByVideoId(string videoId);
        //Task<Rating> AddRatingAsync(string studentId, string recruiterId, int score);
        //Task<IEnumerable<Rating>> GetRatingsByStudentIdAsync(string studentId);
        Task<double> GetAverageRatingForStudentAsync(string studentId);
        Task<Rating> RateStudentAsync(string recruiterId, string studentId, CreateRatingDTO ratingDTO);
    }
}
