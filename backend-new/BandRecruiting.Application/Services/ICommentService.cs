using BandRecruiting.Application.DTOs;
using BandRecruiting.Core.Entities;

namespace BandRecruitingApp.Application.Services
{
    public interface ICommentService
    {
        Task AddCommentAsync(Guid videoId, string recruiterId, string text);
        Task<bool> DeleteCommentAsync(Guid commentId, string userId);
        void Update(Comment comment);

        Task<bool> UpdateCommentAsync(Guid commentId, string recruiterId, string newText);
        Task<IEnumerable<CommentDTO>> GetCommentsByVideoIdAsync(Guid videoId);

        Task<CommentDTO?> GetByIdAsync(Guid commentId);
        Task<bool> DeleteAsync(Guid commentId);
        Task<bool> UpdateAsync(Guid commentId, string newText);

    }
}
