namespace server.DTOs
{
    public class UpdateStudentDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Instrument { get; set; }
        public string? Phone { get; set; }
        public string? ProfilePicture { get; set; }
        public string? HighSchool { get; set; }
        public int? GraduationYear { get; set; }
    }
}
