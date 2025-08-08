using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Services.Interfaces;

namespace server.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<UserDTO>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();

            var result = new List<UserDTO>();

            foreach (var user in users)
            {
                result.Add(new UserDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    UserType = user.UserType
                });
            }

            return result;
        }

        public async Task<UserDTO> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user.UserType == "Student")
            {
                return new UserDTO
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.Phone,
                    HighSchool = user.HighSchool,
                    GraduationYear = user.GraduationYear,
                    Instrument = user.Instrument



                };
            }
            else
            {
                return new UserDTO
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Phone = user.Phone,
                    BandId = user.BandId,

                };
            }


        }

        public async Task<bool> UpdateUserByAdminAsync(string userId, UpdateUserDTO dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.FirstName))
                user.FirstName = dto.FirstName;

            if (!string.IsNullOrEmpty(dto.LastName))
                user.LastName = dto.LastName;

            if (!string.IsNullOrEmpty(dto.Phone))
                user.PhoneNumber = dto.Phone;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!result.Succeeded)
                    return false;
            }

            // If Student
            if (user.UserType == "Student")
            {
                var student = await _userManager.Users.FirstOrDefaultAsync(s => s.Id == user.Id);
                if (student != null)
                {
                    student.Instrument = dto.Instrument;
                    student.HighSchool = dto.HighSchool;
                    student.GraduationYear = dto.GraduationYear;
                    student.ProfilePicture = dto.ProfilePicture;
                }
            }

            // If Recruiter
            if (user.UserType == "Recruiter")
            {
                var recruiter = await _userManager.Users.FirstOrDefaultAsync(r => r.Id == user.Id);
                if (recruiter != null)
                {
                    recruiter.BandId = dto.BandId;
                }
            }

            await _userManager.UpdateAsync(user);
            return true;
        }
    }
}
