using Microsoft.AspNetCore.Http;
using server.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace backend.Tests
{
    public class MockVideoStorageProvider : IVideoStorageProvider
    {
        public Task<(string url, string key)> UploadAsync(IFormFile file, string studentId, CancellationToken ct = default)
        {
            var key = $"test-videos/{studentId}/{Guid.NewGuid()}_{file.FileName}";
            var url = $"https://test-storage.com/{key}";
            return Task.FromResult((url, key));
        }
    }
}