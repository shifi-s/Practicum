using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

public class MoodAnalyzerService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public MoodAnalyzerService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<string> GetMoodFromTextAsync(string text)
    {
        var apiKey = _config["OpenAI:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            throw new Exception("API Key לא מוגדר בקובץ ההגדרות.");

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        var request = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "system", content = "'תחזיר לי שירים מתאימים מהמאגר שירים לפי מצב הרוח של המשתמש'" },
                new { role = "user", content = text }
            }
        };

        var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"OpenAI error: {response.StatusCode} - {responseString}");

        dynamic result = JsonConvert.DeserializeObject(responseString);
        var mood = result?.choices?[0]?.message?.content?.ToString()?.Trim();

        return string.IsNullOrEmpty(mood) ? "רגוע" : mood;
    }
}
