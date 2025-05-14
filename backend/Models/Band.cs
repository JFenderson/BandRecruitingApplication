namespace Models
{
    public class Band
    {
        public Guid BandId { get; set; }
        public string Name { get; set; }
        public string SchoolName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Conference { get; set; }
        public string Division { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public List<ApplicationUser> Recruiters { get; set; } = new();
        public List<Offer> Offers { get; set; } = new();
        public List<Interest> InterestedStudents { get; set; } = new();
    }
}
