using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public DashboardService(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<DashboardSummaryDTO> GetDashboardSummaryAsync()
        {
            var users = await _userManager.Users.ToListAsync();

            var totalStudents = users.Count(u => u.UserType == "Student");
            var totalRecruiters = users.Count(u => u.UserType == "Recruiter");
            var totalOffers = await _context.Offers.CountAsync();

            return new DashboardSummaryDTO
            {
                TotalStudents = totalStudents,
                TotalRecruiters = totalRecruiters,
                TotalOffers = totalOffers
            };
        }
    }




}
