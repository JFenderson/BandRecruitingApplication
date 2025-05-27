using server.DTOs;

namespace server.Services
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDTO> GetDashboardSummaryAsync();
    }
}
