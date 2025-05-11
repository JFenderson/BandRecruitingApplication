using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;
using System.Reflection.Emit;

namespace server.Data
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {

            //builder.HasKey(s => s.Id);

          

            builder.Property(s => s.FirstName).IsRequired().HasMaxLength(50);
            builder.Property(s => s.LastName).IsRequired().HasMaxLength(50);
            builder.Property(s => s.Instrument).IsRequired().HasMaxLength(50);
            builder.Property(s => s.HighSchool).IsRequired().HasMaxLength(100);
            builder.Property(s => s.GraduationYear).IsRequired();



            builder.HasMany(s => s.Videos)
               .WithOne(v => v.Student)
               .HasForeignKey(v => v.StudentId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.ScholarshipOffers)
                   .WithOne(o => o.Student)
                   .HasForeignKey(o => o.StudentId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.Interests)
                   .WithOne(i => i.Student)
                   .HasForeignKey(i => i.StudentId)
                   .OnDelete(DeleteBehavior.Cascade);

   
        }
    }
}
