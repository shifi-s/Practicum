using Jungle_Single.Core.IRepositories;
using Jungle_Single.Core.Iservices;
using Jungle_Single.Core.Models;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Service.Services
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;

        public SongService(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }

        public async Task<IEnumerable<Song>> GetAllSongsAsync()
        {
            return await _songRepository.GetAllAsync();
        }

        public async Task<Song?> GetSongByIdAsync(int id)
        {
            return await _songRepository.GetByIdAsync(id);
        }

        public async Task AddSongAsync(Song song)
        {
            await _songRepository.AddAsync(song);
            
        }

        public async Task UpdateSongAsync(Song song)
        {
           await _songRepository.UpdateAsync(song);
          
        }

        public async Task DeleteSongAsync(int id)
        {
            await _songRepository.DeleteAsync(id);
        }

        public async Task<List<Song>> GetSongByTagAsync(string tagInput)
        {
            return await _songRepository.GetByTagAsync(tagInput);
        }
    }

}
