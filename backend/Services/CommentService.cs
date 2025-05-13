using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class CommentService : ICommentService
    {
        private readonly ApplicationDbContext _context;

        public CommentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> CommentOnVideoAsync(string videoId, string recruiterId, string content)
        {
            var comment = new Comment
            {
                VideoId = videoId,
                RecruiterId = recruiterId,
                Content = content,
                CommentDate = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return comment;
        }

        public async Task<IEnumerable<Comment>> GetCommentsByVideoIdAsync(string videoId)
        {
            return await _context.Comments
                .Where(c => c.VideoId == videoId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Comment>> GetCommentsByStudentIdAsync(string studentId)
        {
            return await _context.Comments
                .Where(c => c.StudentId == studentId)
                .ToArrayAsync();
        }

        public async Task<bool> CommentOnStudentAsync(string recruiterId, string studentId, CommentDTO commentDTO)
        {
            var comment = new Comment
            {
                RecruiterId = recruiterId,
                StudentId = studentId,
                Content = commentDTO.Content,
                VideoId = commentDTO.VideoId
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<CommentDTO> AddComment(string studentId, CommentDTO commentDto)
        {
            var comment = new Comment
            {
                StudentId = commentDto.StudentId,
                Content = commentDto.Content,
                CommentDate = DateTime.Now,

            };
         
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return commentDto ;
        }

        public async Task<IEnumerable<Comment>> GetComments(string studentId)
        {
            // Fetch comments for the student
            return await _context.Comments
                .Where(c => c.StudentId == studentId)
                .ToArrayAsync();
        }
    }
}
