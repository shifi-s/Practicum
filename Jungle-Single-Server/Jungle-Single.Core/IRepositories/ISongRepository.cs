using Jungle_Single.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Core.IRepositories
{
    public interface ISongRepository
    {
        Task<Song> GetByIdAsync(int id);
        Task<List<Song>> GetByTagAsync(string tagInput);
        Task<IEnumerable<Song>> GetAllAsync();
        Task AddAsync(Song song);
        Task UpdateAsync(Song song);
        Task DeleteAsync(int id);
    }
}
