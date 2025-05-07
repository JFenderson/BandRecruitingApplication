using BandRecruiting.Application.DTOs;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BandRecruitingApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpPost]
    public async Task<IActionResult> AddComment([FromBody] AddCommentDTO dto)
    {
        try
        {
            await _commentService.AddCommentAsync(dto.VideoId, dto.RecruiterId, dto.Text);
            return Ok(new { message = "Comment added successfully." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Recruiter,Student")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var success = await _commentService.DeleteCommentAsync(id, userId);
        if (!success) return Forbid();
        return NoContent();
    }

    [HttpPut("{commentId}")]
    [Authorize(Roles = "Recruiter")]
    public async Task<IActionResult> UpdateComment(Guid commentId, [FromBody] UpdateCommentDTO dto)
    {
        var recruiterId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var success = await _commentService.UpdateCommentAsync(commentId, recruiterId, dto.Text);

        if (!success) return NotFound("Comment not found or not owned by user");

        return NoContent();
    }

    [HttpGet("video/{videoId}")]
    public async Task<IActionResult> GetByVideoId(Guid videoId)
    {
        var comments = await _commentService.GetCommentsByVideoIdAsync(videoId);
        return Ok(comments);
    }

}
