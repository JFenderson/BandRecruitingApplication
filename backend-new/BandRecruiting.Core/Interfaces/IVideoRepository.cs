using BandRecruiting.Core.Entities;

namespace BandRecruiting.Core.Interfaces
{
    public interface IVideoRepository
    {
        Task<Video?> GetByIdAsync(Guid videoId);
        void Delete(Video video);
        Task<int> SaveChangesAsync();
    }
}

