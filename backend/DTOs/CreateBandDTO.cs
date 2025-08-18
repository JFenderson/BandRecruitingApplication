namespace server.DTOs
{
    public class CreateBandDTO
    {
        public required string Name { get; set; }
        public required string SchoolName { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }       // FE: select list
        public required string Division { get; set; }    // FE: select list
        public required string Conference { get; set; }  // FE: select list

    }
}
