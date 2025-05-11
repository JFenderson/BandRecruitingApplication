using server.DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using Microsoft.AspNetCore.Identity;
using server.Models;

namespace server.Services
{
    public class StudentService : Service<Student>, IStudentService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public StudentService(ApplicationDbContext context, UserManager<User> userManager) : base(context)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<Student> CreateStudentAsync(CreateStudentDTO createStudentDTO)
        {
            // Check if the email already exists
            var existingUserByEmail = await _userManager.FindByEmailAsync(createStudentDTO.Email);
            if (existingUserByEmail != null)
            {
                throw new Exception("A user with this email already exists.");
            }

            // Check if the username already exists
            var existingUserByUsername = await _userManager.FindByNameAsync(createStudentDTO.UserName);
            if (existingUserByUsername != null)
            {
                throw new Exception("A user with this username already exists.");
            }

            // Proceed with creating the student
            var student = new Student
            {
                UserName = createStudentDTO.UserName,
                Email = createStudentDTO.Email,
                FirstName = createStudentDTO.FirstName,
                LastName = createStudentDTO.LastName,
                Phone = createStudentDTO.Phone,
                GraduationYear = createStudentDTO.GraduationYear,
                Instrument = createStudentDTO.Instrument,
                HighSchool = createStudentDTO.HighSchool,
                ProfilePicture = createStudentDTO.ProfilePicture,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(student, createStudentDTO.Password);

            if (!result.Succeeded)
            {
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            // Optionally, assign a role to the student
            await _userManager.AddToRoleAsync(student, "Student");

            return student;
        }

        public async Task<Student> UpdateStudentAsync(string id, UpdateStudentDTO updateStudentDTO)
        {
            var student = await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.Id == id.ToString());

            if (student == null)
            {
                throw new Exception("Student not found.");
            }

            if (!string.IsNullOrEmpty(updateStudentDTO.FirstName))
            {
                student.FirstName = updateStudentDTO.FirstName;
            }
            if (!string.IsNullOrEmpty(updateStudentDTO.LastName))
            {
                student.LastName = updateStudentDTO.LastName;
            }
            if (!string.IsNullOrEmpty(updateStudentDTO.Email))
            {
                student.Email = updateStudentDTO.Email;
            }
            if (updateStudentDTO.GraduationYear.HasValue)
            {
                student.GraduationYear = updateStudentDTO.GraduationYear.Value;
            }
            if (!string.IsNullOrEmpty(updateStudentDTO.Instrument))
            {
                student.Instrument = updateStudentDTO.Instrument;
            }
            if (!string.IsNullOrEmpty(updateStudentDTO.HighSchool))
            {
                student.HighSchool = updateStudentDTO.HighSchool;
            }
            if (!string.IsNullOrEmpty(updateStudentDTO.ProfilePicture))
            {
                student.ProfilePicture = updateStudentDTO.ProfilePicture;
            }

            _context.Users.Update(student);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Updated student: {student.Id}, {student.FirstName} {student.LastName}");


            return student;
        }

        public async Task<StudentDTO> GetStudentByIdAsync(string id)
        {
            var student = await _context.Users.OfType<Student>()
                .Include(s => s.Videos)  // Fetch related videos
                .Include(s => s.ScholarshipOffers)  // Fetch related scholarship offers
                .Include(s => s.Ratings)  // Fetch related ratings
                .FirstOrDefaultAsync(s => s.Id == id);  // Find student by ID

            if (student == null)
            {
                throw new Exception("Student not found.");
            }

            // Calculate the average rating
            var averageRating = student.Ratings.Any()
                ? student.Ratings.Average(r => r.Score)
                : 0;

            // Create the StudentDTO object
            var studentDto = new StudentDTO(student)
            {
                AverageRating = (decimal)averageRating,  // Assign average rating
                OfferCount = await GetStudentOfferCountAsync(student.Id)  // Fetch offer count
            };

            return studentDto;
        }


        public async Task<int> GetStudentOfferCountAsync(string studentId)
        {
            return await _context.Offers
                .Where(o => o.StudentId == studentId)
                .CountAsync();
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            return await _context.Users
                .OfType<Student>()
                .Include(s => s.Videos)
                .Include(s => s.ScholarshipOffers)
                .ToArrayAsync();
        }

        public async Task<bool> DeleteStudentAsync(string id)
        {
            var student = await _context.Users.OfType<Student>().FirstOrDefaultAsync(s => s.Id == id.ToString());

            if (student == null)
            {
                return false;
            }

            _context.Users.Remove(student);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<IEnumerable<Student>> GetStudentsByGradYearAsync(int gradYear)
        {
            return await _context.Users
                .OfType<Student>()
                .Where(r => r.GraduationYear == gradYear)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Rating>> GetStudentRatingsAsync(string studentId)
        {
            return await _context.Ratings
                .Where(r => r.StudentId == studentId)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Comment>> GetStudentCommentsAsync(string studentId)
        {
            return await _context.Comments
                .Where(c => c.StudentId == studentId)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Student>> GetStudentsByInstrumentAsync(string studentId, string instrument)
        {
            return await _context.Users
                .OfType<Student>()
                .Where(i => i.Id == studentId)
                .Where(s => s.Instrument == instrument)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Video>> GetStudentVideosAsync(string studentId)
        {
            return await _context.Videos
                .Where(v => v.StudentId == studentId)
                .ToArrayAsync();
        }



        public async Task<InterestDTO> AddInterestAsync(CreateInterestDTO createInterestDTO)
        {
            var interest = new Interest
            {
                StudentId = createInterestDTO.StudentId,
                BandId = createInterestDTO.BandId,
                InterestDate = DateTime.UtcNow
            };

            _context.ChangeTracker.Clear();
            _context.Interests.Add(interest);
            await _context.SaveChangesAsync();

            return new InterestDTO
            {
                InterestId = interest.InterestId,
                StudentId = interest.StudentId,
                BandId = interest.BandId,
                InterestDate = interest.InterestDate
            };

        }

        public async Task<IEnumerable<InterestDTO>> GetStudentInterestsAsync(string studentId)
        {
            var interests = await _context.Interests
                .Where(i => i.StudentId == studentId)
                .Select(i => new InterestDTO
                {
                    InterestId = i.InterestId,
                    StudentId = i.StudentId,
                    BandId = i.BandId,
                    BandName = i.Band.Name,
                    SchoolName = i.Band.SchoolName,
                    InterestDate = i.InterestDate
                })
                .ToArrayAsync();

            return interests;
        }

        public async Task<IEnumerable<Offer>> GetStudentScholarshipOffersAsync(string studentId)
        {
            return await _context.Offers
                .Where(o => o.StudentId == studentId)
                .ToArrayAsync();
        }

        public async Task<decimal?> GetStudentOverallRatingAsync(string studentId)
        {
            var ratings = await _context.Ratings
                .Where(r => r.StudentId == studentId)
                .ToArrayAsync();

            if (ratings == null || !ratings.Any())
            {
                return null; // No ratings available
            }

            return (decimal)ratings.Average(r => r.Score);
        }

    }
}
