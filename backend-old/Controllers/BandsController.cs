using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Data;
using Models;
using server.DTOs;
using server.Services;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BandsController : ControllerBase
    {
        private readonly IBandService _bandService;

        public BandsController(IBandService bandService)
        {
            _bandService = bandService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Band>>> GetBands()
        {
            var bands = await _bandService.GetBandsAsync();
            return Ok(bands);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Band>> GetBand(string id)
        {
            try
            {
                var band = await _bandService.GetBandByIdAsync(id);
                if (band == null)
                {
                    return NotFound();
                }

                return Ok(band);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });
            }


        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost]
        public async Task<ActionResult<Band>> CreateBand(Band band)
        {
            var createdBand = await _bandService.CreateBandAsync(band);
            return CreatedAtAction(nameof(GetBand), new { id = createdBand.BandId }, createdBand);
        }

        [Authorize(Policy = "RequireRecruiterRole")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBand(string id, Band band)
        {
            if (id != band.BandId)
            {
                return BadRequest();
            }

            var success = await _bandService.UpdateBandAsync(band);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBand(string id)
        {
            var success = await _bandService.DeleteBandAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("{id}/interestedStudents")]
        public async Task<ActionResult<Band>> GetBandInterestedStudents(string id)
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
