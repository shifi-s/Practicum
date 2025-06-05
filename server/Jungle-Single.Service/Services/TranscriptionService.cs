using Jungle_Single.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

public class TranscriptionService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;

    public TranscriptionService(HttpClient httpClient, IConfiguration config, AppDbContext context)
    {
        _httpClient = httpClient;
        _config = config;
        _context = context;
    }

    public async Task<string> GetOrTranscribeAndStructureLyricsAsync(string audioUrl)
    {
        var song = await _context.Songs.FirstOrDefaultAsync(s => s.AudioUrl == audioUrl)
                   ?? throw new Exception("השיר לא נמצא במסד הנתונים");

        if (!string.IsNullOrWhiteSpace(song.Lyrics))
            return song.Lyrics;

        var rawLyrics = await TranscribeFromUrlAsync(audioUrl);
        var structuredLyrics = await FormatLyricsWithAIAsync(rawLyrics);

        song.Lyrics = structuredLyrics;
        await _context.SaveChangesAsync();

        return structuredLyrics;
    }

    public async Task<string> FormatLyricsWithAIAsync(string rawText)
    {
        var prompt = $@"
הטקסט הבא הוא תמלול של שיר. סדר אותו לפי קטעים ברורים של השיר – בתים ופזמונים.
אל תוסיף הסברים.

""{rawText}""
";

        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "system", content = "אתה עוזר שמתמחה במבנה שירים." },
                new { role = "user", content = prompt }
            }
        };

        var apiKey = _config["OpenAI:ApiKey"];
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"GPT error: {response.StatusCode} - {json}");

        dynamic result = JsonConvert.DeserializeObject(json);
        return result.choices[0].message.content.ToString();
    }

    public async Task<string> TranscribeFromUrlAsync(string audioUrl)
    {
        if (!Uri.TryCreate(audioUrl, UriKind.Absolute, out var uri) ||
            (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            throw new ArgumentException("Invalid audio URL");

        var audioStream = await _httpClient.GetStreamAsync(uri);
        using var memoryStream = new MemoryStream();
        await audioStream.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        var fileContent = new StreamContent(memoryStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("audio/mpeg");

        var requestContent = new MultipartFormDataContent
        {
            { fileContent, "file", "audio.mp3" },
            { new StringContent("whisper-1"), "model" }
        };

        var apiKey = _config["OpenAI:ApiKey"];
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var response = await _httpClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", requestContent);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Whisper error: {response.StatusCode} - {responseString}");

        dynamic result = JsonConvert.DeserializeObject(responseString);
        return result.text;
    }
}
