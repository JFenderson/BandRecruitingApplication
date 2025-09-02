using Microsoft.AspNetCore.Identity;
using Models;

public class ApplicationUser : IdentityUser
{
    public string UserType { get; set; } // "Student", "Recruiter", "Admin"
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Phone { get; set; }
    public string? ProfilePicture { get; set; }

    public DateTime CreatedAt { get; set; }

    // Student-specific
    public string? Instrument { get; set; }
    public string? HighSchool { get; set; }
    public int? GraduationYear { get; set; }
    public decimal? AverageRating { get; set; }

    public bool IsDeleted { get; set; }

    public void MarkAsDeleted() => IsDeleted = true;

    // Recruiter-specific
    public Guid? BandId { get; set; }
    public Band? Band { get; set; }

    // Token management
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    public ICollection<Video> Videos { get; set; }
    public ICollection<Interest> Interests { get; set; } = new List<Interest>();
    public ICollection<Offer> ScholarshipOffers { get; set; }
    public ICollection<Rating> RatingsReceived { get; set; }

    // For recruiters
    public ICollection<Offer> OffersMade { get; set; }
    public ICollection<Comment> CommentsGiven { get; set; }
    // For Recruiters
    public ICollection<Rating> RatingsGiven { get; set; }


}
