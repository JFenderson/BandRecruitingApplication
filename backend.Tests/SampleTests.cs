using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;

namespace backend.Tests
{
    public class SampleTests : IDisposable
    {
        private readonly ApplicationDbContext _context;

        public SampleTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
        }

        [Fact]
        public async Task Database_ShouldCreateAndQueryBands()
        {
            // Arrange
            var band = new Band
            {
                BandId = Guid.NewGuid(),
                Name = "Test Band",
                SchoolName = "Test University",
                City = "Test City",
                State = "TX",
                Division = "I",
                Conference = "Test Conference",
                CreatedAt = DateTime.UtcNow
            };

            // Act
            _context.Bands.Add(band);
            await _context.SaveChangesAsync();

            var retrievedBand = await _context.Bands.FirstOrDefaultAsync(b => b.BandId == band.BandId);

            // Assert
            retrievedBand.Should().NotBeNull();
            retrievedBand.Name.Should().Be("Test Band");
            retrievedBand.SchoolName.Should().Be("Test University");
        }

        [Fact]
        public async Task Database_ShouldCreateStudent()
        {
            // Arrange
            var student = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                Email = "test@student.com",
                UserType = "Student",
                FirstName = "Test",
                LastName = "Student",
                Phone = "123-456-7890",
                Instrument = "Trumpet",
                HighSchool = "Test High School",
                GraduationYear = 2025,
                CreatedAt = DateTime.UtcNow
            };

            // Act
            _context.Users.Add(student);
            await _context.SaveChangesAsync();

            var retrievedStudent = await _context.Users.FirstOrDefaultAsync(u => u.Id == student.Id);

            // Assert
            retrievedStudent.Should().NotBeNull();
            retrievedStudent.Email.Should().Be("test@student.com");
            retrievedStudent.UserType.Should().Be("Student");
            retrievedStudent.Instrument.Should().Be("Trumpet");
        }

        [Fact]
        public void ApplicationUser_ShouldSetDefaultValues()
        {
            // Arrange & Act
            var user = new ApplicationUser
            {
                UserType = "Student",
                FirstName = "John",
                LastName = "Doe",
                Phone = "123-456-7890"
            };

            // Assert
            user.UserType.Should().Be("Student");
            user.FirstName.Should().Be("John");
            user.LastName.Should().Be("Doe");
            user.IsDeleted.Should().BeFalse(); // Default value
        }

        [Theory]
        [InlineData("Student")]
        [InlineData("Recruiter")]
        [InlineData("Admin")]
        public void ApplicationUser_ShouldAcceptValidUserTypes(string userType)
        {
            // Arrange & Act
            var user = new ApplicationUser
            {
                UserType = userType,
                FirstName = "Test",
                LastName = "User",
                Phone = "123-456-7890"
            };

            // Assert
            user.UserType.Should().Be(userType);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}