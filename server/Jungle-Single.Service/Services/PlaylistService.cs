
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
        public async Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId)
        {
            return await _playlistRepository.RemoveSongFromPlaylistAsync(playlistId, songId);
        }
        public async Task AddPlaylistAsync(Playlist playlist)
        {
            await _playlistRepository.AddAsync(playlist);
        }

     
        public async Task DeletePlaylistAsync(int id)
        {
            await _playlistRepository.DeleteAsync(id);  
        }

        public async Task<IEnumerable<Playlist>> GetAllPlaylistsAsync(int userId)
        {
            return await _playlistRepository.GetAllAsync(userId);
        }

        public async Task<Playlist?> GetPlaylistByIdAsync(int id)
        {
            return await _playlistRepository.GetByIdAsync(id);
        }
        public async Task<bool> AddSongToPlaylistAsync(int playlistId, int songId)
        {
            return await _playlistRepository.AddSongToPlaylistAsync(playlistId, songId);
        }
        public async Task<IEnumerable<Song>> GetSongsAsync(int playListId)
        {
           return await _playlistRepository.GetSongs(playListId);
        }

        public async Task UpdatePlaylistAsync(int id,string playlist)
        {
            await _playlistRepository.UpdateAsync(id,playlist);
        }


    }

}
