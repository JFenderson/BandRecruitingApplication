using BandRecruiting.Application.DTOs;
using BandRecruitingApp.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BandRecruiting.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecruiterController : ControllerBase
    {
        private readonly IRecruiterService _recruiterService;

        public RecruiterController(IRecruiterService recruiterService)
        {
            _recruiterService = recruiterService;
        }

        [HttpGet("me")]
        [Authorize(Roles = "Recruiter")]
        public IActionResult GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = _recruiterService.GetRecruiterProfile(userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpPut("me")]
        [Authorize(Roles = "Recruiter")]
        public IActionResult UpdateMyProfile([FromBody] UpdateRecruiterDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = _recruiterService.UpdateRecruiter(userId, dto);
            if (!success) return NotFound();

            return NoContent();
        }

        [HttpDelete("me")]
        [Authorize(Roles = "Recruiter")]
        public IActionResult DeleteMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = _recruiterService.DeleteByUserId(userId);
            if (!success) return NotFound();

            return NoContent();
        }

        [HttpGet("by-band/{bandId}")]
        public IActionResult GetByBand(Guid bandId)
        {
            var recruiters = _recruiterService.GetRecruitersByBand(bandId);
            return Ok(recruiters);
        }
    }
}
