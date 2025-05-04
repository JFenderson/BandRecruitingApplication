using Microsoft.AspNetCore.Mvc;
using BandRecruitingApp.Application.DTOs;
using BandRecruitingApp.Application.Services;
using Microsoft.AspNetCore.Authorization;

namespace BandRecruitingApp.API.Controllers;

[Authorize] // Requires valid JWT
[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpPost]
    public IActionResult CreateStudent([FromBody] CreateStudentDTO dto)
    {
        // TODO: Replace this with the actual user ID from Identity once hooked up
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();


        _studentService.CreateStudent(userId, dto);
        return Ok(new { message = "Student profile created successfully." });
    }

    [HttpGet("me")]
    public IActionResult GetMyProfile()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var student = _studentService.GetByUserId(userId);
        if (student == null)
            return NotFound(new { message = "Student profile not found." });

        return Ok(student);
    }

}
