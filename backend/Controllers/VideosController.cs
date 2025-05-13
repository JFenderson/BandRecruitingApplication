using Microsoft.AspNetCore.Mvc;
using Models;
using server.DTOs;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoController : ControllerBase
    {
        private readonly IVideoService _videoService;
        private readonly IStudentService _studentService;



        public VideoController(IVideoService videoService, IStudentService studentService)
        {
            _videoService = videoService;
            _studentService = studentService;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetAllVideos()
        {
            var videos = await _videoService.GetAllAsync();
            return Ok(videos.Select(v => new VideoDTO(v)));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VideoDTO>> GetVideo(int id)
        {
            var video = await _videoService.GetByIdAsync(id);
            if (video == null)
                return NotFound();

            return Ok(new VideoDTO(video));
        }

        [HttpPost]
        public async Task<ActionResult<VideoDTO>> CreateVideo(CreateVideoDTO createVideoDTO)
        {
            var video = new Video
            {
                // Map properties from createVideoDTO to Video
            };

            await _videoService.AddAsync(video);

            return CreatedAtAction(nameof(GetVideo), new { id = video.VideoId }, new VideoDTO(video));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVideo(int id, UpdateVideoDTO updateVideoDTO)
        {
            var video = await _videoService.GetByIdAsync(id);
            if (video == null)
                return NotFound();

            // Update video properties from updateVideoDTO

            await _videoService.UpdateAsync(video);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(int id)
        {
            var video = await _videoService.GetByIdAsync(id);
            if (video == null)
                return NotFound();

            await _videoService.DeleteAsync(video);

            return NoContent();
        }

        [HttpGet("{id}/ratings")]
        public async Task<ActionResult<IEnumerable<RatingDTO>>> GetVideoRatings(string videoId)
        {
            var ratings = await _videoService.GetVideoRatingsAsync(videoId);
            return Ok(ratings);
        }

        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetVideoComments(string videoId)
        {
            var comments = await _videoService.GetVideoCommentsAsync(videoId);
            return Ok(comments.Select(c => new CommentDTO(c)));
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadVideo([FromForm] CreateVideoDTO request, string studentId)
        {
            var uploadResult = await _videoService.UploadVideoAsync(request, studentId);

            var video = new Video
            {
                Title = uploadResult.Title,
                Description = uploadResult.Description,
                StudentId = uploadResult.StudentId.ToString(),
                VideoUrl = uploadResult.VideoUrl,
                CreatedAt = uploadResult.CreatedAt
            };

            await _videoService.AddAsync(video);

            return Ok(new VideoDTO(video));
        }

    }
}
