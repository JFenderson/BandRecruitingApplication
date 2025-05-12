namespace Models
{
    public class Band
    {
        public Guid BandId { get; set; } // This should be the primary key
        public string Name { get; set; }
        public string SchoolName { get; set; }
        public string Location { get; set; }
        public int NumberOfMembers { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public List<ApplicationUser> Recruiters { get; set; } = new();
        public List<Offer> Offers { get; set; } = new();
        public List<Interest> InterestedStudents { get; set; } = new();
    }
}
