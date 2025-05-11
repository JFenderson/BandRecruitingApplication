using BandRecruiting.Core.Interfaces;
using BandRecruiting.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BandRecruiting.Infrastructure.Services
{
    public class RecruiterRepository : IRecruiterRepository
    {
        private readonly ApplicationDbContext _context;

        public RecruiterRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Add(Recruiter recruiter)
        {
            _context.Recruiters.Add(recruiter);
            SaveChanges();
        }

        public void Update(Recruiter recruiter)
        {
            _context.Recruiters.Update(recruiter);
            SaveChanges();
        }

        public void Delete(Guid id)
        {
            var recruiter = GetById(id);
            if (recruiter != null)
            {
                _context.Recruiters.Remove(recruiter);
                SaveChanges();
            }
        }

        public Recruiter? GetById(Guid id)
        {
            return _context.Recruiters.Find(id);
        }

        public Recruiter? GetByUserId(string userId)
        {
            return _context.Recruiters.FirstOrDefault(r => r.UserId == userId);
        }

        public IEnumerable<Recruiter> GetAll()
        {
            return _context.Recruiters.ToList();
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        public IEnumerable<Recruiter> GetByBandId(Guid bandId)
        {
            return _context.Recruiters
                .Include(r => r.User) // include user data like FirstName, etc.
                .Where(r => r.BandId == bandId)
                .ToList();
        }
    }
}
