using Microsoft.AspNetCore.Identity;

namespace BandRecruiting.Core.Entities
{
    public abstract class User : IdentityUser<string>
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Student? Student { get; set; }
        public Recruiter? Recruiter { get; set; }
    }
}
