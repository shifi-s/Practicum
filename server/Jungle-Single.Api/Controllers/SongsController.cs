using Jungle_Single.Core.DTOsModels;
using Jungle_Single.Core.Iservices;
using Jungle_Single.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Jungle_Single.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController(ISongService songService) : ControllerBase
    {
        private readonly ISongService _songService = songService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Song>>> GetAllSongs()
        {
            var songs = await _songService.GetAllSongsAsync();
            return Ok(songs);
        }

        [HttpGet("search")]
        public async Task<IActionResult> getSongByTag(
    [FromQuery] string? tag
    )
        {
           var songs=await _songService.GetSongByTagAsync(tag); 
            if(songs == null)   
                return NotFound();  
            return Ok(songs);
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Song>> GetSongById(int id)
        {
            var song = await _songService.GetSongByIdAsync(id);
            if (song == null)
            {
                return NotFound();
            }
            return Ok(song);
        }

     //   [Authorize]
      //  [HttpPost("upload")]
     //   public async Task<IActionResult> UploadSong([FromForm] SongDto songDto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    if (songDto.File == null || songDto.File.Length == 0)
        //        return BadRequest("No file uploaded.");

        //    // 🔹 שמירת הקובץ בשרת
        //    var uploadsFolder = Path.Combine("wwwroot", "uploads", "songs");
        //    Directory.CreateDirectory(uploadsFolder); // ליצור את התיקייה אם לא קיימת

        //    var uniqueFileName = $"{Guid.NewGuid()}_{songDto.File.FileName}";
        //    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await songDto.File.CopyToAsync(stream);
        //    }

        //    // 🔹 שמירת פרטי השיר במסד הנתונים
        //    var song = new Song
        //    {
        //        Title = songDto.Title,
        //        Artist = songDto.Artist,
        //        Genre = songDto.Genre,
        //        AudioUrl = $"/uploads/songs/{uniqueFileName}", // כתובת  לשיר
        //        Tags = songDto.Title + ',' + songDto.Artist +","+ songDto.Genre
        //    };

        //    try
        //    {
        //        await _songService.AddSongAsync(song);
        //    }
        //    catch (DbUpdateException ex)
        //    {
        //        return StatusCode(500, $"Error saving song to database: {ex.Message} - {ex.InnerException?.Message}");
        //    }


        //    return Ok(new { message = "Song uploaded successfully", song });
        //}
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddSong(SongDto songDto)
        {
            Console.WriteLine(songDto.CoverUrl);
            var song = new Song
            {
                CoverUrl=songDto.CoverUrl,
                Title = songDto.Title,
                Artist = songDto.Artist,
                Genre = songDto.Genre,
                AudioUrl = songDto.AudioUrl, // כתובת  לשיר
                Tags = songDto.Title + ',' + songDto.Artist + "," + songDto.Genre,
                UploadDate = DateTime.Now
            };

            await _songService.AddSongAsync(song);
            return Ok(new {message = "song added",song});
        }

        [HttpPut("{id}")]
        [Authorize]

        public async Task<ActionResult> UpdateSong(int id, Song song)
        {
            if (id != song.Id)
            {
                return BadRequest();
            }

            await _songService.UpdateSongAsync(song);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteSong(int id)
        {
            await _songService.DeleteSongAsync(id);
            return NoContent();
        }
    }

}
