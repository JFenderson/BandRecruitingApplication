using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models;

namespace server.Data
{

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        //public DbSet<Student> Students { get; set; } = default!;
        //public DbSet<Recruiter> Recruiters { get; set; } = default!;
        public DbSet<ApplicationUser> Users { get; set; } = default!;
        public DbSet<Video> Videos { get; set; } = default!;
        public DbSet<Band> Bands { get; set; } = default!;
        public DbSet<Comment> Comments { get; set; } = default!;
        public DbSet<Offer> Offers { get; set; } = default!;
        public DbSet<Rating> Ratings { get; set; } = default!;
        public DbSet<Interest> Interests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());

            modelBuilder.Entity<ApplicationUser>()
                .HasOne(r => r.Band)
                .WithMany(b => b.Recruiters)
                .HasForeignKey(r => r.Id)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.ApplyConfiguration(new StudentConfiguration());
            modelBuilder.ApplyConfiguration(new RecruiterConfiguration());
            modelBuilder.ApplyConfiguration(new BandConfiguration());
            modelBuilder.ApplyConfiguration(new VideoConfiguration()); 
            modelBuilder.ApplyConfiguration(new RatingConfiguration());
            modelBuilder.ApplyConfiguration(new CommentConfiguration());
            modelBuilder.ApplyConfiguration(new ScholarshipOfferConfiguration());
            modelBuilder.ApplyConfiguration(new InterestConfiguration());

        }

    }
}
