using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;

namespace server.Data
{
    public class VideoConfiguration : IEntityTypeConfiguration<Video>
    {
        public void Configure(EntityTypeBuilder<Video> builder)
        {
            builder.HasKey(v => v.VideoId);

            builder.Property(v => v.Title).IsRequired().HasMaxLength(100);
            builder.Property(v => v.Description).HasMaxLength(500);
            builder.Property(v => v.VideoUrl).IsRequired().HasMaxLength(255);
            builder.Property(v => v.CreatedAt).IsRequired();

            builder.HasOne(v => v.Student)
                .WithMany(v => v.Videos)
                .HasForeignKey(v => v.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(v => v.Ratings)
                   .WithOne(r => r.Video)
                   .HasForeignKey(r => r.VideoId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(v => v.Comments)
                   .WithOne(c => c.Video)
                   .HasForeignKey(c => c.VideoId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
