// backend/Controllers/StudentsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using server.DTOs;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/students")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IVideoService _videoService;

        public StudentsController(IStudentService studentService, IVideoService videoService)
        {
            _studentService = studentService;
            _videoService = videoService;
        }

        // GET /api/students
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationUser>>> GetAll()
            => Ok(await _studentService.GetAllStudentsAsync());

        // GET /api/students/{id}
        [Authorize(Roles = "Student,Recruiter,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(string id)
        {
            var dto = await _studentService.GetStudentByIdAsync(id);
            return dto is null ? NotFound() : Ok(dto);
        }

        // POST /api/students
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApplicationUser>> Create([FromBody] CreateUserDTO dto)
        {
            var user = await _studentService.CreateStudentAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // PUT /api/students/{id}
        // Only the owner (Student) or an Admin can edit
        [Authorize(Roles = "Student,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDTO dto)
        {
            if (User.IsInRole("Student"))
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId != id) return Forbid();
            }

            var updated = await _studentService.UpdateStudentAsync(id, dto);
            return updated is null ? NotFound() : NoContent();
        }

        // DELETE /api/students/{id}
        // If you want soft-delete, add IsDeleted to ApplicationUser and flip it here.
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var ok = await _studentService.SoftDeleteAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }

        // POST /api/students/{studentId}/videos
        [Authorize(Roles = "Student")]
        [HttpPost("{studentId}/videos")]
        public async Task<ActionResult<VideoDTO>> CreateVideo(string studentId, [FromForm] CreateVideoDTO body)
        {
            // owner check
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != studentId) return Forbid();

            // confirm student exists
            var student = await _studentService.GetStudentByIdAsync(studentId);
            if (student is null) return NotFound("Student not found.");

            // upload & persist
            var uploaded = await _videoService.UploadVideoAsync(body, studentId); // see VideoService patch below
            var video = new Video
            {
                Title = uploaded.Title,
                Description = uploaded.Description,
                VideoUrl = uploaded.VideoUrl,
                StudentId = uploaded.StudentId,
                CreatedAt = uploaded.CreatedAt
            };
            await _videoService.AddAsync(video);

            return CreatedAtAction(nameof(GetStudentVideos), new { id = video.VideoId }, new VideoDTO(video));
        }

        // GET /api/students/{id}/videos
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{id}/videos")]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetStudentVideos(string id)
        {
            var videos = await _studentService.GetStudentVideosAsync(id);
            return Ok(videos.Select(v => new VideoDTO(v)));
        }

        // GET /api/students/{id}/ratings
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{id}/ratings")]
        public async Task<ActionResult<IEnumerable<Rating>>> GetStudentRatings(string id)
            => Ok(await _studentService.GetStudentRatingsAsync(id));

        // GET /api/students/{id}/comments
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetStudentComments(string id)
            => Ok(await _studentService.GetStudentCommentsAsync(id));

        // GET /api/students/{id}/offers
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{id}/offers")]
        public async Task<ActionResult<IEnumerable<Offer>>> GetStudentOffers(string id)
            => Ok(await _studentService.GetStudentScholarshipOffersAsync(id));

        // POST /api/students/{studentId}/interests
        [Authorize(Roles = "Student")]
        [HttpPost("{studentId}/interests")]
        public async Task<ActionResult<InterestDTO>> AddInterest(string studentId, [FromBody] CreateInterestDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != studentId) return Forbid();

            dto.StudentId = studentId;
            var interest = await _studentService.AddInterestAsync(dto);
            return Ok(interest);
        }

        // GET /api/students/{studentId}/interests
        [Authorize(Roles = "Student,Recruiter,Admin")]
        [HttpGet("{studentId}/interests")]
        public async Task<ActionResult<IEnumerable<InterestDTO>>> GetInterests(string studentId)
            => Ok(await _studentService.GetStudentInterestsAsync(studentId));
    }
}
