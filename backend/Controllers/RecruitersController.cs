﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using server.DTOs;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecruiterController : ControllerBase
    {
        private readonly IRecruiterService _recruiterService;
        private readonly IStudentService _studentService;
        private readonly IRatingService _ratingService;
        private readonly ICommentService _commentService;
        private readonly IOfferService _offerService;

        public RecruiterController(
            IRecruiterService recruiterService,
            IStudentService studentService,
            IOfferService offerService,
            IRatingService ratingService,
            ICommentService commentService)
        {
            _recruiterService = recruiterService;
            _studentService = studentService;
            _ratingService = ratingService;
            _offerService = offerService;
            _commentService = commentService;
        }

        #region Recruiter
        // GET: api/recruiter
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetRecruiters()
        {
            var recruiters = await _recruiterService.GetRecruitersAsync();
            return Ok(recruiters);
        }

        // GET: api/recruiter/{id}
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationUser>> GetRecruiterById(string id)
        {
            try
            {
                var recruiter = await _recruiterService.GetRecruiterByIdAsync(id);
                return Ok(recruiter);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });
            }


        }

        // GET: api/recruiter/band/{id}
        [HttpGet("band/{id}")]
        public async Task<ActionResult<Band>> GetRecruitersByBand(Guid id)
        {
            try
            {
                var recruiter = await _recruiterService.GetRecruitersByBandAsync(id);
                return Ok(recruiter);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });
            }


        }

        // POST: api/recruiter
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> CreateRecruiter([FromBody] CreateUserDTO recruiterDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var recruiter = await _recruiterService.CreateRecruiterAsync(recruiterDto);
                return Ok(recruiter);
            }
            catch (Exception ex)
            {
                // Return the detailed error message to diagnose the issue
                var innerException = ex.InnerException?.Message ?? ex.Message;
                return BadRequest(new { Error = ex.Message });
            }
        }

        // PUT: api/recruiter/{id}
        [Authorize(Roles = "Recruiter,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApplicationUser>> UpdateRecruiter(string id, [FromBody] UpdateUserDTO updateUserDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedRecruiter = await _recruiterService.UpdateRecruiterAsync(id, updateUserDTO);
                return Ok(updatedRecruiter);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        // DELETE: api/recruiter/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecruiter(string id)
        {
            var recruiter = await _recruiterService.GetRecruiterByIdAsync(id);
            if (recruiter == null)
                return NotFound();

            await _recruiterService.DeleteRecruiterAsync(id);

            return NoContent();
        }
        #endregion

        #region Comment
        // POST: api/recruiter/{recruiterId}/comment/{studentId}
        [HttpPost("{recruiterId}/comment/{studentId}")]
        public async Task<IActionResult> CommentOnStudent(string recruiterId, string studentId, [FromBody] CommentDTO commentDTO)
        {
            //var student = await _studentService.GetStudentByIdAsync(studentId);
            //if (student == null)
            //{
            //    return NotFound("Student not found.");
            //}

            var result = await _commentService.CommentOnStudentAsync(recruiterId, studentId, commentDTO);
            if (!result)
            {
                return BadRequest("Comment failed.");
            }

            return Ok("Comment submitted successfully.");
        }

        // POST: api/recruiter/comment
        [HttpPost("comment")]
        public async Task<ActionResult<Comment>> AddComment([FromBody] CommentDTO commentDTO)
        {
            var comment = await _commentService.CommentOnVideoAsync(commentDTO.VideoId, commentDTO.RecruiterId, commentDTO.Content);
            return Ok(comment);
        }

        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetRecruiterComments(string id)
        {
            var comments = await _recruiterService.GetRecruiterCommentsAsync(id);
            return Ok(comments.Select(c => new CommentDTO(c)));
        }
        #endregion

        #region Rating

        [HttpGet("{id}/ratings")]
        public async Task<ActionResult<IEnumerable<RatingDTO>>> GetRecruiterRatings(string id)
        {
            var ratings = await _recruiterService.GetRecruiterRatingsAsync(id);
            return Ok(ratings);
        }

        // GET: api/recruiter/ratings/student/{studentId}
        [HttpGet("ratings/student/{studentId}")]
        public async Task<ActionResult<IEnumerable<Rating>>> GetRatings(string studentId)
        {
            var ratings = await _ratingService.GetRatingsByStudentId(studentId);
            return Ok(ratings);
        }

        // GET: api/recruiter/ratings/student/{studentId}/average
        [HttpGet("ratings/student/{studentId}/average")]
        public async Task<ActionResult<double>> GetAverageRating(string studentId)
        {
            var averageRating = await _ratingService.GetAverageRatingForStudentAsync(studentId);
            return Ok(averageRating);
        }
        #endregion

        #region Offer


        [HttpGet("{offerId}/student/{studentId}")]
        public async Task<IActionResult> GetOffer(string offerId, string studentId)
        {
            var offer = await _offerService.GetOfferAsync(offerId, studentId);
            if (offer == null)
            {
                return NotFound();
            }
            return Ok(offer);
        }


        [HttpGet("{id}/offers")]
        public async Task<ActionResult<IEnumerable<OfferDTO>>> GetRecruiterOffers(string id)
        {
            var offers = await _offerService.GetOffersByRecruiterAsync(id);
            return Ok(offers);
        }


        [HttpDelete("{offerId}/offer")]
        public async Task<IActionResult> DeleteOffer(string offerId)
        {
            await _offerService.DeleteOfferAsync(offerId);
            return NoContent();
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetOffersByStudent(string studentId)
        {
            var offers = await _offerService.GetOffersByStudentAsync(studentId);
            return Ok(offers);
        }


        #endregion


    }
}