using Jungle_Single.Core.Iservices;
using Jungle_Single.Core.Models;
using Jungle_Single.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Jungle_Single.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistsController : ControllerBase
    {
        private readonly IPlaylistService _service;
        private readonly ISongService _songService;
        public PlaylistsController(IPlaylistService service, ISongService songService) { _service = service; _songService=songService;}

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylistsByUser([FromQuery] int userId)
        {
            var playlists = await _service.GetAllPlaylistsAsync(userId);
            return Ok(playlists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Playlist>> Get(int id)
        {
            var playlist = await _service.GetPlaylistByIdAsync(id);
            if (playlist == null) return NotFound();
            return Ok(playlist);
        }
        [HttpPost("{playlistId}/addSong")]
        public async Task<IActionResult> AddSongToPlaylist(int playlistId ,[FromBody]  int songId)
        {
            var success = await _service.AddSongToPlaylistAsync(playlistId,songId);

            if (!success)
                return NotFound("Playlist or Song not found, or song already in playlist");

            return Ok("Song added to playlist");
        }

        [HttpPut("{playlistId}")]
        public async Task<ActionResult> UpdatePlaylistName(int playlistId, [FromBody]string name)
        {
           await _service.UpdatePlaylistAsync(playlistId,name);
            return Ok("playlist renamed succesfuly");
        }
        [HttpGet("{playlistId}/songs")]
        public async Task<IActionResult> GetSongs(int playlistId)
        {
            var songs = await _service.GetSongsAsync(playlistId);
            if (songs == null )
                return NotFound("No songs found in this playlist.");

            return Ok(songs);
        }
        [HttpDelete("{playlistId}/removeSong/{songId}")]
        public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var success = await _service.RemoveSongFromPlaylistAsync(playlistId, songId);
            if (!success)
                return NotFound("Playlist or song not found");

            return Ok("Song removed from playlist");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            await _service.DeletePlaylistAsync(id); return Ok("playlist deleted succesfuly");
        }
      
        //public async Task<IActionResult> AddSongToPlaylist(int playlistId, [FromBody] int songId)
        //{
        //    var song=await _songService.GetSongByIdAsync(songId);  
        //    if (song == null) return NotFound();
        //    var success = await _service.AddSongToPlaylistAsync(playlistId, song);
        //    if (!success)
        //        return NotFound("Playlist not found");

        //    return Ok("Song added to playlist");
        //}

        [HttpPost]
        public async Task<ActionResult<Playlist>> Create([FromBody] Playlist playlist)
        {
            await _service.AddPlaylistAsync(playlist);
            return CreatedAtAction(nameof(Get), new { id = playlist.Id }, playlist);
        }

    }
}

