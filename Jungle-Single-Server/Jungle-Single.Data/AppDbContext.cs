using Microsoft.EntityFrameworkCore;
using Jungle_Single.Core.Models;
namespace Jungle_Single.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<SongsPlalists> SongsPlalists { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SongsPlalists>()
        .HasKey(ps => new { ps.PlaylistId, ps.SongId });

            modelBuilder.Entity<SongsPlalists>()
                .HasOne(ps => ps.Playlist)
                .WithMany(p => p.PlaylistSongs)
                .HasForeignKey(ps => ps.PlaylistId);

            modelBuilder.Entity<SongsPlalists>()
                .HasOne(ps => ps.Song)
                .WithMany(s => s.PlaylistSongs)
                .HasForeignKey(ps => ps.SongId);
            //        // קשר בין שיר לז'אנר
            //        modelBuilder.Entity<Song>()
            //            .HasOne(s => s.Genre)
            //            .WithMany(g => g.Songs)
            //            .HasForeignKey(s => s.GenreId);

            //        // קשר בין פלייליסט למשתמש
            //        modelBuilder.Entity<Playlist>()
            //            .HasOne(p => p.User)
            //            .WithMany(u => u.Playlists)
            //            .HasForeignKey(p => p.UserId);

            //        // קשר בין פלייליסט לשירים (טבלת ביניים)
            //        modelBuilder.Entity<Playlist>()
            //            .HasMany(p => p.Songs)
            //            .WithMany();

            //        // קשר בין דירוגים למשתמשים ושירים
            //        modelBuilder.Entity<Rating>()
            //            .HasOne(r => r.User)
            //            .WithMany()
            //            .HasForeignKey(r => r.UserId);

            //        modelBuilder.Entity<Rating>()
            //            .HasOne(r => r.Song)
            //            .WithMany(s => s.Ratings)
            //            .HasForeignKey(r => r.SongId);
        }

        }
}
