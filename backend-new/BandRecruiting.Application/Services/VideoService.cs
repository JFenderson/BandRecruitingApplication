using BandRecruiting.Application.Services;
using BandRecruiting.Core.Interfaces;

public class VideoService : IVideoService
{
    private readonly IVideoRepository _repo;

    public VideoService(IVideoRepository repo)
    {
        _repo = repo;
    }

    public async Task<bool> DeleteVideoAsync(Guid videoId, string userId)
    {
        var video = await _repo.GetByIdAsync(videoId);

        if (video == null || video.Student?.UserId != userId)
            return false;

        _repo.Delete(video);
        await _repo.SaveChangesAsync();
        return true;
    }
}
