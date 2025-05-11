using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

using System.Reflection.Emit;
using Models;

namespace server.Data
{
    public class RecruiterConfiguration : IEntityTypeConfiguration<Recruiter>
    {
        public void Configure(EntityTypeBuilder<Recruiter> builder)
        {
            //builder.HasKey(r => r.Id);

            builder.Property(r => r.FirstName).IsRequired().HasMaxLength(50);
            builder.Property(r => r.LastName).IsRequired().HasMaxLength(50);
            builder.Property(r => r.Email).IsRequired().HasMaxLength(50);

            builder.HasOne(r => r.Band)
                   .WithMany(b => b.Recruiters)
                   .HasForeignKey(r => r.BandId) // Ensure this matches the property in Recruiter
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(r => r.Ratings)
                   .WithOne(r => r.Recruiter)
                   .HasForeignKey(r => r.RecruiterId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.Comments)
                   .WithOne(c => c.Recruiter)
                   .HasForeignKey(c => c.RecruiterId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.OffersMade)
                   .WithOne(o => o.Recruiter)
                   .HasForeignKey(o => o.RecruiterId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
