﻿namespace server.DTOs
{
    public class UploadedVideoResult
    {
        public Guid StudentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
