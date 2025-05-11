namespace BandRecruiting.Application.DTOs;

public class UpdateStudentDTO
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Phone { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Instrument { get; set; } = default!;
    public double GPA { get; set; } = default!;
    public string Classification { get; set; } = default!;
    public string HighSchool { get; set; } = default!;
    public string VideoUrl { get; set; } = default!;
}