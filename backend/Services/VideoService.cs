using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class VideoService : Service<Video>, IVideoService
    {
        private readonly IVideoStorageProvider _storage;
        private new readonly ApplicationDbContext _ctx;

        public VideoService(ApplicationDbContext context, IVideoStorageProvider storage) : base(context)
        {
            _ctx = context;
            _storage = storage;
        }

        public async Task<Video> GetVideoByIdAsync(string videoId)
        {
            var video = await _context.Videos.FirstOrDefaultAsync(r => r.VideoId == videoId);
            if (video == null) throw new KeyNotFoundException($"Video with ID {videoId} not found.");
            return video;
        }

        public async Task<Video> UploadForStudentAsync(string studentId, CreateVideoDTO dto, CancellationToken ct = default)
        {
            var studentExists = await _ctx.Users.AnyAsync(u => u.Id == studentId, ct);
            if (!studentExists) throw new KeyNotFoundException("Student not found");

            var (url, key) = await _storage.UploadAsync(dto.File, studentId, ct);

            var entity = new Video
            {
                StudentId = studentId,
                Title = dto.Title,
                Description = dto.Description,
                VideoUrl = url,
                VideoId = key,
                CreatedAt = DateTime.UtcNow
            };

            _ctx.Videos.Add(entity);
            await _ctx.SaveChangesAsync(ct);
            return entity;
        }

        public async Task<IEnumerable<Rating>> GetVideoRatingsAsync(string videoId)
            => await _context.Ratings.Where(r => r.VideoId == videoId).ToListAsync();

        public async Task<IEnumerable<Comment>> GetVideoCommentsAsync(string videoId)
            => await _context.Comments.Where(c => c.VideoId == videoId).ToListAsync();

        public async Task<double> GetAverageRatingAsync(string videoId)
            => await _context.Ratings.Where(r => r.VideoId == videoId).AverageAsync(r => r.Score);

        public async Task AddAsync(Video video)
        {
            _context.Videos.Add(video);
            await _context.SaveChangesAsync();
        }

        // Legacy local save; safe to keep if used elsewhere
        public async Task<string> SaveVideoAsync(IFormFile file)
        {
            if (file == null || file.Length == 0) throw new ArgumentException("No file provided.");
            var filePath = Path.Combine("wwwroot/videos", file.FileName);
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            return $"/videos/{file.FileName}";
        }

        // Re-implement to use the storage provider instead of raw S3
        public async Task<UploadedVideoResult> UploadVideoAsync(CreateVideoDTO request, string studentId)
        {
            var (url, key) = await _storage.UploadAsync(request.File, studentId);
            return new UploadedVideoResult
            {
                Title = request.Title,
                Description = request.Description,
                StudentId = studentId,
                VideoUrl = url,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
