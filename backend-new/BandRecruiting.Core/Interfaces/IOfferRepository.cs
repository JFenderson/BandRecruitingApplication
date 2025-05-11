using BandRecruiting.Core.Entities;

namespace BandRecruiting.Core.Interfaces
{
    public interface IOfferRepository
    {
        void Add(Offer offer);
        Offer? GetById(Guid offerId);
        IEnumerable<Offer> GetByStudentId(string studentId);
        IEnumerable<Offer> GetByBandId(Guid bandId);
        void Delete(Guid offerId);
        void SaveChanges();
    }
}
