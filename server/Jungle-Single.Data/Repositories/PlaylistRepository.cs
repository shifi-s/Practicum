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



        public async Task<List<Song>> GetSongs(int playlistId)
        {
            return await _context.SongsPlalists
                .Where(ps => ps.PlaylistId == playlistId)
                .Include(ps => ps.Song)
                .Select(ps => ps.Song)
                .ToListAsync();
        }
        public async Task<bool> AddSongToPlaylistAsync(int playlistId, int songId)
        {
            var exists = await _context.SongsPlalists
                .AnyAsync(sp => sp.PlaylistId == playlistId && sp.SongId == songId);

            if (exists) return false;

            var playlistExists = await _context.Playlists.AnyAsync(p => p.Id == playlistId);
            var songExists = await _context.Songs.AnyAsync(s => s.Id == songId);

            if (!playlistExists || !songExists) return false;

            _context.SongsPlalists.Add(new SongsPlalists
            {
                PlaylistId = playlistId,
                SongId = songId
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task AddAsync(Playlist playlist)
        {
            Playlist p = new() { Name = playlist.Name, UserId = playlist.UserId };
            await _context.Playlists.AddAsync(p);
            await _context.SaveChangesAsync();
        }


        public async Task<Playlist?> GetByIdAsync(int id)
        {
            return await _context.Playlists
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }


        public async Task UpdateAsync(int id,string playlist)
        {
            var p = await _context.Playlists.FindAsync(id);
            if (p != null)
            {
                p.Name = playlist;
                await _context.SaveChangesAsync();
            }
        }
        public async Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId)
        {
            var relation = await _context.SongsPlalists
                .FirstOrDefaultAsync(sp => sp.PlaylistId == playlistId && sp.SongId == songId);

            if (relation == null) return false;

            _context.SongsPlalists.Remove(relation);
            await _context.SaveChangesAsync();
            return true;
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

        public async Task<IEnumerable<Playlist>> GetAllAsync(int userId)
        {
            var playlists = await _context.Playlists
                .Where(p => p.UserId == userId)
                .ToListAsync();

            return playlists;
        }
    }
}

