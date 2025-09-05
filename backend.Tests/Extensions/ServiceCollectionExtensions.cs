using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using server.Data;
using System;
using System.Threading.Tasks;

namespace backend.Tests.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddTestDatabase(this IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase(Guid.NewGuid().ToString()));

            return services;
        }

        public static IServiceCollection AddTestIdentity(this IServiceCollection services)
        {
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Simplified options for testing
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.Password.RequiredLength = 1;
                options.User.RequireUniqueEmail = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            return services;
        }

        public static async Task<ApplicationDbContext> SeedTestDataAsync(this ApplicationDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            // Seed test data if needed
            if (!context.Bands.Any())
            {
                var testBands = new[]
                {
                    TestDataBuilder.CreateTestBand(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Seeded Test Band 1"),
                    TestDataBuilder.CreateTestBand(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Seeded Test Band 2")
                };

                context.Bands.AddRange(testBands);
                await context.SaveChangesAsync();
            }

            return context;
        }
    }
}