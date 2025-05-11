using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using BandRecruiting.Infrastructure.Persistence;

namespace BandRecruiting.Infrastructure.Services
{
    public class OfferRepository : IOfferRepository
    {
        private readonly ApplicationDbContext _context;

        public OfferRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Add(Offer offer)
        {
            _context.Offers.Add(offer);
            SaveChanges();
        }

        public Offer? GetById(Guid offerId)
        {
            return _context.Offers.Find(offerId);
        }

        public IEnumerable<Offer> GetByStudentId(string studentId)
        {
            return _context.Offers
                .Where(o => o.StudentId == studentId)
                .ToList();
        }

        public IEnumerable<Offer> GetByBandId(Guid bandId)
        {
            return _context.Offers
                .Where(o => o.BandId == bandId)
                .ToList();
        }

        public void Delete(Guid offerId)
        {
            var offer = GetById(offerId);
            if (offer != null)
            {
                _context.Offers.Remove(offer);
                SaveChanges();
            }
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
