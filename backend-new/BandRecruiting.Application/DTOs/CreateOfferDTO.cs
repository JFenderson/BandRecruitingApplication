namespace BandRecruiting.Application.DTOs
{
    public class CreateOfferDTO
    {
        public string StudentId { get; set; }
        public Guid BandId { get; set; }
        public decimal Amount { get; set; }
        public string Details { get; set; }
        public DateTime? ExpirationDate { get; set; } // Optional
    }
}
