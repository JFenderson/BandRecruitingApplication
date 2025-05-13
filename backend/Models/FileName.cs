//using Microsoft.EntityFrameworkCore.Metadata.Builders;
//using Microsoft.EntityFrameworkCore;
//using Models;
//using server.Models;

//public class Band
//{
//    public int BandId { get; set; }
//    public string Name { get; set; }
//    public string SchoolName { get; set; }
//    public string Location { get; set; }
//    public int NumberOfMembers { get; set; }
//    public DateTime CreatedAt { get; set; }

//    // Navigation Properties
//    public List<Recruiter> Recruiters { get; set; }
//    public List<Offer> Offers { get; set; }
//    public List<Interest> InterestedStudents { get; set; }
//}

//public class Recruiter : User
//{
//    //public int RecruiterId { get; set; }
//    public int RecruiterBandId { get; set; }
//    public string FirstName { get; set; }
//    public string LastName { get; set; }
//    public string Email { get; set; }
//    public string Phone { get; set; }
//    public string ProfilePicture { get; set; }
//    public DateTime CreatedAt { get; set; }

//    // Navigation Properties
//    public Band? Band { get; set; }
//    public List<Offer> OffersMade { get; set; }
//    public List<Comment> Comments { get; set; }
//    public List<Rating> Ratings { get; set; }
//}

//public class RecruiterDTO(Recruiter recruiter)
//{
//    public int RecruiterBandId { get; set; }
//    //public int RecruiterId { get; set; }
//    public string UserName { get; set; }
//    public string Email { get; set; }
//    public string FirstName { get; set; }
//    public string LastName { get; set; }
//    public int BandId { get; set; }
//    public string BandName { get; set; }

//    public Band? Band { get; set; }
//    public List<Offer> OffersMade { get; set; }
//    public List<Comment> Comments { get; set; }
//    public List<Rating> Ratings { get; set; }
//}

//public class BandDTO(Band band)
//{
//    public int BandId { get; set; }
//    public string Name { get; set; }
//    public string SchoolName { get; set; }
//    public string Description { get; set; }
//    public int RecruiterCount { get; set; }
//    public int InterestedStudentCount { get; set; }
//}

//public class BandConfiguration : IEntityTypeConfiguration<Band>
//{
//    public void Configure(EntityTypeBuilder<Band> builder)
//    {
//        builder.HasKey(b => b.BandId);

//        builder.Property(b => b.Name).IsRequired().HasMaxLength(100);
//        builder.Property(b => b.SchoolName).IsRequired().HasMaxLength(100);

//        builder.HasMany(b => b.Recruiters)
//               .WithOne(r => r.Band)
//               .HasForeignKey(r => r.RecruiterBandId)
//               .OnDelete(DeleteBehavior.Restrict);

//        builder.HasMany(b => b.InterestedStudents)
//               .WithOne(i => i.Band)
//               .HasForeignKey(i => i.InterestBandId)
//               .OnDelete(DeleteBehavior.Cascade);
//    }
//}

//public class RecruiterConfiguration : IEntityTypeConfiguration<Recruiter>
//{
//    public void Configure(EntityTypeBuilder<Recruiter> builder)
//    {
//        //builder.HasKey(s => s.Id);


//        builder.Property(r => r.FirstName).IsRequired().HasMaxLength(50);
//        builder.Property(r => r.LastName).IsRequired().HasMaxLength(50);
//        builder.Property(r => r.Email).IsRequired().HasMaxLength(50);




//        builder.HasOne(r => r.Band)
//               .WithMany(b => b.Recruiters)
//               .HasForeignKey(r => r.RecruiterBandId)
//               .OnDelete(DeleteBehavior.Restrict);

//        builder.HasMany(r => r.Ratings)
//               .WithOne(r => r.Recruiter)
//               .HasForeignKey(r => r.RecruiterId)
//               .OnDelete(DeleteBehavior.Cascade);

//        builder.HasMany(r => r.Comments)
//               .WithOne(c => c.Recruiter)
//               .HasForeignKey(c => c.RecruiterId)
//               .OnDelete(DeleteBehavior.Cascade);

//        builder.HasMany(r => r.OffersMade)
//               .WithOne(o => o.Recruiter)
//               .HasForeignKey(o => o.RecruiterId)
//               .OnDelete(DeleteBehavior.Restrict);
//    }
//}