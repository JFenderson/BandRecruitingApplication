using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using Moq;

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
    public async Task AddCommentAsync_AddsCommentSuccessfully()
    {
        // Arrange
        var videoId = Guid.NewGuid();
        var recruiterId = "recruiter123";
        var text = "Nice performance!";

        _mockRepo.Setup(r => r.Add(It.IsAny<Comment>())).Returns(Task.CompletedTask);

        // Act
        await _service.AddCommentAsync(videoId, recruiterId, text);

        // Assert
        _mockRepo.Verify(r => r.Add(It.Is<Comment>(c =>
            c.VideoId == videoId &&
            c.RecruiterId == recruiterId &&
            c.Text == text
        )), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenCommentExists_DeletesSuccessfully()
    {
        var commentId = Guid.NewGuid();
        var comment = new Comment { CommentId = commentId };

        _mockRepo.Setup(r => r.GetById(commentId)).Returns(comment);
        _mockRepo.Setup(r => r.Delete(comment));
        _mockRepo.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _service.DeleteAsync(commentId);

        Assert.True(result);
        _mockRepo.Verify(r => r.Delete(comment), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WhenCommentExists_UpdatesSuccessfully()
    {
        var commentId = Guid.NewGuid();
        var comment = new Comment { CommentId = commentId, Text = "Old text" };

        _mockRepo.Setup(r => r.GetById(commentId)).Returns(comment);
        _mockRepo.Setup(r => r.Update(It.IsAny<Comment>()));
        _mockRepo.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _service.UpdateAsync(commentId, "Updated text");

        Assert.True(result);
        Assert.Equal("Updated text", comment.Text);
        _mockRepo.Verify(r => r.Update(comment), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsCorrectCommentDTO()
    {
        var commentId = Guid.NewGuid();
        var comment = new Comment
        {
            CommentId = commentId,
            VideoId = Guid.NewGuid(),
            RecruiterId = "rec1",
            Text = "Nice!",
            CreatedAt = DateTime.UtcNow
        };
        //    _mockRepo.Setup(r => r.GetByIdAsync(commentId))
        //.ReturnsAsync(comment);

        _mockRepo.Setup(r => r.GetById(commentId)).Returns(comment);

        var result = await _service.GetByIdAsync(commentId);

        Assert.NotNull(result);
        Assert.Equal(commentId, result?.CommentId);
    }

    [Fact]
    public async Task GetCommentsByVideoIdAsync_ReturnsList()
    {
        var videoId = Guid.NewGuid();
        var comments = new List<Comment>
        {
            new Comment { CommentId = Guid.NewGuid(), VideoId = videoId, Text = "Test" }
        };

        _mockRepo.Setup(r => r.GetByVideoId(videoId)).Returns(comments);

        var result = await _service.GetCommentsByVideoIdAsync(videoId);

        Assert.Single(result);
    }
}
