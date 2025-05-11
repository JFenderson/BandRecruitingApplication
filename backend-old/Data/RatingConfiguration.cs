using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;

namespace server.Data
{
    public class RatingConfiguration : IEntityTypeConfiguration<Rating>
    {
        public void Configure(EntityTypeBuilder<Rating> builder)
        {
            builder.HasKey(r => r.RatingId);

            builder.Property(r => r.Score).IsRequired();
            builder.Property(r => r.RatingDate).IsRequired();

            builder.HasOne(r => r.Video)
                   .WithMany(v => v.Ratings)
                   .HasForeignKey(r => r.VideoId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(r => r.Recruiter)
                   .WithMany(r => r.Ratings)
                   .HasForeignKey(r => r.RecruiterId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Student)
                .WithMany(s => s.Ratings)
                .HasForeignKey(r => r.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
