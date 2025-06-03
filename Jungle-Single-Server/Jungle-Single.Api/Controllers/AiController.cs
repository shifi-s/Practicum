using Jungle_Single.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Jungle_Single.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly MoodAnalyzerService _moodAnalyzer;
        private readonly SongRecommendationService _recommendationService;
        private readonly TranscriptionService _transcriptionService;

        public AiController(TranscriptionService transcriptionService,MoodAnalyzerService moodAnalyzer,SongRecommendationService recommendationService)
        {
            _moodAnalyzer = moodAnalyzer;
            _recommendationService = recommendationService;
            _transcriptionService= transcriptionService;

        }
        // GET: api/<AiController>
        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeFromS3([FromBody] string audioUrl)
        {
            var text = await _transcriptionService.GetOrTranscribeAndStructureLyricsAsync(audioUrl);
            return Ok(text);
        }



        [HttpPost("ai-recommend")]
        public async Task<IActionResult> RecommendByText([FromBody] string text)
        {
            var mood = await _moodAnalyzer.GetMoodFromTextAsync(text); // שלב ה-AI
            var songs = await _recommendationService.GetSongsByMoodAsync(mood); // חיפוש שירים
            return Ok(new { mood, songs });
        }

        // PUT api/<AiController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AiController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
