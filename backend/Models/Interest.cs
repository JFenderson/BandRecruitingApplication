

namespace Models
{
    public class Interest
    {

        public int InterestId { get; set; }                // existing PK
        public string StudentId { get; set; } = default!;  // FK to ApplicationUser.Id (string)
        public Guid BandId { get; set; }                   // FK to Band (Guid, non-null)

        public bool IsInterested { get; set; } = true;     // NEW: toggle flag

        // Keep your existing date, rename CreatedAt if you want, but don’t remove InterestDate if other code uses it
        public DateTime InterestDate { get; set; } = DateTime.UtcNow;  // existing creation date
        public DateTime? UpdatedAt { get; set; }                       // NEW: when toggled

        // navs
        public ApplicationUser Student { get; set; } = default!;
        public Band Band { get; set; } = default!;
    }
}
