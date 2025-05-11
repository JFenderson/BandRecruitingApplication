using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using BandRecruiting.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public class VideoRepository : IVideoRepository
{
    private readonly ApplicationDbContext _context;

    public VideoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Video?> GetByIdAsync(Guid videoId)
    {
        return await _context.Videos
            .Include(v => v.Student)
            .FirstOrDefaultAsync(v => v.VideoId == videoId);
    }

    public void Delete(Video video)
    {
        _context.Videos.Remove(video);
    }

    public Task<int> SaveChangesAsync()
    {
        return _context.SaveChangesAsync();
    }
}

