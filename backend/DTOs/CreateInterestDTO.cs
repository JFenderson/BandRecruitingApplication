namespace server.DTOs
{
    public class CreateInterestDTO
    {
        public int InterestId { get; set; }

        public string StudentId { get; set; }
        public Guid BandId { get; set; }
    }
}
