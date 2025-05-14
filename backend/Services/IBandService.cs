using Models;
using server.DTOs;

namespace server.Services
{
    public interface IBandService : IService<Band>
    {
        Task<List<BandDTO>> GetBandsAsync();
        Task<BandDTO> GetBandByIdAsync(Guid id);
        Task<BandDTO> CreateBandAsync(CreateBandDTO band);
        Task<bool> UpdateBandAsync(UpdateBandDTO band);
        Task<bool> DeleteBandAsync(Guid id);
        Task<IEnumerable<ApplicationUser>> GetInterestedStudentsAsync(Guid bandId);
        Task<int> GetInterestedStudentCountAsync(Guid bandId);
    }
}
