namespace server.DTOs
{
    public class CreateOfferDTO
    {
        public decimal Amount { get; set; }
        public string StudentId { get; set; }
        public int BandId { get; set; }
        public int OfferBandId { get; set; }
        public string RecruiterId { get; set; }
    }
}
