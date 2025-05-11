using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;
using server.Data;
using server.Models;
using System.Diagnostics.Metrics;
using System.Security.Cryptography;

namespace server.Helpers
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, UserManager<User> userManager)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            // Define roles
            string[] roleNames = { "Admin", "Recruiter", "Student" };
            IdentityResult roleResult;

            // Create roles if they don't exist
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            await CreateStudents(userManager, 20, context);
            await CreateRecruiters(userManager, 20, context);
            await CreateOffers(context, 20);
          


        }

        private static async Task CreateStudents(UserManager<User> userManager, int numStudents, ApplicationDbContext context)
        {
            var faker = new Faker();
            var rndNum = new Random();
            var instruments = new string[]
                  {
                        "Trumpet",
                        "Trombone",
                        "Saxophone",
                        "Tuba",
                        "Clarinet",
                        "Percussion",
                        "Flute",
                        "Euphonium",
                        "Mellophone",
                        "Piccolo",
                        "Baritone"
                  };

            for (int i = 0; i < numStudents; i++)
            {
                var student = new Student
                {
                    UserName = faker.Internet.UserName($"StudentNum{i}"),
                    Email = faker.Internet.Email(),
                    FirstName = faker.Person.FirstName,
                    LastName = faker.Person.LastName,
                    PhoneNumber = faker.Phone.PhoneNumber(),
                    Instrument = faker.PickRandom(instruments),
                    HighSchool = GenerateHighSchoolName(faker),
                    GraduationYear = faker.Date.Future().Year,
                    CreatedAt = DateTime.UtcNow,
                    AverageRating = rndNum.Next(1, 5),
                    RefreshToken = GenerateRefreshToken(),
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
                };

                var result = await userManager.CreateAsync(student, "Password123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(student, "Student");
                    Console.WriteLine($"Created student: {student.UserName}");

                    var bandIds = await context.Bands.Select(b => b.BandId).ToListAsync();
                    var interestedBands = faker.PickRandom(bandIds, faker.Random.Int(1, 3));

                    foreach (var bandId in interestedBands)
                    {
                        context.Add(new Interest
                        {
                            StudentId = student.Id,
                            BandId = bandId,
                            InterestDate = DateTime.UtcNow,

                        });
                        Console.WriteLine($"Student {student.UserName} is interested in BandId: {bandId}");
                    }
                }
                else
                {
                    Console.WriteLine($"Failed to create student: {string.Join(", ", result.Errors)}");
                }
            }
        }

        private static async Task CreateRecruiters(UserManager<User> userManager, int numRecruiters, ApplicationDbContext context)
        {
            var faker = new Faker();
            var bandIds = await context.Bands.Select(b => b.BandId).ToListAsync();
            if (bandIds.Count == 0)
            {
                Console.WriteLine("No bands found in the database. Please seed bands before creating recruiters.");
                return;
            }

            for (int i = 0; i < numRecruiters; i++)
            {
                var randomBandId = faker.PickRandom(bandIds);

                var recruiter = new Recruiter
                {
                    UserName = faker.Internet.UserName($"recruiterNum{i}"),
                    Email = faker.Internet.Email(),
                    FirstName = faker.Person.FirstName,
                    LastName = faker.Person.LastName,
                    PhoneNumber = faker.Phone.PhoneNumber(),
                    BandId = randomBandId,
                    CreatedAt = DateTime.UtcNow,
                    RefreshToken = GenerateRefreshToken(),
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
                };

                var result = await userManager.CreateAsync(recruiter, "Password123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(recruiter, "Recruiter");
                    Console.WriteLine($"Created recruiter: {recruiter.UserName}, assigned to BandId: {recruiter.BandId}");
                }
                else
                {
                    Console.WriteLine($"Failed to create recruiter: {string.Join(", ", result.Errors)}");
                }
            }
        }

        private static async Task CreateOffers(ApplicationDbContext context, int numOffers)
        {
            var faker = new Faker();

            // Fetch all existing StudentId and RecruiterId from the database
            var studentIds = await context.Users.OfType<Student>().Select(s => s.Id).ToListAsync();
            var recruiters = await context.Users
                                           .OfType<Recruiter>()
                                           .Include(r => r.Band) // Assuming a Recruiter has a Band navigation property
                                           .Select(r => new
                                           {
                                               RecruiterId = r.Id,
                                               BandId = r.Band.BandId,
                                               BandName = r.Band.Name
                                           })
                                           .ToListAsync();

            if (!studentIds.Any() || !recruiters.Any())
            {
                Console.WriteLine("No students, recruiters, or bands available to create offers.");
                return;
            }

            for (int i = 0; i < numOffers; i++)
            {
                // Assign a random student, recruiter, and band to the offer
                var randomStudentId = faker.PickRandom(studentIds);
                var randomRecruiter = faker.PickRandom(recruiters);

                var offer = new Offer
                {
                    OfferId = Guid.NewGuid().ToString(),
                    StudentId = randomStudentId,
                    RecruiterId = randomRecruiter.RecruiterId,
                    BandId = randomRecruiter.BandId,  // Use the BandId associated with the recruiter
                    BandName = randomRecruiter.BandName, // Use the BandName associated with the recruiter
                    Amount = faker.Random.Int(1000, 10000), // Random scholarship amount
                    Status = "Pending",
                    OfferDate = DateTime.UtcNow
                };

                context.Offers.Add(offer);
                Console.WriteLine($"Created offer for student {randomStudentId} by recruiter {randomRecruiter.RecruiterId}, Band: {randomRecruiter.BandName}");
            }

            await context.SaveChangesAsync();
            Console.WriteLine("Finished creating offers.");
        }

        private static string GenerateHighSchoolName(Faker faker)
        {
            var formatOptions = new List<Func<string>>
            {
                () => $"{faker.Address.City()} High School",
                () => $"{faker.Name.LastName()} High School",
                () => $"{faker.Name.FirstName()} Academy",
                () => $"{faker.Address.City()} Academy",
                () => $"Saint {faker.Name.FirstName()} High School",
                () => $"{faker.Name.LastName()} Institute"
            };

            var randomFormat = faker.PickRandom(formatOptions);
            return randomFormat();
        }

        private static async Task CreateUserIfNotExists(UserManager<User> userManager, User user, string password, string role)
        {
            if (await userManager.FindByEmailAsync(user.Email) == null)
            {
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
