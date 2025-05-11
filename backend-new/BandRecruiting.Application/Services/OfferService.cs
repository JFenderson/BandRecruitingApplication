using BandRecruiting.Application.DTOs;
using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using BandRecruitingApp.Application.Services;

namespace BandRecruiting.Application.Services
{
    public class OfferService : IOfferService
    {
        private readonly IOfferRepository _repo;

        public OfferService(IOfferRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<OfferDTO> GetOffersByStudentId(string studentId)
        {
            var offers = _repo.GetByStudentId(studentId);
            return offers.Select(o => new OfferDTO
            {
                OfferId = o.OfferId,
                StudentId = o.StudentId,
                RecruiterId = o.Band?.Recruiters.FirstOrDefault(r => r.UserId == o.StudentId)?.UserId ?? "",
                BandId = o.BandId,
                BandName = o.Band?.Name ?? "",
                Amount = o.Amount,
                Status = o.Status, // Placeholder - replace with actual logic if needed
                OfferDate = o.CreatedAt
            });
        }

        public IEnumerable<OfferDTO> GetOffersByBandId(Guid bandId)
        {
            var offers = _repo.GetByBandId(bandId);
            return offers.Select(o => new OfferDTO
            {
                OfferId = o.OfferId,
                StudentId = o.StudentId,
                RecruiterId = o.Band?.Recruiters.FirstOrDefault(r => r.UserId == o.StudentId)?.UserId ?? "",
                BandId = o.BandId,
                BandName = o.Band?.Name ?? "",
                Amount = o.Amount,
                Status = o.Status,
                OfferDate = o.CreatedAt
            });
        }

        public void CreateOffer(CreateOfferDTO dto, string studentId, Guid bandId, decimal amount)
        {
            var offer = new Offer
            {
                StudentId = studentId,
                BandId = bandId,
                Amount = amount,
                CreatedAt = DateTime.UtcNow,

            };

            _repo.Add(offer);
        }

        public bool DeleteOffer(Guid offerId)
        {
            var offer = _repo.GetById(offerId);
            if (offer == null) return false;

            _repo.Delete(offer.OfferId);
            return true;
        }
    }
}
