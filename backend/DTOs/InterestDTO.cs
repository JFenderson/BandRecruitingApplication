namespace server.DTOs
{
    public class InterestDTO
    {
        public int InterestId { get; set; }
        public string StudentId { get; set; } = default!;
        public string StudentName { get; set; } = string.Empty;

        public Guid BandId { get; set; }                 // Guid, not string
        public string BandName { get; set; } = string.Empty;
        public string SchoolName { get; set; } = string.Empty;

        public DateTime InterestDate { get; set; }       // creation date
        // Optional: expose IsInterested/UpdatedAt if the UI needs it
        public bool IsInterested { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public record UpdateInterestDto(bool IsInterested);


}