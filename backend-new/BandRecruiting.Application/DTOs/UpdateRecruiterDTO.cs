namespace BandRecruiting.Application.DTOs
{
    public class UpdateRecruiterDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public Guid BandId { get; set; }
        public string Email { get; set; }
    }

}
