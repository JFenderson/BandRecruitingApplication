using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class CreateRecruiterDTO
    {
        public string UserName { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BandId { get; set; }
        // Optional properties
        public string Phone { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
