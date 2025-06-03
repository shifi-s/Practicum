using Jungle_Single.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Iservices
{
    public interface IPlaylistService

    {
        Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId);

        Task<bool> AddSongToPlaylistAsync(int playlistId, int songId);

        Task<IEnumerable<Playlist>> GetAllPlaylistsAsync(int userId);
        Task<Playlist?> GetPlaylistByIdAsync(int id);
  
        Task<IEnumerable<Song>>GetSongsAsync(int playListId);
        Task AddPlaylistAsync(Playlist playlist);
        Task UpdatePlaylistAsync(int id, string playlist);
        Task DeletePlaylistAsync(int id);
    }

}
