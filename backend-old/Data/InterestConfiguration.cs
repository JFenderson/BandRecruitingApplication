using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;

namespace server.Data
{
    public class InterestConfiguration : IEntityTypeConfiguration<Interest>
    {
        public void Configure(EntityTypeBuilder<Interest> builder)
        {
            builder.HasKey(i => i.InterestId);

            builder.Property(i => i.InterestDate).IsRequired();

            builder.HasOne(i => i.Student)
                   .WithMany(s => s.Interests)
                   .HasForeignKey(i => i.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(i => i.Band)
                   .WithMany(b => b.InterestedStudents)
                   .HasForeignKey(i => i.BandId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
