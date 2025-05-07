using BandRecruiting.Application.DTOs;
using BandRecruiting.Core.Entities;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;

namespace BandRecruiting.Application.Services;

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

    public Student? GetById(Guid id)
    {
        return _repo.GetById(id);
    }

    public IEnumerable<Student> GetAll()
    {
        return _repo.GetAll();
    }


    public async Task<StudentProfileDTO?> GetStudentProfileAsync(string userId)
    {
        var student = _repo.GetByUserId(userId);
        if (student == null) return null;

        return new StudentProfileDTO
        {
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            Phone = student.Phone,
            GPA = student.GPA,
            Classification = student.Classification,
            Instrument = student.Instrument,
            HighSchool = student.HighSchool,
            VideoUrl = student.VideoUrl
        };
    }

    public bool UpdateStudent(string userId, UpdateStudentDTO dto)
    {
        var student = _repo.GetByUserId(userId);
        if (student == null) return false;

        student.FirstName = dto.FirstName;
        student.LastName = dto.LastName;
        student.Email = dto.Email;
        student.Phone = dto.Phone;
        student.GPA = dto.GPA;
        student.Classification = dto.Classification;

        _repo.Update(student);
        return true;
    }

    public bool DeleteByUserId(string userId)
    {
        var student = _repo.GetByUserId(userId);
        if (student == null) return false;

        _repo.Delete(student.StudentId);
        return true;
    }


}
