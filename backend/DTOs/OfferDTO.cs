namespace server.DTOs
{
    public class OfferDTO
    {
        public string OfferId { get; set; }
        public string StudentId { get; set; }
        public string RecruiterId { get; set; }
        public Guid BandId { get; set; }
        public string BandName { get; set; }
        public string SchoolName { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime OfferDate { get; set; }

    }


}