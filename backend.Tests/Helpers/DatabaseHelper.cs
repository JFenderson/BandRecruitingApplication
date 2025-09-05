using Microsoft.EntityFrameworkCore;
using server.Data;
using System;
using System.Threading.Tasks;

namespace backend.Tests.Helpers
{
    public static class DatabaseHelper
    {
        public static async Task SeedTestDataAsync(ApplicationDbContext context)
        {
            // Clear existing data
            context.Users.RemoveRange(context.Users);
            context.Bands.RemoveRange(context.Bands);
            context.Videos.RemoveRange(context.Videos);
            context.Offers.RemoveRange(context.Offers);
            context.Ratings.RemoveRange(context.Ratings);
            context.Comments.RemoveRange(context.Comments);
            context.Interests.RemoveRange(context.Interests);

            await context.SaveChangesAsync();

            // Add test bands
            var bands = new[]
            {
                new Band
                {
                    BandId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Test Band 1",
                    SchoolName = "Test University 1",
                    City = "Test City 1",
                    State = "TX",
                    Division = "I",
                    Conference = "Test Conference 1",
                    CreatedAt = DateTime.UtcNow
                },
                new Band
                {
                    BandId = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Test Band 2",
                    SchoolName = "Test University 2",
                    City = "Test City 2",
                    State = "FL",
                    Division = "II",
                    Conference = "Test Conference 2",
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Bands.AddRange(bands);

            // Add test users
            var students = new[]
            {
                new ApplicationUser
                {
                    Id = "student1",
                    Email = "student1@test.com",
                    UserName = "student1@test.com",
                    UserType = "Student",
                    FirstName = "John",
                    LastName = "Doe",
                    Phone = "123-456-7890",
                    Instrument = "Trumpet",
                    HighSchool = "Test High School",
                    GraduationYear = 2025,
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                },
                new ApplicationUser
                {
                    Id = "student2",
                    Email = "student2@test.com",
                    UserName = "student2@test.com",
                    UserType = "Student",
                    FirstName = "Jane",
                    LastName = "Smith",
                    Phone = "123-456-7891",
                    Instrument = "Trombone",
                    HighSchool = "Another High School",
                    GraduationYear = 2024,
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                }
            };

            var recruiters = new[]
            {
                new ApplicationUser
                {
                    Id = "recruiter1",
                    Email = "recruiter1@test.com",
                    UserName = "recruiter1@test.com",
                    UserType = "Recruiter",
                    FirstName = "Bob",
                    LastName = "Wilson",
                    Phone = "123-456-7892",
                    BandId = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    CreatedAt = DateTime.UtcNow,
                    EmailConfirmed = true
                }
            };

            var admin = new ApplicationUser
            {
                Id = "admin1",
                Email = "admin@test.com",
                UserName = "admin@test.com",
                UserType = "Admin",
                FirstName = "Admin",
                LastName = "User",
                Phone = "123-456-7893",
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            context.Users.AddRange(students);
            context.Users.AddRange(recruiters);
            context.Users.Add(admin);

            await context.SaveChangesAsync();
        }
    }
}