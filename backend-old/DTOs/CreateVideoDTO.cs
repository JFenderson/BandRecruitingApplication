namespace server.DTOs
{
    public class CreateVideoDTO
    {
        public Guid StudentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }             // <-- Add this
        public string VideoUrl { get; set; }            // <-- Optional if needed
        public DateTime CreatedAt { get; set; }         // <-- Optional if needed
    }
}
