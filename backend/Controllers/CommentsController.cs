using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;

namespace server.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            return await _context.Comments.ToListAsync();
        }

        // GET: api/Comments/5
        [HttpGet("{commentId}")]
        public async Task<ActionResult<Comment>> GetComment(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        [HttpGet("students/{studentId}/comments")]
        public async Task<IActionResult> GetComments(string studentId)
        {
            // Fetch comments for the student
            var comments = await _context.Comments
                .Where(c => c.StudentId == studentId)
                .ToListAsync();
            return Ok(comments);
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{commentId}")]
        [Authorize(Roles = "Recruiter")]
        public async Task<IActionResult> PutComment(string commentId, Comment comment)
        {
            if (commentId != comment.CommentId)
            {
                return BadRequest();
            }

            _context.Entry(comment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(commentId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Recruiter")]
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { id = comment.CommentId }, comment);
        }

        [HttpPost("students/{studentId}/comments")]
        [Authorize(Roles = "Recruiter")]
        public async Task<IActionResult> AddComment(string studentId, [FromBody] Comment comment)
        {
            // Logic to save the comment to the database
            comment.StudentId = studentId;
            comment.CommentDate = DateTime.UtcNow;
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return Ok(comment);
        }

        // DELETE: api/Comments/5
        [HttpDelete("{commentId}")]
        [Authorize(Roles = "Recruiter")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }




        private bool CommentExists(string commentId)
        {
            return _context.Comments.Any(e => e.CommentId == commentId);
        }
    }
}
