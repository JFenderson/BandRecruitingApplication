using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Core.Entities;

namespace BandRecruitingApp.Application.Services;

public interface IStudentService
{
    void CreateStudent(string userId, CreateStudentDTO dto);
    Student? GetByUserId(string userId);

}
