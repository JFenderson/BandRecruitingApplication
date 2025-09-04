using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using server.Services;

public class S3VideoStorageProvider : IVideoStorageProvider
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucket;

    public S3VideoStorageProvider(IAmazonS3 s3, IConfiguration cfg)
    {
        _s3 = s3;
        _bucket = cfg["AWS:BucketName"] ?? throw new InvalidOperationException("AWS:BucketName missing");
    }

    public async Task<(string url, string key)> UploadAsync(IFormFile file, string studentId, CancellationToken ct = default)
    {
        var key = $"videos/{studentId}/{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        using var stream = file.OpenReadStream();
        var xfer = new TransferUtility(_s3);
        await xfer.UploadAsync(new TransferUtilityUploadRequest
        {
            BucketName = _bucket,
            Key = key,
            InputStream = stream,
            ContentType = file.ContentType,
            CannedACL = S3CannedACL.PublicRead
        }, ct);

        var url = $"https://{_bucket}.s3.amazonaws.com/{key}";
        return (url, key);
    }
}