using BandRecruiting.Application.DTOs;
using BandRecruiting.Application.Services;
using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using FluentAssertions;
using Moq;

public class OfferServiceTests
{
    private readonly Mock<IOfferRepository> _repoMock;
    private readonly OfferService _service;

    public OfferServiceTests()
    {
        _repoMock = new Mock<IOfferRepository>();
        _service = new OfferService(_repoMock.Object);
    }

    [Fact]
    public void CreateOffer_AddsNewOfferCorrectly()
    {
        // Arrange
        var dto = new CreateOfferDTO
        {
            StudentId = "student123",
            BandId = Guid.NewGuid(),
            Amount = 1500.00m
        };

        Offer capturedOffer = null!;
        _repoMock.Setup(r => r.Add(It.IsAny<Offer>()))
                 .Callback<Offer>(o => capturedOffer = o);

        // Act
        _service.CreateOffer(dto, dto.StudentId, dto.BandId, dto.Amount);

        // Assert
        _repoMock.Verify(r => r.Add(It.IsAny<Offer>()), Times.Once);
        capturedOffer.Should().NotBeNull();
        capturedOffer.StudentId.Should().Be(dto.StudentId);
        capturedOffer.BandId.Should().Be(dto.BandId);
        capturedOffer.Amount.Should().Be(dto.Amount);
        capturedOffer.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void CreateOffer_ShouldCallRepoWithCorrectData()
    {
        // Arrange
        var dto = new CreateOfferDTO { StudentId = "student123", Amount = 1500m };
        var recruiterId = "recruiter123";
        var bandId = Guid.NewGuid();

        // Act
        _service.CreateOffer(dto, dto.StudentId, bandId, dto.Amount);

        // Assert
        _repoMock.Verify(r => r.Add(It.Is<Offer>(o =>
            o.StudentId == dto.StudentId &&
            o.BandId == bandId &&
            o.Amount == dto.Amount
        )), Times.Once);
    }

    [Fact]
    public void GetOffersByStudent_ShouldReturnDTOs()
    {
        // Arrange
        var studentId = "student123";
        var bandId = Guid.NewGuid();

        var offers = new List<Offer>
    {
        new Offer
        {
            OfferId = Guid.NewGuid(),
            StudentId = studentId,
            BandId = bandId,
            Band = new Band { Name = "Blue Thunder" },
            Amount = 1500.00m,
            CreatedAt = DateTime.UtcNow
        }
    };

        _repoMock.Setup(r => r.GetByStudentId(studentId)).Returns(offers);

        // Act
        var result = _service.GetOffersByStudentId(studentId).ToList();

        // Assert
        result.Should().HaveCount(1);
        result[0].StudentId.Should().Be(studentId);
        result[0].Amount.Should().Be(1500.00m);
        result[0].BandName.Should().Be("Blue Thunder");
    }

    [Fact]
    public void DeleteOffer_ShouldReturnTrue_WhenOfferExists()
    {
        // Arrange
        var offerId = Guid.NewGuid();
        var offer = new Offer { OfferId = offerId };

        _repoMock.Setup(r => r.GetById(offerId)).Returns(offer);

        // Act
        var result = _service.DeleteOffer(offerId);

        // Assert
        result.Should().BeTrue();
        _repoMock.Verify(r => r.Delete(offer.OfferId), Times.Once);
    }



}
