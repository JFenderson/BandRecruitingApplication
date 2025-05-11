using Microsoft.AspNetCore.Mvc;
using Models;
using server.DTOs;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        //[HttpPost("student/{studentId}/rate")]
        //public async Task<IActionResult> RateStudent(string studentId, [FromBody] RatingDTO ratingDto)
        //{
        //    var rating = await _ratingService.AddOrUpdateRatingAsync(studentId, ratingDto.RecruiterId, ratingDto.Score);
        //    return Ok(rating);
        //}

        [HttpPost("student/{studentId}/rate")]
        public async Task<IActionResult> RateStudent(string studentId,string recruiterId, [FromBody] CreateRatingDTO ratingDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //var recruiterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (recruiterId == null)
            //{
            //    return Unauthorized("Recruiter not found");
            //}

            try
            {
                var rating = await _ratingService.RateStudentAsync(recruiterId, studentId, ratingDTO);
                return Ok(rating);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("student/{studentId}/averageRating")]
        public async Task<IActionResult> GetAverageRatingForStudentAsync(string studentId)
        {
            var avgRating = await _ratingService.GetAverageRatingForStudentAsync(studentId);
            return Ok(avgRating);
        }

        [HttpGet("student/{studentId}/ratings")]
        public async Task<IActionResult> GetStudentRatings(string studentId)
        {
            var ratings = await _ratingService.GetRatingsByStudentId(studentId);
            return Ok(ratings);
        }

        [HttpGet("video/{videoId}/ratings")]
        public async Task<IActionResult> GetVideoRatings(string videoId)
        {
            var ratings = await _ratingService.GetRatingsByVideoId(videoId);
            return Ok(ratings);
        }
    }
}
