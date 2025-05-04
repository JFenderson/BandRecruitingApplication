using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Core.Entities;
using BandRecruitingApp.Core.Interfaces;

namespace BandRecruitingApp.Application.Services;

public class StudentService : IStudentService
{
    private readonly IStudentRepository _repo;

    public StudentService(IStudentRepository repo)
    {
        _repo = repo;
    }

    public void CreateStudent(string userId, CreateStudentDTO dto)
    {
        var student = new Student
        {
            UserId = userId,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            GPA = dto.GPA,
            Classification = dto.Classification
        };

        _repo.Add(student);
    }

    public Student? GetByUserId(string userId)
    {
        return _repo.GetByUserId(userId);
    }
}
