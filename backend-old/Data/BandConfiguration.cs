using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;

namespace server.Data
{
    public class BandConfiguration : IEntityTypeConfiguration<Band>
    {
        public void Configure(EntityTypeBuilder<Band> builder)
        {
            builder.HasKey(b => b.BandId);

            builder.Property(b => b.Name).IsRequired().HasMaxLength(100);
            builder.Property(b => b.SchoolName).IsRequired().HasMaxLength(100);

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

