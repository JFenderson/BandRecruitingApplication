using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Models;
using System.Reflection.Emit;

namespace server.Data
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasDiscriminator<string>("UserType")
                    .HasValue<Student>("Student")
                    .HasValue<Recruiter>("Recruiter")
                    .HasValue<Admin>("Admin");

        }
    }
}
