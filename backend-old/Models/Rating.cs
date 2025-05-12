namespace Models
{
    public class Rating
    {
        public string RatingId { get; set; }
        public int Score { get; set; }  // Integer from 1 to 5 or 1 to 10
        public DateTime RatingDate { get; set; }
        public string Comment { get; set; }

        // Navigation Properties
        public string? VideoId { get; set; }  // Foreign Key
        public Video Video { get; set; }
        public string RecruiterId { get; set; }  // Foreign Key
        public ApplicationUser Recruiter { get; set; }
        public string StudentId { get; internal set; }
        public ApplicationUser Student { get; set; }

    }
}
