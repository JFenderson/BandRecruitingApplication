using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using BandRecruiting.Infrastructure.Persistence;

namespace BandRecruitingApp.Infrastructure.Services
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Add(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }

        public void Update(Comment comment)
        {
            _context.Comments.Update(comment);
        }

        public void Delete(Comment comment)
        {
            _context.Comments.Remove(comment);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public Comment? GetById(Guid id)
        {
            return _context.Comments.FirstOrDefault(c => c.CommentId == id);
        }

        public IEnumerable<Comment> GetByVideoId(Guid videoId)
        {
            return _context.Comments
                .Where(c => c.VideoId == videoId)
                .OrderByDescending(c => c.CreatedAt)
                .ToList();
        }

        public async Task<Comment?> GetByIdAsync(Guid commentId)
        {
            return await _context.Comments.FindAsync(commentId);
        }
    }
}
