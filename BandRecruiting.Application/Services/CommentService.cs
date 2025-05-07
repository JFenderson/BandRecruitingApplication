using BandRecruiting.Application.DTOs;
using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using BandRecruitingApp.Application.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _repo;

    public CommentService(ICommentRepository repo)
    {
        _repo = repo;
    }

    public async Task AddCommentAsync(Guid videoId, string recruiterId, string text)
    {
        var comment = new Comment
        {
            CommentId = Guid.NewGuid(),
            VideoId = videoId,
            RecruiterId = recruiterId,
            Text = text,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.Add(comment); // ✅ This must be in the ICommentRepository interface
        await _repo.SaveChangesAsync();
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, string userId)
    {
        var comment = _repo.GetById(commentId);
        if (comment == null || comment.RecruiterId.ToString() != userId) return false;

        _repo.Delete(comment);
        return await _repo.SaveChangesAsync() > 0;
    }

    public void Update(Comment comment)
    {
        _repo.Update(comment);
    }

    public async Task<bool> UpdateCommentAsync(Guid commentId, string recruiterId, string newText)
    {
        var comment = _repo.GetById(commentId);
        if (comment == null || comment.RecruiterId.ToString() != recruiterId) return false;

        comment.Text = newText;
        _repo.Update(comment);
        return await _repo.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<CommentDTO>> GetCommentsByVideoIdAsync(Guid videoId)
    {
        var comments = _repo.GetByVideoId(videoId);
        return comments.Select(c => new CommentDTO
        {
            CommentId = c.CommentId,
            VideoId = c.VideoId,
            RecruiterId = c.RecruiterId,
            Text = c.Text,
            CreatedAt = c.CreatedAt
        });
    }

    public async Task<CommentDTO?> GetByIdAsync(Guid commentId)
    {
        var comment = _repo.GetById(commentId);
        if (comment == null) return null;

        return new CommentDTO
        {
            CommentId = comment.CommentId,
            VideoId = comment.VideoId,
            RecruiterId = comment.RecruiterId,
            Text = comment.Text,
            CreatedAt = comment.CreatedAt
        };
    }

    public async Task<bool> DeleteAsync(Guid commentId)
    {
        var comment = _repo.GetById(commentId);
        if (comment == null) return false;

        _repo.Delete(comment);
        return await _repo.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(Guid commentId, string newText)
    {
        var comment = _repo.GetById(commentId);
        if (comment == null) return false;

        comment.Text = newText;
        _repo.Update(comment);
        return await _repo.SaveChangesAsync() > 0;
    }
}
