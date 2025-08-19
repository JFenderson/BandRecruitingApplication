namespace server.Services
{
    public interface IVideoStorageProvider
    {
        Task<(string url, string key)> UploadAsync(IFormFile file, string studentId, CancellationToken ct = default);
    }
}
