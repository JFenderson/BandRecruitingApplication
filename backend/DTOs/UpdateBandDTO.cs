namespace server.DTOs
{
    public class UpdateBandDTO
    {
        public Guid BandId { get; set; }
        public string Name { get; set; }
        public string SchoolName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Conference { get; set; }
        public string Division { get; set; }
    }
}
