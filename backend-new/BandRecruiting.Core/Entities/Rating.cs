namespace BandRecruiting.Core.Entities
{
    public class Rating
    {
        public Guid RatingId { get; set; } = Guid.NewGuid();
        public int Score { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid VideoId { get; set; }
        public Video Video { get; set; }

        public string RecruiterId { get; set; }
        public Recruiter Recruiter { get; set; }
        public string StudentId { get; set; }
        public Student Student { get; set; }
    }
}
