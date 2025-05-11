using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class RatingService : IRatingService
    {
        private readonly ApplicationDbContext _context;

        public RatingService(ApplicationDbContext context)
        {
            _context = context;
        }


        // Optionally, fetch ratings for both student and video
        public async Task<IEnumerable<Rating>> GetRatingsByStudentId(string studentId)
        {
            return await _context.Ratings
                .Where(r => r.StudentId == studentId && r.VideoId == null)
                .ToListAsync(); // Fetch only student ratings
        }

        public async Task<IEnumerable<Rating>> GetRatingsByVideoId(string videoId)
        {
            return await _context.Ratings
                .Where(r => r.VideoId == videoId)
                .ToListAsync(); // Fetch only video ratings
        }

        public async Task<double> GetAverageRatingForStudentAsync(string studentId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.StudentId == studentId)
                .ToListAsync();

            if (ratings.Any())
            {
                return ratings.Average(r => r.Score);
            }

            return 0.0;
        }

        public async Task<Rating> RateStudentAsync(string recruiterId, string studentId, CreateRatingDTO ratingDTO)
        {
            var recruiterExists = await _context.Users.AnyAsync(u => u.Id == recruiterId);
            if (!recruiterExists)
            {
                throw new Exception("Recruiter does not exist.");
            }

            var rating = new Rating
            {
                RatingId = Guid.NewGuid().ToString(),
                RecruiterId = recruiterId,
                StudentId = studentId,
                Score = ratingDTO.Score,
                Comment = ratingDTO.Comment,
                RatingDate = ratingDTO.RatingDate,
            };

            if (!string.IsNullOrEmpty(ratingDTO.VideoId)) // Only set VideoId if it's provided
            {
                rating.VideoId = ratingDTO.VideoId;
            }

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return rating;
        }

        public async Task<Rating> AddOrUpdateRatingAsync(string studentId, string recruiterId, int score)
        {
            // Check if this recruiter has already rated this student
            var existingRating = await _context.Ratings
                .FirstOrDefaultAsync(r => r.StudentId == studentId && r.RecruiterId == recruiterId);
            var newRating = new Rating();

            if (existingRating != null)
            {
                existingRating.Score = score;  // Update existing rating
                _context.Ratings.Update(existingRating);


            }
            else
            {


                newRating.RatingId = Guid.NewGuid().ToString();
                newRating.StudentId = studentId;
                newRating.RecruiterId = recruiterId;
                newRating.Score = score;
                

                _context.Ratings.Add(newRating);
            }

            await _context.SaveChangesAsync();

            // Recalculate the student's average rating
            await UpdateStudentAverageRatingAsync(studentId);

            return existingRating ?? newRating;
        }

        private async Task UpdateStudentAverageRatingAsync(string studentId)
        {

            var ratings = await _context.Ratings
                .Where(r => r.StudentId == studentId)
                .ToListAsync();

            if (ratings.Any())
            {
                int averageRating = (int)ratings.Average(r => r.Score);
                //var student = await _context.Students.FindAsync(studentId);
                var student = await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.Id == studentId.ToString());

                if (student != null)
                {
                    student.AverageRating = averageRating;
                    _context.Users.Update(student);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
