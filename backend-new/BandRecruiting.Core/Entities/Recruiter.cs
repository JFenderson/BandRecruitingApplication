using BandRecruiting.Core.Entities;

public class Recruiter
{
    public Guid RecruiterId { get; set; }

    public string UserId { get; set; }  // FK to User
    public User User { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public Guid BandId { get; set; }
    public Band Band { get; set; }

    public ICollection<Rating> Ratings { get; set; }
    public ICollection<Comment> Comments { get; set; }
}
