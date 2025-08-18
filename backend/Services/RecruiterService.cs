using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class RecruiterService : Service<ApplicationUser>, IRecruiterService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public RecruiterService(ApplicationDbContext context, UserManager<ApplicationUser> userManager) : base(context)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IEnumerable<ApplicationUser>> GetRecruitersByBandAsync(Guid bandId)
        {
            return await _context.Users
                .Where(r => r.BandId == bandId)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Rating>> GetRecruiterRatingsAsync(string recruiterId)
        {
            return await _context.Ratings
                .Where(r => r.RecruiterId == recruiterId)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Comment>> GetRecruiterCommentsAsync(string recruiterId)
        {
            return await _context.Comments
                .Where(c => c.RecruiterId == recruiterId)
                .ToArrayAsync();
        }

        public async Task<IEnumerable<Offer>> GetRecruiterOffersAsync(string recruiterId)
        {
            return await _context.Offers
                .Where(c => c.RecruiterId == recruiterId)
                .ToArrayAsync();
        }


        public async Task<IEnumerable<ApplicationUser>> GetRecruitersAsync()
        {
            return await _context.Users
                .ToArrayAsync();
        }

        public async Task<UserDTO> GetRecruiterByIdAsync(string recruiterId)
        {
            var recruiter = await _context.Users
                .FirstOrDefaultAsync(r => r.Id == recruiterId);

            if (recruiter == null)
            {
                throw new Exception("Recruiter not found.");
            }

            var RecruiterDto = new UserDTO();

            return RecruiterDto;

        }

        public async Task<ApplicationUser> CreateRecruiterAsync(CreateUserDTO createUserDTO)
        {

            // Check if the email already exists
            var existingUserByEmail = await _userManager.FindByEmailAsync(createUserDTO.Email);
            if (existingUserByEmail != null)
            {
                throw new Exception("A user with this email already exists.");
            }



            var recruiter = new ApplicationUser
            {
                UserType = "Recruiter",
                Email = createUserDTO.Email,
                FirstName = createUserDTO.FirstName,
                LastName = createUserDTO.LastName,
                BandId = createUserDTO.BandId,
                Phone = createUserDTO.Phone,
                ProfilePicture = createUserDTO.ProfilePicture,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(recruiter, createUserDTO.Password);

            if (!result.Succeeded)
            {
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            // Optionally, assign a role to the recruiter
            await _userManager.AddToRoleAsync(recruiter, "Recruiter");
            return recruiter;
        }

        public async Task<bool> UpdateRecruiterAsync(string recruiterId, UpdateUserDTO updateUserDTO)
        {
            var recruiter = await _context.Users.FirstOrDefaultAsync(r => r.Id == recruiterId);

            if (recruiter == null) return false;

            recruiter.FirstName = updateUserDTO.FirstName;
            recruiter.LastName = updateUserDTO.LastName;
            recruiter.Email = updateUserDTO.Email;


            _context.Users.Update(recruiter);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteRecruiterAsync(string recruiterId)
        {
            var recruiter = await _context.Users.FirstOrDefaultAsync(r => r.Id == recruiterId);

            if (recruiter == null) return false;

            _context.Users.Remove(recruiter);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
