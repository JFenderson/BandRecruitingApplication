using Moq;
using Xunit;
using FluentAssertions;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;
using BandRecruitingApp.Core.Interfaces;
using System;

namespace BandRecruitingApp.UnitTests.Services;

public class RatingServiceTests
{
    private readonly Mock<IRatingRepository> _mockRepo;
    private readonly RatingService _service;

    public RatingServiceTests()
    {
        _mockRepo = new Mock<IRatingRepository>();
        _service = new RatingService(_mockRepo.Object);
    }

    [Fact]
    public void AddRating_ShouldThrow_WhenScoreIsInvalid()
    {
        var dto = new AddRatingDTO { VideoId = 1, RecruiterId = 2, Score = 11 };

        Action act = () => _service.AddRating(dto);

        act.Should().Throw<ArgumentException>()
            .WithMessage("Score must be between 1 and 10.");
    }

    [Fact]
    public void AddRating_ShouldCallRepository_WhenScoreIsValid()
    {
        var dto = new AddRatingDTO { VideoId = 1, RecruiterId = 2, Score = 9 };

        _service.AddRating(dto);

        _mockRepo.Verify(r => r.Add(It.Is<Core.Entities.Rating>(
            x => x.VideoId == dto.VideoId &&
                 x.RecruiterId == dto.RecruiterId &&
                 x.Score == dto.Score
        )), Times.Once);
    }
}
