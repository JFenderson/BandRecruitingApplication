using BandRecruiting.Core.Entities;
using BandRecruiting.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BandRecruiting.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }
    public DbSet<Recruiter> Recruiters { get; set; }
    public DbSet<Band> Bands { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<Interest> Interests { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);


        builder.Entity<Student>()
            .HasOne(s => s.User)
            .WithOne(u => u.Student)
            .HasForeignKey<Student>(s => s.UserId);

        builder.Entity<Recruiter>()
            .HasOne(r => r.User)
            .WithOne(u => u.Recruiter)
            .HasForeignKey<Recruiter>(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        builder.Entity<Recruiter>()
            .HasOne(r => r.Band)
            .WithMany(b => b.Recruiters)
            .HasForeignKey(r => r.BandId);

        builder.Entity<Video>()
            .HasOne(v => v.Student)
            .WithMany(s => s.Videos)
            .HasForeignKey(v => v.StudentId);

        builder.Entity<Rating>()
            .HasOne(r => r.Video)
            .WithMany(v => v.Ratings)
            .HasForeignKey(r => r.VideoId);

        builder.Entity<Rating>()
            .HasOne(r => r.Recruiter)
            .WithMany(rec => rec.Ratings)
            .HasForeignKey(r => r.RecruiterId);

        builder.Entity<Comment>()
            .HasOne(c => c.Video)
            .WithMany(v => v.Comments)
            .HasForeignKey(c => c.VideoId);

        builder.Entity<Comment>()
            .HasOne(c => c.Recruiter)
            .WithMany(rec => rec.Comments)
            .HasForeignKey(c => c.RecruiterId);

        builder.Entity<Offer>()
            .HasOne(o => o.Student)
            .WithMany(s => s.Offers)
            .HasForeignKey(o => o.StudentId);

        builder.Entity<Offer>()
            .HasOne(o => o.Band)
            .WithMany(b => b.Offers)
            .HasForeignKey(o => o.BandId);

        builder.Entity<Interest>()
            .HasOne(i => i.Student)
            .WithMany(s => s.Interests)
            .HasForeignKey(i => i.StudentId);

        builder.Entity<Interest>()
            .HasOne(i => i.Band)
            .WithMany(b => b.Interests)
            .HasForeignKey(i => i.BandId);
    }
}
