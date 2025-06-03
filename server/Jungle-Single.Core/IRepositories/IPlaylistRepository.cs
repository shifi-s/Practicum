using Jungle_Single.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.IRepositories
{
    public interface IPlaylistRepository
    {
         Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId);
        Task<Playlist?> GetByIdAsync(int id);
        Task<bool> AddSongToPlaylistAsync(int playlistId, int songId);
        Task SaveAsync();
        Task<IEnumerable<Playlist>> GetAllAsync(int userId);
        Task<List<Song>> GetSongs(int playlistId);

        Task AddAsync(Playlist playlist);
        Task UpdateAsync(int id,string  playlist);
        Task DeleteAsync(int id);
        
    }
}
