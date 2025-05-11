using Models;
using server.DTOs;

namespace server.Services
{
    public interface IOfferService : IService<Offer>
    {
        Task<OfferDTO> CreateOfferAsync(OfferDTO offerDto);
        Task<IEnumerable<OfferDTO>> GetOffersByBandAsync(string bandId);
        Task<IEnumerable<OfferDTO>> GetOffersByStudentAsync(string studentId);

        Task<IEnumerable<OfferDTO>> GetOffersByRecruiterAsync(string recruiterId);

        Task<OfferDTO> GetOfferAsync(string offerId, string studentId);
        Task<Offer> UpdateOfferAsync(string offerId, decimal offerAmount);
        Task DeleteOfferAsync(string offerId);
        Task<IEnumerable<StudentDTO>> GetStudentsByRecruiterAsync(string recruiterId);
        Task<decimal?> GetStudentOverallRatingAsync(string studentId);
        Task<int> GetStudentOfferCountAsync(string studentId);
        Task<Offer> AcceptOfferAsync(string studentId, string offerId);
        Task<Offer> DeclineOfferAsync(string studentId, string offerId);
    }
}
