
namespace BandRecruiting.Core.Entities
{
    public class Offer
    {
        public Guid OfferId { get; set; } = Guid.NewGuid();

        public decimal Amount { get; set; }               // NEW
        public string Status { get; set; } = "Pending";    // NEW: could default to "Pending"
        public string Details { get; set; }                // Optional description
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ExpirationDate { get; set; }      // Optional

        public Guid BandId { get; set; }
        public Band Band { get; set; }

        public string StudentId { get; set; }
        public Student Student { get; set; }
    }
}
