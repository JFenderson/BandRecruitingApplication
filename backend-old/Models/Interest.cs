

namespace Models
{
    public class Interest
    {
        public int InterestId { get; set; }
        public string StudentId { get; set; }
        public string BandId { get; set; }
        public DateTime InterestDate { get; set; }

        // Navigation Properties
        public Student Student { get; set; }
        public Band Band { get; set; }
    }
}
