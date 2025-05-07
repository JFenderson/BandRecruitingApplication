namespace BandRecruiting.Application.Services
{
    public interface IRatingService
    {
        // Example method
        Task AddRatingAsync(Guid videoId, string recruiterId, int score);
    }
}
