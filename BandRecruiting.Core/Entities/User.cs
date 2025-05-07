using Microsoft.AspNetCore.Identity;

namespace BandRecruiting.Core.Entities
{
    public abstract class User : IdentityUser<string>
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Add these custom properties
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }  // Optional if you're not using Identity's built-in PhoneNumber

        // Navigation properties
        public Student? Student { get; set; }
        public Recruiter? Recruiter { get; set; }
    }
}
