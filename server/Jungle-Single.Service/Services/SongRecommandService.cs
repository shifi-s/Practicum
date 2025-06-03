using Jungle_Single.Core.DTOsModels;
using Jungle_Single.Core.IRepositories;
using Jungle_Single.Core.Models;
using NPoco.Expressions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Service.Services
{
    public class SongRecommendationService
    {
        private readonly ISongRepository _repo;

        public SongRecommendationService(ISongRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Song>> GetSongsByMoodAsync(string mood)
        {
            var allSongs = await _repo.GetAllAsync();

            return allSongs
                .Where(s =>
                    s.Tags.Split(',').Any(t => t.Contains(mood, StringComparison.OrdinalIgnoreCase))
                )
                .ToList();
        }
    }

}
