using Microsoft.AspNetCore.Http;
using Models;
using server.DTOs;

namespace server.Services
{
    public interface IVideoService : IService<Video>
    {
        Task<IEnumerable<Rating>> GetVideoRatingsAsync(string videoId);
        Task<Video> GetVideoByIdAsync(string videoId);
        Task<IEnumerable<Comment>> GetVideoCommentsAsync(string videoId);
        Task<double> GetAverageRatingAsync(string videoId);

        Task AddAsync(Video video);
        Task<UploadedVideoResult> UploadVideoAsync(CreateVideoDTO request, string studentId);
        Task<string> SaveVideoAsync(IFormFile file);

    }
}
