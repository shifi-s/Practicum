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
        Task<IEnumerable<Playlist>> GetAllPlaylistsAsync();
        Task<Playlist?> GetPlaylistByIdAsync(int id);
        Task AddPlaylistAsync(Playlist playlist);
        Task UpdatePlaylistAsync(Playlist playlist);
        Task DeletePlaylistAsync(int id);
    }

}
