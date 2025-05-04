namespace BandRecruitingApp.Core.Entities;

public class Student
{
    public int StudentId { get; set; }
    public string UserId { get; set; } = string.Empty; // Identity FK
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public double GPA { get; set; }
    public string Classification { get; set; } = string.Empty; // Freshman, Sophomore, etc.
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
