using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
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
    .WithMany(u => u.RatingsGiven)
    .HasForeignKey(r => r.RecruiterId)
    .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Student)
                   .WithMany(u => u.RatingsReceived)
                   .HasForeignKey(r => r.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
