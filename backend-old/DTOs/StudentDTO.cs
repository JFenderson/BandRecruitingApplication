using Microsoft.AspNetCore.Http.HttpResults;
using Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace server.DTOs
{
    public class StudentDTO
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Instrument { get; set; }
        public string HighSchool { get; set; }
        public string Phone { get; set; }
        public int GraduationYear { get; set; }
        public string ProfilePicture { get; set; }

        public decimal? AverageRating { get; set; }
        public int OfferCount { get; set; }
        public ICollection<InterestDTO> Interests { get; set; }
        public StudentDTO(Student student)
        {
            if (student == null)
            {
                throw new ArgumentNullException(nameof(student), "Student object cannot be null.");
            }

            Id = student.Id;
            UserName = student.UserName;
            FirstName = student.FirstName;
            LastName = student.LastName;
            Email = student.Email;
            Phone = student.Phone;
            GraduationYear = student.GraduationYear;
            Instrument = student.Instrument;
            HighSchool = student.HighSchool;
            ProfilePicture = student.ProfilePicture;

            // These fields can be initialized later
            AverageRating = student.AverageRating; // Set this later in the service method
            OfferCount = 0; // Set this later in the service method
        }
    }
}