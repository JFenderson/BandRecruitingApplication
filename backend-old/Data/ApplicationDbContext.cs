using Humanizer;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.General;
using Models;
using server.Models;
using System.Security.Policy;

namespace server.Data
{
    //Band has many Recruiters and Offers.
    //Recruiter belongs to one Band and has many Offers, Ratings, and Comments.
    //Student has many Videos and Offers.
    //Video belongs to one Student and has many Ratings and Comments.
    //Offer belongs to one Band and one Student, optionally linked to a Recruiter.
    //Rating belongs to one Video and one Recruiter.
    //Comment belongs to one Video and one Recruiter.
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        //public DbSet<Student> Students { get; set; } = default!;
        //public DbSet<Recruiter> Recruiters { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
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

            modelBuilder.Entity<Recruiter>()
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
