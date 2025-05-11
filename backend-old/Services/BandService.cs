using server.DTOs;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using Microsoft.AspNetCore.Mvc;

namespace server.Services
{
    public class BandService : Service<Band>, IBandService
    {
        private readonly ApplicationDbContext _context;
        public BandService(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Band>> GetBandsAsync()
        {
            return await _context.Bands
                .Include(b => b.Recruiters)
                .Include(b => b.Offers)
                .Include(b => b.InterestedStudents)
                .ToArrayAsync();
                //.ToListAsync();
        }

        public async Task<Band> GetBandByIdAsync(string id)
        {
            return await _context.Bands
                .Include(b => b.Recruiters)
                .Include(b => b.Offers)
                .Include(b => b.InterestedStudents)
                .FirstOrDefaultAsync(b => b.BandId == id);
        }

        public async Task<Band> CreateBandAsync(Band band)
        {
            _context.Bands.Add(band);
            await _context.SaveChangesAsync();
            return band;
        }

        public async Task<bool> UpdateBandAsync(Band band)
        {
            _context.Bands.Update(band);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteBandAsync(string id)
        {
            var band = await _context.Bands.FindAsync(id);
            if (band == null) return false;

            _context.Bands.Remove(band);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Student>> GetInterestedStudentsAsync(string bandId)
        {
            // Log the bandId being passed
            Console.WriteLine($"Fetching students interested in BandId: {bandId}");

            // Fetch the interested students
            var interests = await _context.Interests
                .Where(i => i.BandId == bandId)
                .Select(i => i.Student)
                .ToArrayAsync();

            // Log the number of interests found
            Console.WriteLine($"Found {interests.Length} interested students");

            return interests;
        }

        public async Task<int> GetInterestedStudentCountAsync(string bandId)
        {
            return await _context.Interests
                .CountAsync(i => i.BandId == bandId);
        }
    }
}
