using Jungle_Single.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.Iservices
{
    public interface ISongService
    {
        Task<IEnumerable<Song>> GetAllSongsAsync();
        Task<Song?> GetSongByIdAsync(int id);
        Task<List<Song>> GetSongByTagAsync(string tagInput);
        Task AddSongAsync(Song song);
        Task UpdateSongAsync(Song song);
        Task DeleteSongAsync(int id);
    }
}
