
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
    public class PlaylistService : IPlaylistService
    {
        private readonly IPlaylistRepository _playlistRepository;

        public PlaylistService(IPlaylistRepository playlistRepository)
        {
            _playlistRepository = playlistRepository;
        }

        public async Task AddPlaylistAsync(Playlist playlist)
        {
            await _playlistRepository.AddAsync(playlist);
        }

        public async Task DeletePlaylistAsync(int id)
        {
            await _playlistRepository.DeleteAsync(id);  
        }

        public async Task<IEnumerable<Playlist>> GetAllPlaylistsAsync()
        {
            return await _playlistRepository.GetAllAsync();
        }

        public async Task<Playlist?> GetPlaylistByIdAsync(int id)
        {
            return await _playlistRepository.GetByIdAsync(id);
        }

        public async Task UpdatePlaylistAsync(Playlist playlist)
        {
            await _playlistRepository.UpdateAsync(playlist);
        }
    }

}
