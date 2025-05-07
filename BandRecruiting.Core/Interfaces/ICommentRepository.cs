using BandRecruiting.Core.Entities;

namespace BandRecruiting.Core.Interfaces
{
    public interface ICommentRepository
    {
        Task Add(Comment comment); // ✅ Ensure this method exists
        void Update(Comment comment);
        void Delete(Comment comment);
        Task<int> SaveChangesAsync();

        Comment? GetById(Guid id);
        IEnumerable<Comment> GetByVideoId(Guid videoId);

    }
}
