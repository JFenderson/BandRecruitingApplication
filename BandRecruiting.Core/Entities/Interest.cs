
namespace BandRecruiting.Core.Entities
{
    public class Interest
    {
        public Guid InterestId { get; set; } = Guid.NewGuid();

        public string StudentId { get; set; }
        public Student Student { get; set; }

        public Guid BandId { get; set; }
        public Band Band { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
