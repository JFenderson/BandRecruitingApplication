namespace BandRecruiting.Application.DTOs
{
    public class CreateRecruiterDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Guid BandId { get; set; }
    }
}

