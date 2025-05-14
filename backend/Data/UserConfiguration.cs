using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace server.Data
{
    public class UserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            builder.Property(u => u.UserType)
                    .IsRequired();

            builder.Property(u => u.AverageRating)
                   .HasPrecision(3, 1);

        }
    }
}
