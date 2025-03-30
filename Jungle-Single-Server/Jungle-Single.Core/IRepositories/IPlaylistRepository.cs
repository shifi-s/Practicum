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
        Task<Playlist> GetByIdAsync(int id);
        Task<IEnumerable<Playlist>> GetAllAsync();
        Task AddAsync(Playlist playlist);
        Task UpdateAsync(Playlist playlist);
        Task DeleteAsync(int id);
    }
}
