using BandRecruiting.Application.DTOs;
using BandRecruiting.Core.Entities;
using BandRecruitingApp.Application.DTOs;

namespace BandRecruitingApp.Application.Services;

public interface IStudentService
{
    void CreateStudent(string userId, CreateStudentDTO dto);
    Student? GetByUserId(string userId);
    Student? GetById(Guid id); // Add this
    IEnumerable<Student> GetAll(); // Add this
    Task<StudentProfileDTO?> GetStudentProfileAsync(string userId);
    bool UpdateStudent(string userId, UpdateStudentDTO dto);
    bool DeleteByUserId(string userId);
}
