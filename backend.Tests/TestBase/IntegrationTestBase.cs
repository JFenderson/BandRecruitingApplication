using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using server.Data;
using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Tests.TestBase
{
    public class IntegrationTestBase : IClassFixture<WebApplicationFactory<Program>>
    {
        protected readonly WebApplicationFactory<Program> _factory;
        protected readonly HttpClient _client;
        protected readonly ApplicationDbContext _context;

        public IntegrationTestBase(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the existing DbContext registration
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Add in-memory database for testing
                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb");
                    });

                    // Build the service provider
                    var sp = services.BuildServiceProvider();

                    // Create a scope to obtain a reference to the database contexts
                    using var scope = sp.CreateScope();
                    var scopedServices = scope.ServiceProvider;
                    var context = scopedServices.GetRequiredService<ApplicationDbContext>();
                    var logger = scopedServices.GetRequiredService<ILogger<IntegrationTestBase>>();

                    // Ensure the database is created
                    context.Database.EnsureCreated();

                    try
                    {
                        // Seed the database with test data if needed
                        SeedTestData(context);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "An error occurred seeding the database with test messages.");
                    }
                });
            });

            _client = _factory.CreateClient();

            using var scope = _factory.Services.CreateScope();
            _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        }

        protected virtual void SeedTestData(ApplicationDbContext context)
        {
            // Override in derived classes to seed specific test data
        }

        protected async Task<string> GetJwtTokenAsync(string email = "test@example.com", string role = "Student")
        {
            // Implementation to get JWT token for authenticated requests
            // This would use your authentication endpoint
            var loginRequest = new
            {
                Email = email,
                Password = "Test123!"
            };

            // Return token for use in Authorization header
            return "your-jwt-token-here";
        }
    }
}