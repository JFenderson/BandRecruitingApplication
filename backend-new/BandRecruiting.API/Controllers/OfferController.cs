using BandRecruiting.Application.DTOs;
using BandRecruitingApp.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BandRecruiting.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OfferController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        // Recruiter sends an offer
        [HttpPost]
        [Authorize(Roles = "Recruiter")]
        public IActionResult CreateOffer([FromBody] CreateOfferDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var bandIdClaim = User.FindFirst("BandId")?.Value;

            if (!Guid.TryParse(bandIdClaim, out Guid bandId))
                return BadRequest("BandId missing or invalid.");

            _offerService.CreateOffer(dto, userId, bandId, dto.Amount);
            return Ok("Offer created.");
        }

        // Student views their offers
        [HttpGet("student")]
        [Authorize(Roles = "Student")]
        public IActionResult GetStudentOffers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var offers = _offerService.GetOffersByStudentId(userId);
            return Ok(offers);
        }

        // Recruiter or Band admin views offers made by their band
        [HttpGet("band/{bandId}")]
        [Authorize(Roles = "Recruiter,Admin")]
        public IActionResult GetBandOffers(Guid bandId)
        {
            var offers = _offerService.GetOffersByBandId(bandId);
            return Ok(offers);
        }

        [HttpDelete("{offerId}")]
        [Authorize(Roles = "Recruiter")]
        public IActionResult DeleteOffer(Guid offerId)
        {
            var success = _offerService.DeleteOffer(offerId);
            if (!success) return NotFound("Offer not found.");
            return NoContent();
        }
    }
}
