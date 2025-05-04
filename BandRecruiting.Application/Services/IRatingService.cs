using BandRecruitingApp.Application.DTOs;

namespace BandRecruitingApp.Application.Services;

public interface IRatingService
{
    void AddRating(AddRatingDTO dto);
}
