using BandRecruiting.Core.Interfaces;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;
using FluentAssertions;
using Moq;

namespace BandRecruitingApp.UnitTests.Services
{
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
        public async Task AddRating_ShouldThrow_WhenScoreIsInvalid()
        {
            var dto = new AddRatingDTO
            {
                VideoId = Guid.NewGuid(),
                RecruiterId = "1",
                Score = 11
            };

            Func<Task> act = async () =>
                await _service.AddRatingAsync(dto.VideoId, dto.RecruiterId, dto.Score);

            await act.Should().ThrowAsync<ArgumentException>()
                .WithMessage("Score must be between 1 and 10.");
        }

        [Fact]
        public async Task AddRating_ShouldCallRepository_WhenScoreIsValid()
        {
            var dto = new AddRatingDTO
            {
                VideoId = Guid.NewGuid(),
                RecruiterId = "1",
                Score = 9
            };

            await _service.AddRatingAsync(dto.VideoId, dto.RecruiterId, dto.Score);

            _mockRepo.Verify(r => r.AddAsync(It.Is<BandRecruiting.Core.Entities.Rating>(x =>
                x.VideoId == dto.VideoId &&
                x.RecruiterId == dto.RecruiterId &&
                x.Score == dto.Score
            )), Times.Once);
        }
    }
}
