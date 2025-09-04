using Microsoft.AspNetCore.Http;

namespace server.DTOs
{
    public class UpdateVideoDTO
    {
        public Guid StudentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }
}

