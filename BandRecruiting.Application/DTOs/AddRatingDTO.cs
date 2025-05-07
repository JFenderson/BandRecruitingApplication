namespace BandRecruitingApp.Application.DTOs
{
    public class AddRatingDTO
    {
        public Guid VideoId { get; set; }
        public string RecruiterId { get; set; }
        public int Score { get; set; }
    }
}
