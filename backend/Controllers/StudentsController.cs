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

        // GET /api/students/{studentId}
        [Authorize(Roles = "Student,Recruiter,Admin")]
        [HttpGet("{studentId}")]
        public async Task<ActionResult<UserDTO>> GetById(string studentId)
        {
            var dto = await _studentService.GetStudentByIdAsync(studentId);
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

        // PUT /api/students/{studentId}
        // Only the owner (Student) or an Admin can edit
        [Authorize(Roles = "Student,Admin")]
        [HttpPut("{studentId}")]
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

        // DELETE /api/students/{studentId}
        // If you want soft-delete, add IsDeleted to ApplicationUser and flip it here.
        [Authorize(Roles = "Admin")]
        [HttpDelete("{studentId}")]
        public async Task<IActionResult> Delete(string studentId)
        {
            var ok = await _studentService.SoftDeleteAsync(studentId);
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

        // GET /api/students/{studentId}/videos
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{studentId}/videos")]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetStudentVideos(string studentId)
        {
            var videos = await _studentService.GetStudentVideosAsync(studentId);
            return Ok(videos.Select(v => new VideoDTO(v)));
        }

        // GET /api/students/{studentId}/ratings
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{studentId}/ratings")]
        public async Task<ActionResult<IEnumerable<Rating>>> GetStudentRatings(string studentId)
            => Ok(await _studentService.GetStudentRatingsAsync(studentId));

        // GET /api/students/{studentId}/comments
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{studentId}/comments")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetStudentComments(string studentId)
            => Ok(await _studentService.GetStudentCommentsAsync(studentId));

        // GET /api/students/{studentId}/offers
        [Authorize(Roles = "Recruiter,Admin,Student")]
        [HttpGet("{studentId}/offers")]
        public async Task<ActionResult<IEnumerable<Offer>>> GetStudentOffers(string studentId)
            => Ok(await _studentService.GetStudentScholarshipOffersAsync(studentId));

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

        [Authorize(Roles = "Student")]
        [HttpPut("{studentId}/interests/{bandId}")]
        public async Task<ActionResult<InterestDTO>> UpdateInterest(string studentId, Guid bandId, [FromBody] UpdateInterestDto dto, CancellationToken ct)
        {
            var result = await _studentService.UpdateInterestByStudent(studentId, bandId, dto.IsInterested, ct);
            return Ok(result);
        }

        // GET /api/students/{studentId}/interests
        [Authorize(Roles = "Student,Recruiter,Admin")]
        [HttpGet("{studentId}/interests")]
        public async Task<ActionResult<IEnumerable<InterestDTO>>> GetInterests(string studentId)
            => Ok(await _studentService.GetStudentInterestsAsync(studentId));
    }
}
