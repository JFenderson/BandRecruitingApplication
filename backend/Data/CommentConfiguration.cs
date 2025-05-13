using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Models;

namespace server.Data
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasKey(c => c.CommentId);

            builder.Property(c => c.Content).IsRequired().HasMaxLength(500);
            builder.Property(c => c.CommentDate).IsRequired();

            builder.HasOne(c => c.Video)
                   .WithMany(v => v.Comments)
                   .HasForeignKey(c => c.VideoId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Recruiter)
                   .WithMany(r => r.CommentsGiven)
                   .HasForeignKey(c => c.RecruiterId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
