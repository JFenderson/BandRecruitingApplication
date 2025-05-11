using System;

namespace Models
{
    public class Comment
    {
        public string CommentId { get; set; }
        public string Content { get; set; }
        public DateTime CommentDate { get; set; }

        // Navigation Properties
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public string VideoId { get; set; }  // Foreign Key
        public Video Video { get; set; }
        public string RecruiterId { get; set; }  // Foreign Key
        public Recruiter Recruiter { get; set; }
    }
}
