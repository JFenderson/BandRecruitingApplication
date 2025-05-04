using BandRecruitingApp.Core.Entities;

namespace BandRecruitingApp.Core.Interfaces;

public interface IStudentRepository
{
    void Add(Student student);
    Student? GetByUserId(string userId);
}
