

namespace Models
{
    public class Interest
    {
        public int InterestId { get; set; }
        public string StudentId { get; set; }
        public Guid? BandId { get; set; }
        public DateTime InterestDate { get; set; }

        // Navigation Properties
        public ApplicationUser Student { get; set; }
        public Band Band { get; set; }
    }
}
