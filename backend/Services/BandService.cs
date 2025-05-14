using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.DTOs;

namespace server.Services
{
    public class BandService : Service<Band>, IBandService
    {
        private readonly ApplicationDbContext _context;
        public BandService(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<BandDTO>> GetBandsAsync()
        {
            return await _context.Bands
                .Select(b => new BandDTO
                {
                    BandId = b.BandId,
                    Name = b.Name,
                    SchoolName = b.SchoolName,
                    State = b.State,
                    City = b.City,
                    Division = b.Division,
                    Conference = b.Conference,
                    RecruiterCount = b.Recruiters.Count
                })
                .ToListAsync();
        }

        public async Task<BandDTO?> GetBandByIdAsync(Guid id)
        {
            var band = await _context.Bands
                .Where(b => b.BandId == id)
                .Select(b => new BandDTO
                {
                    BandId = b.BandId,
                    Name = b.Name,
                    SchoolName = b.SchoolName,
                    State = b.State,
                    City = b.City,
                    Division = b.Division,
                    Conference = b.Conference,
                    RecruiterCount = b.Recruiters.Count
                })
                .FirstOrDefaultAsync();

            return band;
        }

        public async Task<BandDTO> CreateBandAsync(CreateBandDTO bandDto)
        {
            var band = new Band
            {
                BandId = Guid.NewGuid(),
                Name = bandDto.Name,
                SchoolName = bandDto.SchoolName,
                State = bandDto.State,
                Division = bandDto.Division,
                Conference = bandDto.Conference
            };

            _context.Bands.Add(band);
            await _context.SaveChangesAsync();
            return new BandDTO
            {
                BandId = band.BandId,
                Name = band.Name,
                SchoolName = band.SchoolName,
                State = band.State,
                Division = band.Division,
                Conference = band.Conference,
                RecruiterCount = 0
            };
        }

        public async Task<bool> UpdateBandAsync(UpdateBandDTO bandDto)
        {
            var band = await _context.Bands.FindAsync(bandDto.BandId);
            if (band == null)
                return false;

            band.Name = bandDto.Name;
            band.SchoolName = bandDto.SchoolName;
            band.State = bandDto.State;
            band.City = bandDto.City;
            band.Division = bandDto.Division;
            band.Conference = bandDto.Conference;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBandAsync(Guid id)
        {
            var band = await _context.Bands.FindAsync(id);
            if (band == null) return false;

            _context.Bands.Remove(band);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<ApplicationUser>> GetInterestedStudentsAsync(Guid bandId)
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

        public async Task<int> GetInterestedStudentCountAsync(Guid bandId)
        {
            return await _context.Interests
                .CountAsync(i => i.BandId == bandId);
        }
    }
}
