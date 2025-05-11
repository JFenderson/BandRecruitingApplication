namespace BandRecruiting.Application.DTOs
{
    public class OfferDTO
    {
        public Guid OfferId { get; set; }
        public string StudentId { get; set; }
        public string RecruiterId { get; set; } // Can be included in the service mapping
        public Guid BandId { get; set; }
        public string BandName { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string Details { get; set; }
        public DateTime OfferDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
