// .NET Controller
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;

    public UploadController(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    [HttpGet("presigned-url")]

    public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName, [FromQuery]string contentType)
    {
        Console.WriteLine(contentType);
        var request = new GetPreSignedUrlRequest
        {
            BucketName = "songs-bucket-aws-testpnoren",
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            ContentType = contentType
        };

        string url = _s3Client.GetPreSignedURL(request);
        return Ok(new { url });
    }
}