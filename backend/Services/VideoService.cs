using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class VideoService : Service<Video>, IVideoService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public VideoService(ApplicationDbContext context, IAmazonS3 s3Client, IConfiguration configuration) : base(context)
        {
            _s3Client = s3Client;
            _bucketName = configuration["band-recruiting-videos"];
        }

        public async Task<IEnumerable<Rating>> GetVideoRatingsAsync(string videoId)
        {
            return await _context.Ratings
                .Where(r => r.VideoId == videoId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Comment>> GetVideoCommentsAsync(string videoId)
        {
            return await _context.Comments
                .Where(c => c.VideoId == videoId)
                .ToListAsync();
        }

        public async Task<double> GetAverageRatingAsync(string videoId)
        {
            return await _context.Ratings
                .Where(r => r.VideoId == videoId)
                .AverageAsync(r => r.Score);
        }

        public async Task AddAsync(Video video)
        {
            _context.Videos.Add(video);
            await _context.SaveChangesAsync();
        }

        public async Task<string> SaveVideoAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided.");

            var filePath = Path.Combine("wwwroot/videos", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the relative path to the video
            return $"/videos/{file.FileName}";
        }

        public async Task<UploadedVideoResult> UploadVideoAsync(CreateVideoDTO request, string studentId)
        {
            var key = $"{Guid.NewGuid()}_{request.File.FileName}";

            using var stream = request.File.OpenReadStream();
            await new TransferUtility(_s3Client).UploadAsync(stream, _bucketName, key);

            return new UploadedVideoResult
            {
                Title = request.Title,
                Description = request.Description,
                StudentId = studentId,
                VideoUrl = $"https://{_bucketName}.s3.amazonaws.com/{key}",
                CreatedAt = DateTime.UtcNow
            };
        }


    }
}
