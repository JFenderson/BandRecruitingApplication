using Models;

namespace server.DTOs
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }

        public string UserType { get; set; } // "Student", "Recruiter"
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }


        // Student fields
        public string? Instrument { get; set; }
        public string? HighSchool { get; set; }
        public int? GraduationYear { get; set; }
        public string ProfilePicture { get; set; }


        // Recruiter field
        public Guid? BandId { get; set; }
        public Band? Band { get; set; }


        // Calculated fields
        public decimal? AverageRating { get; set; }
        public int OfferCount { get; set; }

        public List<Offer> OffersMade { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Rating> Ratings { get; set; }

        public ICollection<InterestDTO> Interests { get; set; }
    }

}
