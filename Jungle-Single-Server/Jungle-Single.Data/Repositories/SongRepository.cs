using Jungle_Single.Core.IRepositories;
using Jungle_Single.Core.Iservices;
using Jungle_Single.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Data.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly AppDbContext _context;

        public SongRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Song> GetByIdAsync(int id)
        {
            return await _context.Songs.FindAsync(id);
        }

     
       public async Task<List<Song>> GetByTagAsync(string tagInput)
      {
                if (string.IsNullOrWhiteSpace(tagInput))
                    return new List<Song>();

                // פיצול התגיות שהמשתמש הכניס לפי רווחים
                var searchTags = tagInput.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                var songs = await _context.Songs
                    .Where(s => searchTags.All(t => s.Tags.Contains(t)))
                    .ToListAsync();

                return songs;
       }
        


        public async Task<IEnumerable<Song>> GetAllAsync()
        {
            return await _context.Songs.ToListAsync();
        }

        public async Task AddAsync(Song song)
        {
            await _context.Songs.AddAsync(song);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Song song)
        {
            _context.Songs.Update(song);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var song = await _context.Songs.FindAsync(id);
            if (song != null)
            {
                _context.Songs.Remove(song);
                await _context.SaveChangesAsync();
            }
        }
    }


}
