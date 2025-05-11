namespace BandRecruiting.Core.Entities
{
    public class Band
    {
        public Guid BandId { get; set; }
        public string Name { get; set; }
        public string School { get; set; }
        public string Location { get; set; }
        public ICollection<Recruiter> Recruiters { get; set; } = new List<Recruiter>();
        public ICollection<Offer> Offers { get; set; } = new List<Offer>();
        public ICollection<Interest> Interests { get; set; } = new List<Interest>();
    }
}
