using server.DTOs;
using Models;

namespace server.Services
{
    public interface IBandService : IService<Band>
    {
        Task<IEnumerable<Band>> GetBandsAsync();
        Task<Band> GetBandByIdAsync(string id);
        Task<Band> CreateBandAsync(Band band);
        Task<bool> UpdateBandAsync(Band band);
        Task<bool> DeleteBandAsync(string id);
        Task<IEnumerable<Student>> GetInterestedStudentsAsync(string bandId);
        Task<int> GetInterestedStudentCountAsync(string bandId);
    }
}
