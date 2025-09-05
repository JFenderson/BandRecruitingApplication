using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.Services;
using System;
using System.Threading.Tasks;

namespace backend.Tests
{
    public class BasicServiceTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly BandService _bandService;

        public BasicServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _bandService = new BandService(_context);
        }

        [Fact]
        public async Task BandService_ShouldGetAllBands()
        {
            // Arrange
            var bands = new[]
            {
                new Band
                {
                    BandId = Guid.NewGuid(),
                    Name = "Band 1",
                    SchoolName = "School 1",
                    City = "City 1",
                    State = "TX",
                    Division = "I",
                    Conference = "Conference 1",
                    CreatedAt = DateTime.UtcNow
                },
                new Band
                {
                    BandId = Guid.NewGuid(),
                    Name = "Band 2",
                    SchoolName = "School 2",
                    City = "City 2",
                    State = "FL",
                    Division = "II",
                    Conference = "Conference 2",
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.Bands.AddRange(bands);
            await _context.SaveChangesAsync();

            // Act
            var result = await _bandService.GetBandsAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(b => b.Name == "Band 1");
            result.Should().Contain(b => b.Name == "Band 2");
        }

        [Fact]
        public async Task BandService_ShouldGetBandById()
        {
            // Arrange
            var bandId = Guid.NewGuid();
            var band = new Band
            {
                BandId = bandId,
                Name = "Test Band",
                SchoolName = "Test School",
                City = "Test City",
                State = "TX",
                Division = "I",
                Conference = "Test Conference",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bands.Add(band);
            await _context.SaveChangesAsync();

            // Act
            var result = await _bandService.GetBandByIdAsync(bandId);

            // Assert
            result.Should().NotBeNull();
            result!.BandId.Should().Be(bandId);
            result.Name.Should().Be("Test Band");
        }

        [Fact]
        public async Task BandService_ShouldReturnNullForNonExistentBand()
        {
            // Arrange
            var nonExistentBandId = Guid.NewGuid();

            // Act
            var result = await _bandService.GetBandByIdAsync(nonExistentBandId);

            // Assert
            result.Should().BeNull();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}