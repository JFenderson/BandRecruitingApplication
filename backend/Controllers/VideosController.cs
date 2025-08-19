// backend/Controllers/VideosController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/videos")]
    public class VideosController : ControllerBase
    {
        private readonly IVideoService _videoService;

        public VideosController(IVideoService videoService) => _videoService = videoService;

        // GET /api/videos
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetAll()
            => Ok((await _videoService.GetAllAsync()).Select(v => new VideoDTO(v)));

        // GET /api/videos/{id}
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{id}")]
        public async Task<ActionResult<VideoDTO>> GetById(string id)
        {
            var video = await _videoService.GetVideoByIdAsync(id);
            return video is null ? NotFound() : Ok(new VideoDTO(video));
        }
    }
}
