using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using server.Services;

public class LocalVideoStorageProvider : IVideoStorageProvider
{
    private readonly string _root;

    public LocalVideoStorageProvider(IConfiguration cfg, IWebHostEnvironment env)
    {
        _root = cfg["Local:VideoRoot"] ?? Path.Combine(env.ContentRootPath, "wwwroot", "videos");
        Directory.CreateDirectory(_root);
    }

    public async Task<(string url, string key)> UploadAsync(IFormFile file, string studentId, CancellationToken ct = default)
    {
        var folder = Path.Combine(_root, studentId);
        Directory.CreateDirectory(folder);
        var key = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var path = Path.Combine(folder, key);
        await using var fs = File.Create(path);
        await file.CopyToAsync(fs, ct);

        // url relative under /videos; ensure UseStaticFiles()
        var rel = $"/videos/{studentId}/{key}";
        return (rel, Path.Combine(studentId, key));
    }
}