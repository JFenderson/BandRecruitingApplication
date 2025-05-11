using Models;

namespace server.DTOs
{
    public class RatingDTO
    {
        public string RatingId { get; set; }
        public string VideoId { get; set; }
        public string StudentId { get; set; }
        public string RecruiterId { get; set; }
        public string RecruiterName { get; set; }
        public int Score { get; set; }
        public DateTime RatingDate { get; set; }
    }
}