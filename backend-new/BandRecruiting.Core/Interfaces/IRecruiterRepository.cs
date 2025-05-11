namespace BandRecruiting.Core.Interfaces
{
    public interface IRecruiterRepository
    {
        void Add(Recruiter recruiter);
        void Update(Recruiter recruiter);
        void Delete(Guid id);
        Recruiter? GetById(Guid id);
        Recruiter? GetByUserId(string userId);
        IEnumerable<Recruiter> GetAll();
        void SaveChanges();
        Task<int> SaveChangesAsync();
        IEnumerable<Recruiter> GetByBandId(Guid bandId);
    }
}
