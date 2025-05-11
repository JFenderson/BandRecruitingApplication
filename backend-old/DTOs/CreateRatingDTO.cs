namespace server.DTOs
{
    public class CreateRatingDTO
    {
        public string RatingId { get; set; }  // Optional: Can be generated on backend
        public int Score { get; set; }
        public DateTime RatingDate { get; set; }
        public string RecruiterId { get; set; }
        public string? Comment { get; set; }  // Optional, can be nullable if not required
        public string? VideoId { get; set; }  // Only include if rating a video
    }
}
