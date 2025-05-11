using BandRecruiting.Application.Services;
using BandRecruitingApp.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BandRecruitingApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [HttpPost]
    public async Task<IActionResult> AddRating([FromBody] AddRatingDTO dto)
    {
        try
        {
            await _ratingService.AddRatingAsync(dto.VideoId, dto.RecruiterId, dto.Score);
            return Ok(new { message = "Rating added successfully." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
