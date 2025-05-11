using BandRecruiting.Application.DTOs;


namespace BandRecruitingApp.Application.Services
{
    public interface IOfferService
    {
        IEnumerable<OfferDTO> GetOffersByStudentId(string studentId);
        IEnumerable<OfferDTO> GetOffersByBandId(Guid bandId);
        void CreateOffer(CreateOfferDTO dto, string studentId, Guid bandId, decimal amount);
        bool DeleteOffer(Guid offerId);
    }
}
