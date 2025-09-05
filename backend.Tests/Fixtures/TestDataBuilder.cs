using Models;
using server.DTOs;
using System;

namespace backend.Tests.Fixtures
{
    public static class TestDataBuilder
    {
        public static ApplicationUser CreateTestStudent(string id = null, string email = null)
        {
            return new ApplicationUser
            {
                Id = id ?? Guid.NewGuid().ToString(),
                Email = email ?? "student@test.com",
                UserType = "Student",
                FirstName = "Test",
                LastName = "Student",
                Phone = "123-456-7890",
                Instrument = "Trumpet",
                HighSchool = "Test High School",
                GraduationYear = 2025,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };
        }

        public static ApplicationUser CreateTestRecruiter(string id = null, string email = null, Guid? bandId = null)
        {
            return new ApplicationUser
            {
                Id = id ?? Guid.NewGuid().ToString(),
                Email = email ?? "recruiter@test.com",
                UserType = "Recruiter",
                FirstName = "Test",
                LastName = "Recruiter",
                Phone = "123-456-7890",
                BandId = bandId ?? Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };
        }

        public static Band CreateTestBand(Guid? id = null, string name = null)
        {
            return new Band
            {
                BandId = id ?? Guid.NewGuid(),
                Name = name ?? "Test Band",
                SchoolName = "Test University",
                City = "Test City",
                State = "TX",
                Division = "I",
                Conference = "Test Conference",
                CreatedAt = DateTime.UtcNow
            };
        }

        public static Video CreateTestVideo(string id = null, string studentId = null)
        {
            return new Video
            {
                VideoId = id ?? Guid.NewGuid().ToString(),
                StudentId = studentId ?? Guid.NewGuid().ToString(),
                Title = "Test Video",
                Description = "Test video description",
                VideoUrl = "https://test.com/video.mp4",
                CreatedAt = DateTime.UtcNow
            };
        }

        public static Offer CreateTestOffer(string id = null, string studentId = null, string recruiterId = null, Guid? bandId = null)
        {
            return new Offer
            {
                OfferId = id ?? Guid.NewGuid().ToString(),
                StudentId = studentId ?? Guid.NewGuid().ToString(),
                RecruiterId = recruiterId ?? Guid.NewGuid().ToString(),
                BandId = bandId ?? Guid.NewGuid(),
                BandName = "Test Band",
                Amount = 5000,
                Status = "Pending",
                OfferDate = DateTime.UtcNow
            };
        }

        public static Rating CreateTestRating(string id = null, string studentId = null, string recruiterId = null, string videoId = null)
        {
            return new Rating
            {
                RatingId = id ?? Guid.NewGuid().ToString(),
                StudentId = studentId ?? Guid.NewGuid().ToString(),
                RecruiterId = recruiterId ?? Guid.NewGuid().ToString(),
                VideoId = videoId,
                Score = 4,
                Comment = "Great performance!",
                RatingDate = DateTime.UtcNow
            };
        }

        public static Comment CreateTestComment(string id = null, string studentId = null, string recruiterId = null, string videoId = null)
        {
            return new Comment
            {
                CommentId = id ?? Guid.NewGuid().ToString(),
                StudentId = studentId ?? Guid.NewGuid().ToString(),
                RecruiterId = recruiterId ?? Guid.NewGuid().ToString(),
                VideoId = videoId ?? Guid.NewGuid().ToString(),
                Content = "Test comment content",
                CommentDate = DateTime.UtcNow
            };
        }

        public static Interest CreateTestInterest(string studentId = null, Guid? bandId = null)
        {
            return new Interest
            {
                StudentId = studentId ?? Guid.NewGuid().ToString(),
                BandId = bandId ?? Guid.NewGuid(),
                IsInterested = true,
                InterestDate = DateTime.UtcNow
            };
        }

        public static CreateUserDTO CreateValidStudentDto(string email = null)
        {
            return new CreateUserDTO
            {
                Email = email ?? "newstudent@test.com",
                Password = "Test123!",
                UserType = "Student",
                FirstName = "New",
                LastName = "Student",
                Phone = "123-456-7890",
                Instrument = "Trumpet",
                HighSchool = "Test High School",
                GraduationYear = 2025
            };
        }

        public static CreateUserDTO CreateValidRecruiterDto(string email = null, Guid? bandId = null)
        {
            return new CreateUserDTO
            {
                Email = email ?? "newrecruiter@test.com",
                Password = "Test123!",
                UserType = "Recruiter",
                FirstName = "New",
                LastName = "Recruiter",
                Phone = "123-456-7890",
                BandId = bandId ?? Guid.NewGuid()
            };
        }

        public static CreateBandDTO CreateValidBandDto(string name = null)
        {
            return new CreateBandDTO
            {
                Name = name ?? "New Test Band",
                SchoolName = "New Test University",
                City = "New Test City",
                State = "TX",
                Division = "I",
                Conference = "New Test Conference"
            };
        }
    }
}