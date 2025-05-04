namespace BandRecruitingApp.Application.DTOs;

public class AddRatingDTO
{
    public int VideoId { get; set; }
    public int RecruiterId { get; set; }
    public int Score { get; set; }
}
