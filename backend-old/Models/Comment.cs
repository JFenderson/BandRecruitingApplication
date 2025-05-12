namespace Models
{
    public class Comment
    {
        public string CommentId { get; set; }
        public string Content { get; set; }
        public DateTime CommentDate { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public string StudentId { get; set; }
        public ApplicationUser Student { get; set; }
        public string VideoId { get; set; }  // Foreign Key
        public Video Video { get; set; }
        public string RecruiterId { get; set; }  // Foreign Key
        public ApplicationUser Recruiter { get; set; }
    }
}
