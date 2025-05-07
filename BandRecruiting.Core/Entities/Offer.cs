
namespace BandRecruiting.Core.Entities
{
    public class Offer
    {
        public Guid OfferId { get; set; } = Guid.NewGuid();
        public string Details { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid BandId { get; set; }
        public Band Band { get; set; }

        public string StudentId { get; set; }
        public Student Student { get; set; }
    }
}
