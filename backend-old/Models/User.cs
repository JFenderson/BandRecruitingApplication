using Microsoft.AspNetCore.Identity;

namespace server.Models
{
    public class User : IdentityUser
    {
        public string UserType { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }

    //public string UserType
    //{
    //    "Student",
    //    "Recruiter",
    //    "Admin"
    //}
}
