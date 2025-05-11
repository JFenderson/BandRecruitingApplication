using Models;
using server.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{

    public class Recruiter : User
    {
        public string BandId { get; set; } // Foreign key referencing Band.BandId

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation Properties
        public Band Band { get; set; }
        public List<Offer> OffersMade { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
        public List<Rating> Ratings { get; set; } = new();
    }
}
