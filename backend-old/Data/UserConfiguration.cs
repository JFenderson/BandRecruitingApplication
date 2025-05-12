using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Models;

namespace server.Data
{
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            builder.HasDiscriminator<string>("UserType")
                    .HasValue<ApplicationUser>("Student")
                    .HasValue<ApplicationUser>("Recruiter")
                    .HasValue<Admin>("Admin");

        }
    }
}
