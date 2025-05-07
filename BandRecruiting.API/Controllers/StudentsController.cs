using BandRecruiting.Application.DTOs;
using BandRecruitingApp.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BandRecruiting.API.Controllers;

[ApiController]
[Route("api/students")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAll()
    {
        var students = _studentService.GetAll();
        return Ok(students);
    }

    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    public IActionResult GetMyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var student = _studentService.GetByUserId(userId);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpPut("me")]
    [Authorize(Roles = "Student")]
    public IActionResult UpdateMyProfile([FromBody] UpdateStudentDTO dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var success = _studentService.UpdateStudent(userId, dto);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("me")]
    [Authorize(Roles = "Student")]
    public IActionResult DeleteMyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var success = _studentService.DeleteByUserId(userId);
        if (!success) return NotFound();
        return NoContent();
    }


    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Recruiter")]
    public IActionResult GetById(Guid id)
    {
        var student = _studentService.GetById(id);
        if (student == null) return NotFound();
        return Ok(student);
    }
}
