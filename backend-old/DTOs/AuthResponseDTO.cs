namespace server.DTOs
{
    public class AuthResponseDTO
    {
        public string Token { get; set; }         // The new access token (JWT)
        public string RefreshToken { get; set; }  // The new refresh token
    }
}
