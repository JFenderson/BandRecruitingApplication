using BandRecruiting.Core.Entities;
using BandRecruiting.Infrastructure.Persistence;

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
        SaveChanges();
    }

    public Student? GetById(Guid id)
    {
        return _context.Students.Find(id);
    }

    public Student? GetByUserId(string userId)
    {
        return _context.Students.FirstOrDefault(s => s.UserId == userId);
    }

    public IEnumerable<Student> GetAll()
    {
        return _context.Students.ToList();
    }

    public void Update(Student student)
    {
        _context.Students.Update(student);
        SaveChanges();
    }

    public void Delete(Guid id)
    {
        var student = GetById(id);
        if (student != null)
        {
            _context.Students.Remove(student);
            SaveChanges();
        }
    }

    public void Delete(Student student)
    {
        _context.Students.Remove(student);
        SaveChanges();
    }

    public void SaveChanges()
    {
        _context.SaveChanges();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
