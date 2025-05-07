namespace BandRecruiting.Core.Entities
{
    public class Comment
    {
        public Guid CommentId { get; set; } = Guid.NewGuid();
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid VideoId { get; set; }
        public Video Video { get; set; }

        public string RecruiterId { get; set; }
        public Recruiter Recruiter { get; set; }
    }
}
