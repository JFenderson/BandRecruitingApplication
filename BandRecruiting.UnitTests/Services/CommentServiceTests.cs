using BandRecruiting.Core.Interfaces;
using BandRecruitingApp.Application.Services;
using FluentAssertions;
using Moq;

namespace BandRecruitingApp.UnitTests.Services;

public class CommentServiceTests
{
    private readonly Mock<ICommentRepository> _mockRepo;
    private readonly CommentService _service;

    public CommentServiceTests()
    {
        _mockRepo = new Mock<ICommentRepository>();
        _service = new CommentService(_mockRepo.Object);
    }

    [Fact]
    public async Task AddComment_ShouldThrow_WhenTextIsEmpty()
    {
        var videoId = Guid.NewGuid();
        var recruiterId = "";

        Func<Task> act = async () => await _service.AddCommentAsync(videoId, recruiterId, "  ");

        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("Comment text cannot be empty.");
    }

    [Fact]
    public async Task AddComment_ShouldCallRepository_WhenValid()
    {
        var videoId = Guid.NewGuid();
        var recruiterId = "123";
        var text = "This is a comment.";

        await _service.AddCommentAsync(videoId, recruiterId, text);

        _mockRepo.Verify(r => r.Add(It.Is<BandRecruiting.Core.Entities.Comment>(
            c => c.VideoId == videoId &&
                 c.RecruiterId == recruiterId &&
                 c.Text == text
        )), Times.Once);
    }
}
