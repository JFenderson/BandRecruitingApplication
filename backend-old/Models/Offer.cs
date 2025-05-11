using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Models;

namespace Models
{
    public class Offer
    {
        [Key]
        public string OfferId { get; set; }

        [ForeignKey("Student")]
        public string StudentId { get; set; }
        public virtual Student Student { get; set; }

        [ForeignKey("Recruiter")]
        public string RecruiterId { get; set; }
        public virtual Recruiter Recruiter { get; set; }

        [ForeignKey("BandId")]
        public string BandId { get; set; }
        public virtual Band Band { get; set; }

        public string BandName { get; set; }
        public decimal Amount { get; set; }
        public DateTime OfferDate { get; set; }
        public string Status { get; set; }
    }
}
