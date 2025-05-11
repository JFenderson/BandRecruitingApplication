namespace BandRecruiting.Core.Entities
{
    public class Admin : User
    {
        public Guid AdminId { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
