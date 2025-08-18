namespace server.DTOs
{
    public class CreateUserDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; } // "Student", "Recruiter", "Admin"
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }

        // Student
        public string? Instrument { get; set; }
        public string? HighSchool { get; set; }
        public string? ProfilePicture { get; set; }
        public int? GraduationYear { get; set; }
        // Recruiter
        public Guid? BandId { get; set; }

       


    }

}
