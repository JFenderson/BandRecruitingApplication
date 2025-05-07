namespace BandRecruiting.Application.Services
{
    public interface IVideoService
    {
        Task<bool> DeleteVideoAsync(Guid videoId, string userId);
    }
}
