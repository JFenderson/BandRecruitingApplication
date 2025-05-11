namespace server.DTOs
{
    public class CreateUserDTO
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; } // Should be "Student", "Recruiter", or "Admin"

        // Recruiter specific fields
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string BandId { get; set; }
        public string Phone { get; set; }
        public int GraduationYear { get; set; }
        public string? Instrument { get; set; }
        public string? HighSchool { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
