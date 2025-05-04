using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Core.Entities;
using BandRecruitingApp.Core.Interfaces;
using System;

namespace BandRecruitingApp.Application.Services;

public class RatingService : IRatingService
{
    private readonly IRatingRepository _repository;

    public RatingService(IRatingRepository repository)
    {
        _repository = repository;
    }

    public void AddRating(AddRatingDTO dto)
    {
        if (dto.Score < 1 || dto.Score > 10)
            throw new ArgumentException("Score must be between 1 and 10.");

        var rating = new Rating
        {
            VideoId = dto.VideoId,
            RecruiterId = dto.RecruiterId,
            Score = dto.Score
        };

        _repository.Add(rating);
    }
}
