using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace server.Helpers
{
    public static class SeedData
    {
        // Tweak counts here
        private const int StudentCount = 20;
        private const int RecruiterCount = 20;
        private const int VideosPerStudentMin = 1;
        private const int VideosPerStudentMax = 2;
        private const int RatingCount = 100;
        private const int CommentCount = 120;
        private const int OfferCount = 40;

        // One source of truth for passwords
        private const string AdminPassword = "Admin123!";
        private const string StudentPassword = "Password123!";
        private const string RecruiterPassword = "Password123!";

        public static async Task Initialize(IServiceProvider sp, UserManager<ApplicationUser> userManager)
        {
            var roleManager = sp.GetRequiredService<RoleManager<IdentityRole>>();
            var db = sp.GetRequiredService<ApplicationDbContext>();
            var faker = new Faker();

            await db.Database.MigrateAsync();

            await EnsureRoles(roleManager);
            await CreateDefaultAdmin(userManager);

            await SeedBands(db);

            await SeedStudents(db, userManager, StudentCount, faker);
            await SeedRecruiters(db, userManager, RecruiterCount, faker);

            await SeedVideos(db, faker);
            await SeedRatings(db, faker);
            await SeedComments(db, faker);
            await SeedOffers(db, faker);

            await db.SaveChangesAsync();
        }

        private static async Task EnsureRoles(RoleManager<IdentityRole> roleManager)
        {
            foreach (var r in new[] { "Admin", "Student", "Recruiter" })
            {
                if (!await roleManager.RoleExistsAsync(r))
                {
                    var res = await roleManager.CreateAsync(new IdentityRole(r));
                    if (!res.Succeeded)
                        Console.WriteLine($"Role create failed: {r} -> {string.Join(", ", res.Errors.Select(e => e.Description))}");
                }
            }
        }

        private static async Task CreateDefaultAdmin(UserManager<ApplicationUser> userManager)
        {
            const string email = "admin@bandrecruitingapp.com";
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = "System",
                    LastName = "Administrator",
                    UserType = "Admin",
                    Phone = "000-000-0000",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    RefreshToken = GenerateRefreshToken(),
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
                };
                var create = await userManager.CreateAsync(user, AdminPassword);
                if (!create.Succeeded)
                {
                    Console.WriteLine($"Admin create failed: {string.Join(", ", create.Errors.Select(e => e.Description))}");
                    return;
                }
            }

            // ensure role
            if (!(await userManager.GetRolesAsync(user)).Contains("Admin"))
                await userManager.AddToRoleAsync(user, "Admin");
        }

        private static async Task SeedBands(ApplicationDbContext db)
        {
            if (await db.Bands.AnyAsync())
                return;

            var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "Bands.json");
            if (!File.Exists(jsonPath))
            {
                Console.WriteLine($"Bands.json not found at {jsonPath}. Skipping band seeding.");
                return;
            }

            var json = await File.ReadAllTextAsync(jsonPath);
            var seeds = JsonSerializer.Deserialize<List<BandSeedModel>>(json) ?? new();

            var bands = seeds.Select(h => new Band
            {
                BandId = Guid.NewGuid(),
                SchoolName = h.SchoolName,
                Name = h.MarchingBand,
                City = h.City,
                State = h.State,
                Conference = h.Conference,
                Division = h.Division
            }).ToList();

            await db.Bands.AddRangeAsync(bands);
        }

        private static async Task SeedStudents(ApplicationDbContext db, UserManager<ApplicationUser> um, int count, Faker faker)
        {
            var existing = await db.Users.CountAsync(u => u.UserType == "Student");
            var toCreate = Math.Max(0, count - existing);
            if (toCreate == 0) return;

            string[] instruments =
            {
                "Trumpet","Trombone","Saxophone","Tuba","Clarinet","Snare Drum","Tenor Drum",
                "Bass Drum","Cymbals","Flute","Mellophone","Piccolo","Baritone"
            };

            for (int i = 0; i < toCreate; i++)
            {
                var email = $"student{existing + i + 1}@example.com";
                var user = new ApplicationUser
                {
                    UserType = "Student",
                    UserName = email,
                    Email = email,
                    FirstName = faker.Name.FirstName(),
                    LastName = faker.Name.LastName(),
                    Phone = faker.Phone.PhoneNumber(),
                    EmailConfirmed = true,
                    Instrument = faker.PickRandom(instruments),
                    HighSchool = GenerateHighSchoolName(faker),
                    GraduationYear = faker.Date.Future(2).Year,
                    CreatedAt = DateTime.UtcNow,
                    AverageRating = Math.Round(faker.Random.Decimal(1, 5), 1),
                    RefreshToken = GenerateRefreshToken(),
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
                };

                var create = await um.CreateAsync(user, StudentPassword);
                if (create.Succeeded)
                    await EnsureRoleAsync(um, user, "Student");
                else
                    Console.WriteLine($"Student create failed: {string.Join(", ", create.Errors.Select(e => e.Description))}");
            }
        }

        private static async Task SeedRecruiters(ApplicationDbContext db, UserManager<ApplicationUser> um, int count, Faker faker)
        {
            var bands = await db.Bands.Select(b => b.BandId).ToListAsync();
            if (!bands.Any())
            {
                Console.WriteLine("No bands found. Recruiter seeding skipped.");
                return;
            }

            var existing = await db.Users.CountAsync(u => u.UserType == "Recruiter");
            var toCreate = Math.Max(0, count - existing);
            if (toCreate == 0) // fix up any existing recruiters that have no role or wrong password
            {
                await NormalizeRecruitersAsync(db, um);
                return;
            }

            for (int i = 0; i < toCreate; i++)
            {
                var email = $"recruiter{existing + i + 1}@hbcu.edu";
                var user = new ApplicationUser
                {
                    UserType = "Recruiter",
                    UserName = email,
                    Email = email,
                    FirstName = faker.Name.FirstName(),
                    LastName = faker.Name.LastName(),
                    Phone = faker.Phone.PhoneNumber(),
                    EmailConfirmed = true,
                    BandId = faker.PickRandom(bands),
                    CreatedAt = DateTime.UtcNow,
                    RefreshToken = GenerateRefreshToken(),
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
                };

                var create = await um.CreateAsync(user, RecruiterPassword);
                if (create.Succeeded)
                    await EnsureRoleAsync(um, user, "Recruiter");
                else
                    Console.WriteLine($"Recruiter create failed: {string.Join(", ", create.Errors.Select(e => e.Description))}");
            }

            await NormalizeRecruitersAsync(db, um);
        }

        private static async Task NormalizeRecruitersAsync(ApplicationDbContext db, UserManager<ApplicationUser> um)
        {
            // Ensure all recruiters have role and a password set to RecruiterPassword
            var recruiters = await db.Users.Where(u => u.UserType == "Recruiter").ToListAsync();
            foreach (var r in recruiters)
            {
                var roles = await um.GetRolesAsync(r);
                if (!roles.Contains("Recruiter"))
                    await um.AddToRoleAsync(r, "Recruiter");

                // Reset password to known value if needed
                if (await um.HasPasswordAsync(r))
                {
                    var remove = await um.RemovePasswordAsync(r);
                    if (!remove.Succeeded)
                    {
                        Console.WriteLine($"Password remove failed for {r.Email}: {string.Join(", ", remove.Errors.Select(e => e.Description))}");
                        continue;
                    }
                }
                var add = await um.AddPasswordAsync(r, RecruiterPassword);
                if (!add.Succeeded)
                    Console.WriteLine($"Password set failed for {r.Email}: {string.Join(", ", add.Errors.Select(e => e.Description))}");
            }
        }

        private static async Task SeedVideos(ApplicationDbContext db, Faker faker)
        {
            // If videos already exist, keep them
            if (await db.Set<Video>().AnyAsync()) return;

            var studentIds = await db.Users.Where(u => u.UserType == "Student").Select(u => u.Id).ToListAsync();
            if (!studentIds.Any()) return;

            var vids = new List<Video>();
            foreach (var sid in studentIds)
            {
                var count = faker.Random.Int(VideosPerStudentMin, VideosPerStudentMax);
                for (int i = 0; i < count; i++)
                {
                    vids.Add(new Video
                    {
                        VideoId = Guid.NewGuid().ToString(),
                        StudentId = sid,
                        VideoUrl = $"https://cdn.example.com/videos/{sid}/{Guid.NewGuid()}.mp4",
                        Title = faker.Lorem.Sentence(3),
                        Description = faker.Lorem.Sentences(2),
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await db.AddRangeAsync(vids);
        }

        private static async Task SeedRatings(ApplicationDbContext db, Faker faker)
        {
            if (await db.Set<Rating>().AnyAsync()) return;

            var videos = await db.Set<Video>().Select(v => v.VideoId).ToListAsync();
            var recruiters = await db.Users.Where(u => u.UserType == "Recruiter").Select(r => r.Id).ToListAsync();
            if (!videos.Any() || !recruiters.Any()) return;

            var ratings = new List<Rating>();
            for (int i = 0; i < RatingCount; i++)
            {
                ratings.Add(new Rating
                {
                    RatingId = Guid.NewGuid().ToString(),
                    VideoId = faker.PickRandom(videos),
                    RecruiterId = faker.PickRandom(recruiters),
                    Score = faker.Random.Int(1, 5),
                    RatingDate = DateTime.UtcNow
                });
            }

            await db.AddRangeAsync(ratings);
        }

        private static async Task SeedComments(ApplicationDbContext db, Faker faker)
        {
            if (await db.Set<Comment>().AnyAsync()) return;

            var videos = await db.Set<Video>().Select(v => v.VideoId).ToListAsync();
            var recruiters = await db.Users.Where(u => u.UserType == "Recruiter").Select(r => r.Id).ToListAsync();
            if (!videos.Any() || !recruiters.Any()) return;

            var comments = new List<Comment>();
            for (int i = 0; i < CommentCount; i++)
            {
                comments.Add(new Comment
                {
                    CommentId = Guid.NewGuid().ToString(),
                    VideoId = faker.PickRandom(videos),
                    RecruiterId = faker.PickRandom(recruiters),
                    Content = faker.Lorem.Sentence(),
                    CommentDate = DateTime.UtcNow
                });
            }

            await db.AddRangeAsync(comments);
        }

        private static async Task SeedOffers(ApplicationDbContext db, Faker faker)
        {
            if (await db.Offers.AnyAsync()) return;

            var students = await db.Users.Where(u => u.UserType == "Student").Select(s => s.Id).ToListAsync();
            var recruiters = await db.Users
                .Where(u => u.UserType == "Recruiter" && u.BandId != null)
                .Select(u => new { u.Id, u.BandId, BandName = u.Band!.Name })
                .ToListAsync();

            if (!students.Any() || !recruiters.Any()) return;

            var offers = new List<Offer>();
            for (int i = 0; i < OfferCount; i++)
            {
                var rec = faker.PickRandom(recruiters);
                offers.Add(new Offer
                {
                    OfferId = Guid.NewGuid().ToString(),
                    StudentId = faker.PickRandom(students),
                    RecruiterId = rec.Id,
                    BandId = rec.BandId!,
                    BandName = rec.BandName,
                    Amount = faker.Random.Int(1000, 10000),
                    Status = "Pending",
                    OfferDate = DateTime.UtcNow
                });
            }

            await db.Offers.AddRangeAsync(offers);
        }

        private static async Task EnsureRoleAsync(UserManager<ApplicationUser> um, ApplicationUser user, string role)
        {
            var roles = await um.GetRolesAsync(user);
            if (!roles.Contains(role))
                await um.AddToRoleAsync(user, role);
        }

        private static string GenerateRefreshToken()
        {
            var bytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        private static string GenerateHighSchoolName(Faker faker)
        {
            var formats = new List<Func<string>>
            {
                () => $"{faker.Address.City()} High School",
                () => $"{faker.Name.LastName()} High School",
                () => $"{faker.Name.FirstName()} Academy",
                () => $"{faker.Address.City()} Academy",
                () => $"Saint {faker.Name.FirstName()} High School",
                () => $"{faker.Name.LastName()} Institute"
            };
            return faker.PickRandom(formats)();
        }

        private class BandSeedModel
        {
            [JsonPropertyName("university")]
            public string SchoolName { get; set; } = "";
            [JsonPropertyName("band_name")]
            public string MarchingBand { get; set; } = "";
            [JsonPropertyName("city")]
            public string City { get; set; } = "";
            [JsonPropertyName("state")]
            public string State { get; set; } = "";
            [JsonPropertyName("division")]
            public string Division { get; set; } = "";
            [JsonPropertyName("conference")]
            public string Conference { get; set; } = "";
        }
    }
}
