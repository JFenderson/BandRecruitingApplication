using BandRecruiting.Core.Entities;
using BandRecruiting.Core.Interfaces;
using BandRecruiting.Infrastructure.Persistence;

public class RatingRepository : IRatingRepository
{
    private readonly ApplicationDbContext _context;

    public RatingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Rating rating)
    {
        await _context.Ratings.AddAsync(rating);
        await _context.SaveChangesAsync();
    }
}