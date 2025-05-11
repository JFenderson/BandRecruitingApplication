namespace BandRecruiting.Core.Entities;

public class Student : User
{
    public Guid StudentId { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public new string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public double GPA { get; set; }
    public string Classification { get; set; } = string.Empty; // Freshman, Sophomore, etc.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Instrument { get; set; }
    public string HighSchool { get; set; }
    public string VideoUrl { get; set; }
    public ICollection<Video> Videos { get; set; } = new List<Video>();
    public ICollection<Interest> Interests { get; set; } = new List<Interest>();
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
