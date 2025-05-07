using BandRecruiting.Application.DTOs;
using BandRecruiting.Core.Interfaces;
using BandRecruitingApp.Application.Services;

namespace BandRecruiting.Application.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IRecruiterRepository _repo;

        public RecruiterService(IRecruiterRepository repo)
        {
            _repo = repo;
        }

        public void CreateRecruiter(string userId, CreateRecruiterDTO dto)
        {
            var recruiter = new Recruiter
            {
                UserId = userId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                BandId = dto.BandId
            };

            _repo.Add(recruiter);
        }

        public Recruiter? GetByUserId(string userId)
        {
            return _repo.GetByUserId(userId);
        }

        public Recruiter? GetById(Guid id)
        {
            return _repo.GetById(id);
        }

        public IEnumerable<Recruiter> GetAll()
        {
            return _repo.GetAll();
        }

        public bool UpdateRecruiter(string userId, UpdateRecruiterDTO dto)
        {
            var recruiter = _repo.GetByUserId(userId);
            if (recruiter == null) return false;

            recruiter.User.FirstName = dto.FirstName;
            recruiter.User.LastName = dto.LastName;
            recruiter.User.Email = dto.Email;
            recruiter.User.Phone = dto.Phone;
            recruiter.BandId = dto.BandId;

            _repo.Update(recruiter);
            return true;
        }

        public bool DeleteByUserId(string userId)
        {
            var recruiter = _repo.GetByUserId(userId);
            if (recruiter == null) return false;

            _repo.Delete(recruiter.User.Recruiter.RecruiterId);
            return true;
        }

        public async Task<RecruiterProfileDTO?> GetRecruiterProfileAsync(string userId)
        {
            var recruiter = _repo.GetByUserId(userId);
            if (recruiter == null) return null;

            return new RecruiterProfileDTO
            {
                FirstName = recruiter.User.FirstName,
                LastName = recruiter.User.LastName,
                Email = recruiter.User.Email,
                Phone = recruiter.User.Phone,
                BandId = recruiter.BandId
            };
        }

        public RecruiterProfileDTO? GetRecruiterProfile(string userId)
        {
            var recruiter = _repo.GetByUserId(userId);
            if (recruiter == null || recruiter.User == null) return null;

            return new RecruiterProfileDTO
            {
                FirstName = recruiter.User.FirstName,
                LastName = recruiter.User.LastName,
                Email = recruiter.User.Email,
                Phone = recruiter.User.Phone,
                BandId = recruiter.BandId
            };
        }

        public IEnumerable<RecruiterProfileDTO> GetRecruitersByBand(Guid bandId)
        {
            var recruiters = _repo.GetByBandId(bandId);
            return recruiters.Select(r => new RecruiterProfileDTO
            {
                FirstName = r.User?.FirstName,
                LastName = r.User?.LastName,
                Email = r.User?.Email,
                Phone = r.User?.Phone,
                BandId = r.BandId
            }).Where(r => r.FirstName != null); // optional filtering for nulls
        }

        public IEnumerable<RecruiterProfileDTO> GetByBandId(Guid bandId)
        {
            var recruiters = _repo.GetByBandId(bandId);
            return recruiters.Select(r => new RecruiterProfileDTO
            {
                FirstName = r.User?.FirstName,
                LastName = r.User?.LastName,
                Email = r.User?.Email,
                Phone = r.User?.Phone,
                BandId = r.BandId
            }).Where(r => r.FirstName != null);
        }

    }
}
