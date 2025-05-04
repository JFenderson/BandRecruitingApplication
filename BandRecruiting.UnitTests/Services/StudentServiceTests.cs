using Xunit;
using Moq;
using FluentAssertions;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;
using BandRecruitingApp.Core.Interfaces;
using BandRecruitingApp.Core.Entities;

namespace BandRecruitingApp.UnitTests.Services;

public class StudentServiceTests
{
    [Fact]
    public void CreateStudent_Should_Save_Valid_Student()
    {
        var mockRepo = new Mock<IStudentRepository>();
        var service = new StudentService(mockRepo.Object);

        var dto = new CreateStudentDTO
        {
            FirstName = "Test",
            LastName = "Student",
            Email = "test@student.com",
            Phone = "555-1234",
            GPA = 3.8,
            Classification = "Senior"
        };

        service.CreateStudent("user-123", dto);

        mockRepo.Verify(x => x.Add(It.Is<Student>(s =>
            s.FirstName == dto.FirstName &&
            s.LastName == dto.LastName &&
            s.Email == dto.Email &&
            s.UserId == "user-123"
        )), Times.Once);
    }
}
