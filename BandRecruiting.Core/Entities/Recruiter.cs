namespace BandRecruiting.Core.Entities
{
    public class Recruiter : User
    {
        public Guid RecruiterId { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public Guid BandId { get; set; }
        public Band Band { get; set; }

        public ICollection<Rating> Ratings { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }
}
