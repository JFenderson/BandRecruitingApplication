namespace server.DTOs
{
    public class CreateCommentDTO
    {
        public int VideoId { get; set; }
        public string RecruiterId { get; set; }
        public string Content { get; set; }
    }
}
