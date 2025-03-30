using Jungle_Single.Core.Iservices;
using Jungle_Single.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Jungle_Single.Api.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PlaylistsController(IPlaylistService playlistService) : ControllerBase
    {
        private readonly IPlaylistService _playlistService = playlistService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetAllPlaylists()
        {
            var playlists = await _playlistService.GetAllPlaylistsAsync();
            return Ok(playlists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Playlist>> GetPlaylistById(int id)
        {
            var playlist = await _playlistService.GetPlaylistByIdAsync(id);
            if (playlist == null)
            {
                return NotFound();
            }
            return Ok(playlist);
        }

        [HttpPost]
        public async Task<ActionResult> AddPlaylist(Playlist playlist)
        {
            await _playlistService.AddPlaylistAsync(playlist);
            return CreatedAtAction(nameof(GetPlaylistById), new { id = playlist.Id }, playlist);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePlaylist(int id, Playlist playlist)
        {
            if (id != playlist.Id)
            {
                return BadRequest();
            }

            await _playlistService.UpdatePlaylistAsync(playlist);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePlaylist(int id)
        {
            await _playlistService.DeletePlaylistAsync(id);
            return NoContent();
        }
    }


}

