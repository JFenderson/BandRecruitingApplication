using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Models;

namespace server.Data
{
    public class InterestConfiguration : IEntityTypeConfiguration<Interest>
    {
        public void Configure(EntityTypeBuilder<Interest> builder)
        {
            builder.HasKey(i => i.InterestId);
            builder.Property(i => i.IsInterested).IsRequired();
            builder.Property(i => i.InterestDate).HasDefaultValueSql("GETUTCDATE()");

            // Interest -> Band (many-to-one)
            builder.HasOne(i => i.Band)
            .WithMany(b => b.InterestedStudents)
            .HasForeignKey(i => i.BandId)                  // <-- force FK to be BandId (Guid)
            .HasPrincipalKey(b => b.BandId)                // <-- principal key is Band.BandId
            .OnDelete(DeleteBehavior.Cascade);


            // Interest -> Student (many-to-one)

            builder.HasOne(i => i.Student)
            .WithMany(s => s.Interests)
            .HasForeignKey(i => i.StudentId)               // <-- FK is StudentId (string)
            .HasPrincipalKey(s => s.Id)                    // <-- principal key is ApplicationUser.Id
            .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(i => new { i.StudentId, i.BandId })
                    .IsUnique();
        }
    }
}
