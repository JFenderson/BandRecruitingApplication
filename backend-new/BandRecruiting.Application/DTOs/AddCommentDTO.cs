namespace BandRecruitingApp.Application.DTOs
{
    public class AddCommentDTO
    {
        public Guid VideoId { get; set; }
        public string RecruiterId { get; set; }
        public string Text { get; set; }
    }
}
