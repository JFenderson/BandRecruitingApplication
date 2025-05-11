namespace server.Models
{
    public class Admin : User
    {
        public int AdminId { get; set; }
        public string UserId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
