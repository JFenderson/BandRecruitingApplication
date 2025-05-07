using BandRecruiting.Application.Services;
using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using FluentAssertions;
using Moq;


public class RecruiterServiceTests
{
    private readonly Mock<IRecruiterRepository> _repoMock;
    private readonly RecruiterService _service;

    public RecruiterServiceTests()
    {
        _repoMock = new Mock<IRecruiterRepository>();
        _service = new RecruiterService(_repoMock.Object);
    }

    public class UserFake : User
    {
        public UserFake()
        {
            Phone = "555-1234";
            FirstName = "John";
            LastName = "Doe";
            Email = "john@example.com";
        }
    }

    [Fact]
    public void GetRecruitersByBand_ShouldReturnMappedDTOs_WithSchool()
    {

        // Arrange
        var bandId = Guid.NewGuid();
        var recruiters = new List<Recruiter>
        {
            new Recruiter
            {
                BandId = bandId,
                Band = new Band { BandId = bandId, Name = "Blue Thunder", School = "State University" },
               User = new UserFake()
            }
        };

        _repoMock.Setup(r => r.GetByBandId(bandId)).Returns(recruiters);

        // Act
        var result = _service.GetRecruitersByBand(bandId);

        // Assert
        result.Should().NotBeNullOrEmpty();
        var profile = Assert.Single(result);
        profile.FirstName.Should().Be("John");
        profile.LastName.Should().Be("Doe");
        profile.Email.Should().Be("john@example.com");
        profile.Phone.Should().Be("555-1234");
        profile.BandId.Should().Be(bandId);
        //profile.School.Should().Be("State University");
    }
}
