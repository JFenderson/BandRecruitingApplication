using Models;

namespace server.Services
{
    public interface IBandService : IService<Band>
    {
        Task<IEnumerable<Band>> GetBandsAsync();
        Task<Band> GetBandByIdAsync(Guid id);
        Task<Band> CreateBandAsync(Band band);
        Task<bool> UpdateBandAsync(Band band);
        Task<bool> DeleteBandAsync(Guid id);
        Task<IEnumerable<ApplicationUser>> GetInterestedStudentsAsync(Guid bandId);
        Task<int> GetInterestedStudentCountAsync(Guid bandId);
    }
}
