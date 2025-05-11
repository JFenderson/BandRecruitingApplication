namespace BandRecruiting.Application.DTOs
{
    public class UpdateOfferDTO
    {
        public decimal Amount { get; set; }
        public string Details { get; set; }
        public string Status { get; set; } // "Pending", "Accepted", "Declined"
        public DateTime? ExpirationDate { get; set; }
    }
}
