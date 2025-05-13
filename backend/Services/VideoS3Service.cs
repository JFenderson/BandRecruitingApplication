using Amazon.S3;
using Amazon.S3.Transfer;

public class VideoS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public VideoS3Service(IAmazonS3 s3Client, IConfiguration config)
    {
        _s3Client = s3Client;
        _bucketName = config["band-recruiting-videos"];
    }

    public async Task<string> UploadVideoAsync(IFormFile file, string keyPrefix = "")
    {
        var fileTransferUtility = new TransferUtility(_s3Client);

        var key = $"{keyPrefix}{Guid.NewGuid()}_{file.FileName}";

        using var stream = file.OpenReadStream();

        await fileTransferUtility.UploadAsync(stream, _bucketName, key);

        return $"https://band-recruiting-videos.s3.amazonaws.com/{key}";
    }
}
