using BandRecruitingApp.Core.Entities;
using BandRecruitingApp.Core.Interfaces;
using BandRecruitingApp.Infrastructure.Persistence;

namespace BandRecruitingApp.Infrastructure.Services;

public class StudentRepository : IStudentRepository
{
    private readonly ApplicationDbContext _context;

    public StudentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Add(Student student)
    {
        _context.Students.Add(student);
        _context.SaveChanges();
    }

    public Student? GetByUserId(string userId)
    {
        return _context.Students.FirstOrDefault(s => s.UserId == userId);
    }
}
