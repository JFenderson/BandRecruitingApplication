using BandRecruiting.Application.Services;
using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;

namespace BandRecruitingApp.Application.Services;

public class RatingService : IRatingService
{
    private readonly IRatingRepository _ratingRepository;

    public RatingService(IRatingRepository ratingRepository)
    {
        _ratingRepository = ratingRepository;
    }

    public async Task AddRatingAsync(Guid videoId, string recruiterId, int score)
    {
        var rating = new Rating
        {
            RatingId = Guid.NewGuid(),
            VideoId = videoId,
            RecruiterId = recruiterId,
            Score = score,
            CreatedAt = DateTime.UtcNow
        };

        await _ratingRepository.AddAsync(rating);
    }
}
