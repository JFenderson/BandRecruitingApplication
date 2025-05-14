using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Models;

namespace server.Data
{
    public class BandConfiguration : IEntityTypeConfiguration<Band>
    {
        public void Configure(EntityTypeBuilder<Band> builder)
        {
            builder.HasKey(b => b.BandId);

            builder.Property(b => b.Name).HasMaxLength(100);
            builder.Property(b => b.SchoolName).HasMaxLength(100);
            builder.Property(b => b.City).HasMaxLength(100);
            builder.Property(b => b.State).HasMaxLength(100);
            builder.Property(b => b.Conference).HasMaxLength(100);
            builder.Property(b => b.Division).HasMaxLength(100);

            builder.HasMany(b => b.Recruiters)
                   .WithOne(r => r.Band)
                   .HasForeignKey(r => r.BandId) // Ensure this matches the property in Recruiter
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(b => b.InterestedStudents)
                   .WithOne(i => i.Band)
                   .HasForeignKey(i => i.InterestId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}

