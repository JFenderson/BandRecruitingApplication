using BandRecruitingApp.Core.Entities;
using BandRecruitingApp.Core.Interfaces;
using BandRecruitingApp.Infrastructure.Persistence;

namespace BandRecruitingApp.Infrastructure.Services;

public class RatingRepository : IRatingRepository
{
    private readonly ApplicationDbContext _context;

    public RatingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Add(Rating rating)
    {
        _context.Ratings.Add(rating);
        _context.SaveChanges();
    }
}
