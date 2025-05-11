using Models;
using server.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Student : User
    {
        public string FirstName { get; set; }
        public string  LastName { get; set; }
        public string Phone { get; set; }
        public int GraduationYear { get; set; }
        public string Instrument { get; set; }
        public string HighSchool { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal? AverageRating { get; set; }


        // Navigation Properties
        public List<Video> Videos { get; set; }
        public List<Offer> ScholarshipOffers { get; set; }
        public List<Interest> Interests { get; set; }
        public List<Rating> Ratings { get; set; }
    }
}
