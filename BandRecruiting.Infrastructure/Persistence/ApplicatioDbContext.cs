using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BandRecruitingApp.Core.Entities;
using BandRecruitingApp.Infrastructure.Identity;

namespace BandRecruitingApp.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Rating> Ratings { get; set; }
    public DbSet<Student> Students { get; set; }

    // Add other DbSet<...> here as needed (e.g. Videos, Students)
}
