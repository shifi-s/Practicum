using Jungle_Single.Service.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Jungle_Single.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly MoodAnalyzerService _moodAnalyzer;
        private readonly SongRecommendationService _recommendationService;
        private readonly TranscriptionService _transcriptionService;

        public AiController(
            TranscriptionService transcriptionService,
            MoodAnalyzerService moodAnalyzer,
            SongRecommendationService recommendationService)
        {
            _transcriptionService = transcriptionService;
            _moodAnalyzer = moodAnalyzer;
            _recommendationService = recommendationService;
        }

        // POST: api/Ai/transcribe
        [HttpPost("transcribe")]
        public async Task<IActionResult> Transcribe([FromBody] TranscriptionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.AudioUrl))
                return BadRequest("audioUrl is required");

            var text = await _transcriptionService.GetOrTranscribeAndStructureLyricsAsync(request.AudioUrl);
            return Ok(text);
        }

        // POST: api/Ai/ai-recommend
        [HttpPost("ai-recommend")]
        public async Task<IActionResult> Recommend([FromBody] RecommendRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("text is required");

            var mood = await _moodAnalyzer.GetMoodFromTextAsync(request.Text);
            var songs = await _recommendationService.GetSongsByMoodAsync(mood);
            return Ok(new { mood, songs });
        }
    }

    // בקשות קלט
    public class TranscriptionRequest
    {
        public string AudioUrl { get; set; }
    }

    public class RecommendRequest
    {
        public string Text { get; set; }
    }
}
