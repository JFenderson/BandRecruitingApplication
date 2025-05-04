using System;

namespace BandRecruitingApp.Core.Entities;

public class Rating
{
    public int RatingId { get; set; }
    public int VideoId { get; set; }
    public int RecruiterId { get; set; }
    public int Score { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
