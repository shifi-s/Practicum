using System.Net.Http.Headers;
using System.Text;
using Jungle_Single.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

public class TranscriptionService(HttpClient httpClient, IConfiguration config, AppDbContext context)
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly IConfiguration _config = config;
    private readonly AppDbContext _context = context;

    public async Task<string> GetOrTranscribeAndStructureLyricsAsync(string audioUrl)
    {
        var song = await _context.Songs.FirstOrDefaultAsync(s => s.AudioUrl == audioUrl) ?? throw new Exception("השיר לא נמצא במסד הנתונים");
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

""
{ rawText}
        
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

        var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
        var apiKey = _config["OpenAI:ApiKey"];

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
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
        {
            throw new ArgumentException("Invalid audio URL");
        }

        var audioStream = await _httpClient.GetStreamAsync(uri);
        using var memoryStream = new MemoryStream();
        await audioStream.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        using var requestContent = new MultipartFormDataContent();
        var fileContent = new StreamContent(memoryStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("audio/mpeg");
        requestContent.Add(fileContent, "file", "audio.mp3");
        requestContent.Add(new StringContent("whisper-1"), "model");

        using var whisperClient = new HttpClient();
        whisperClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _config["OpenAI:ApiKey"]);

        var response = await whisperClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", requestContent);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Whisper error: {response.StatusCode} - {responseString}");

        dynamic result = JsonConvert.DeserializeObject(responseString);
        return result.text;
    }
}
