using BandRecruiting.Core.Entities;

namespace BandRecruiting.Core.Interfaces
{
    public interface IRatingRepository
    {
        Task AddAsync(Rating rating);
    }
}