namespace BandRecruiting.Application.DTOs
{
    public class CommentDTO
    {
        public Guid CommentId { get; set; }
        public Guid VideoId { get; set; }
        public string RecruiterId { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
