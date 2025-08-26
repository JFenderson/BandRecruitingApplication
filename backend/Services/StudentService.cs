using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class StudentService : Service<ApplicationUser>, IStudentService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public StudentService(ApplicationDbContext context, UserManager<ApplicationUser> userManager) : base(context)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<ApplicationUser> CreateStudentAsync(CreateUserDTO createStudentDTO)
        {
            // Check if the email already exists
            var existingUserByEmail = await _userManager.FindByEmailAsync(createStudentDTO.Email);
            if (existingUserByEmail != null)
            {
                throw new Exception("A user with this email already exists.");
            }


            // Proceed with creating the student
            var student = new ApplicationUser
            {
                UserType = "Student",
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

        public async Task<ApplicationUser> UpdateStudentAsync(string id, UpdateUserDTO updateUserDTO)
        {
            var student = await _context.Users.FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
            {
                throw new Exception("Student not found.");
            }

            if (!string.IsNullOrEmpty(updateUserDTO.FirstName))
            {
                student.FirstName = updateUserDTO.FirstName;
            }
            if (!string.IsNullOrEmpty(updateUserDTO.LastName))
            {
                student.LastName = updateUserDTO.LastName;
            }
            if (!string.IsNullOrEmpty(updateUserDTO.Email))
            {
                student.Email = updateUserDTO.Email;
            }
            if (updateUserDTO.GraduationYear.HasValue)
            {
                student.GraduationYear = updateUserDTO.GraduationYear.Value;
            }
            if (!string.IsNullOrEmpty(updateUserDTO.Instrument))
            {
                student.Instrument = updateUserDTO.Instrument;
            }
            if (!string.IsNullOrEmpty(updateUserDTO.HighSchool))
            {
                student.HighSchool = updateUserDTO.HighSchool;
            }
            if (!string.IsNullOrEmpty(updateUserDTO.ProfilePicture))
            {
                student.ProfilePicture = updateUserDTO.ProfilePicture;
            }

            await _userManager.UpdateAsync(student);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Updated student: {student.Id}, {student.FirstName} {student.LastName}");


            return student;
        }

        public async Task<UserDTO> GetStudentByIdAsync(string studentId)
        {
            var student = await _context.Users
                .Include(s => s.Videos)  // Fetch related videos
                .Include(s => s.ScholarshipOffers)  // Fetch related scholarship offers
                .Include(s => s.RatingsReceived)  // Fetch related ratings
                .FirstOrDefaultAsync(s => s.Id == studentId);  // Find student by ID

            if (student == null)
            {
                throw new Exception("Student not found.");
            }

            // Calculate the average rating
            var averageRating = student.RatingsReceived.Any()
                ? student.RatingsReceived.Average(r => r.Score)
                : 0;

            return new UserDTO
            {
                Id = student.Id,
                Email = student.Email,
                UserType = student.UserType,
                FirstName = student.FirstName!,
                LastName = student.LastName!,
                Phone = student.Phone!,
                Instrument = student.Instrument,
                HighSchool = student.HighSchool,
                GraduationYear = student.GraduationYear,
                ProfilePicture = student.ProfilePicture!,
                AverageRating = (decimal)averageRating,
                OfferCount = await GetStudentOfferCountAsync(student.Id)
            };
        }


        public async Task<int> GetStudentOfferCountAsync(string studentId)
        {
            return await _context.Offers
                .Where(o => o.StudentId == studentId)
                .CountAsync();
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllStudentsAsync()
        {
            return await _context.Users
                .Where(s => s.UserType == "Student") // and not deleted due to filter
                .Include(s => s.Videos)
                .Include(s => s.ScholarshipOffers)
                .ToArrayAsync();
        }

        public async Task<bool> DeleteStudentAsync(string studentId)
        {
            var student = await _context.Users.FirstOrDefaultAsync(s => s.Id == studentId.ToString());

            if (student == null)
            {
                return false;
            }


            _context.Users.Remove(student);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SoftDeleteAsync(string studentId, CancellationToken ct = default)
        {
            var user = await _userManager.FindByIdAsync(studentId);
            if (user == null) return false;

            user.MarkAsDeleted();
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }


        public async Task<IEnumerable<ApplicationUser>> GetStudentsByGradYearAsync(int gradYear)
        {
            return await _context.Users
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

        public async Task<IEnumerable<ApplicationUser>> GetStudentsByInstrumentAsync(string studentId, string instrument)
        {
            return await _context.Users
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
                BandId = (Guid)interest.BandId,
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
                    BandId = (Guid)i.BandId,
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
