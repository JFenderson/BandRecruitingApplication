using BandRecruiting.Core.Entities;

public interface IStudentRepository
{
    void Add(Student student);
    Student? GetByUserId(string userId);
    Student? GetById(Guid id);
    IEnumerable<Student> GetAll();
    void Update(Student student);
    void Delete(Guid id); // keep this
    void SaveChanges();
    Task<int> SaveChangesAsync();
}
