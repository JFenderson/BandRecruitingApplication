﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace server.Data
{
    public class StudentConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {

            //builder.HasKey(s => s.Id);



            builder.Property(s => s.FirstName).IsRequired().HasMaxLength(50);
            builder.Property(s => s.LastName).IsRequired().HasMaxLength(50);
            builder.Property(s => s.GraduationYear);
            builder.Property(s => s.Instrument).HasMaxLength(50);
            builder.Property(s => s.HighSchool).HasMaxLength(100);



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
