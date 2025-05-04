using Microsoft.AspNetCore.Mvc;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;
using System;

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
    public IActionResult AddRating([FromBody] AddRatingDTO dto)
    {
        try
        {
            _ratingService.AddRating(dto);
            return Ok(new { message = "Rating added successfully." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
