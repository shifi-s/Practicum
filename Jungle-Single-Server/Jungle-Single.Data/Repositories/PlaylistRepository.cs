using Jungle_Single.Core.IRepositories;
using Jungle_Single.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jungle_Single.Data.Repositories
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly AppDbContext _context;

        public PlaylistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Playlist> GetByIdAsync(int id)
        {
            return await _context.Playlists.FindAsync(id);
        }

        public async Task<IEnumerable<Playlist>> GetAllAsync()
        {
            return await _context.Playlists.ToListAsync();
        }

        public async Task AddAsync(Playlist playlist)
        {
            await _context.Playlists.AddAsync(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Playlist playlist)
        {
            _context.Playlists.Update(playlist);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist != null)
            {
                _context.Playlists.Remove(playlist);
                await _context.SaveChangesAsync();
            }
        }
    }
}

