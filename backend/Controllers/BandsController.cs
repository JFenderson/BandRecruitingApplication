using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using server.DTOs;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/bands")]
    public class BandsController : ControllerBase
    {
        private readonly IBandService _bandService;

        public BandsController(IBandService bandService)
        {
            _bandService = bandService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BandDTO>>> GetBands()
        {
            var bands = await _bandService.GetBandsAsync();
            return Ok(bands);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BandDTO>> GetBand(Guid id)
        {
            var band = await _bandService.GetBandByIdAsync(id);
            if (band == null)
            {
                return NotFound();
            }
            return Ok(band);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<BandDTO>> CreateBand([FromBody] CreateBandDTO bandDto)
        {
            var createdBand = await _bandService.CreateBandAsync(bandDto);
            return CreatedAtAction(nameof(GetBand), new { id = createdBand.BandId }, createdBand);
        }

        [Authorize(Roles = "Recruiter,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBand(Guid id, [FromBody] UpdateBandDTO bandDto)
        {
            if (id != bandDto.BandId)
            {
                return BadRequest("Mismatched BandId");
            }

            var success = await _bandService.UpdateBandAsync(bandDto);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBand(Guid id)
        {
            var success = await _bandService.DeleteBandAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        [Authorize(Roles = "Recruiter,Admin")]
        [HttpGet("{id}/interestedStudents")]
        public async Task<ActionResult<Band>> GetBandInterestedStudents(Guid id)
        {
            try
            {
                var interestedStudents = await _bandService.GetInterestedStudentsAsync(id);
                if (interestedStudents == null)
                {
                    return NotFound();
                }

                return Ok(interestedStudents);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });
            }


        }
    }
}
