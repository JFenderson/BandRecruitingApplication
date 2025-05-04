namespace BandRecruitingApp.Application.DTOs;

public class CreateStudentDTO
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public double GPA { get; set; }
    public string Classification { get; set; } = string.Empty;
}
