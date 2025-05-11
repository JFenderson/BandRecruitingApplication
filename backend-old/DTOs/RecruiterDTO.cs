using Microsoft.AspNetCore.Mvc;
using Models;
using server.Models;
using System.Diagnostics.Metrics;
using System.Text.Json.Serialization;

namespace server.DTOs
{
    [ModelBinder(BinderType = typeof(JsonModelBinder))]
    public class RecruiterDTO
    {
        //public int RecruiterBandId { get; set; }
        //public int RecruiterId { get; set; }
        public string Id { get; set; }

        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string ProfilePicture { get; set; }
        public string Password { get; set; }
        public string BandId { get; set; }

        public Band? Band { get; set; }
        public List<Offer> OffersMade { get; set; }
        public List<Comment> Comments { get; set; }
        public List<Rating> Ratings { get; set; }

        public RecruiterDTO(Recruiter recruiter)
        {

            if (recruiter == null)
            {
                throw new ArgumentNullException(nameof(recruiter), "Recruiter object cannot be null.");
            }

            Id = recruiter.Id;
            UserName = recruiter.UserName;
            FirstName = recruiter.FirstName;
            LastName = recruiter.LastName;
            Email = recruiter.Email;
            BandId = recruiter.BandId;
            Phone = recruiter.Phone;
            ProfilePicture = recruiter.ProfilePicture;
       
        }

    }

}