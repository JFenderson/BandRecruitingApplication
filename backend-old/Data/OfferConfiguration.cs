using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Models;

namespace server.Data
{
    public class ScholarshipOfferConfiguration : IEntityTypeConfiguration<Offer>
    {
        public void Configure(EntityTypeBuilder<Offer> builder)
        {
            builder.HasKey(o => o.OfferId);

            builder.Property(o => o.Amount).IsRequired().HasColumnType("decimal(18,2)");
            builder.Property(o => o.OfferDate).IsRequired();
            builder.Property(o => o.Status).IsRequired();

            builder.HasOne(o => o.Student)
                   .WithMany(s => s.ScholarshipOffers)
                   .HasForeignKey(o => o.StudentId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.Recruiter)
                   .WithMany(r => r.OffersMade)
                   .HasForeignKey(o => o.RecruiterId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.Band)
                   .WithMany(b => b.Offers)
                   .HasForeignKey(o => o.BandId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(o => o.Status)
            .HasConversion<string>();
        }
    }
}
