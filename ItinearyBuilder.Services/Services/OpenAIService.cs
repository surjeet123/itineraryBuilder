using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ItinearyBuilder.Business.Services
{
    public class OpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private const string OpenAiUrl = "https://api.openai.com/v1/chat/completions";

        public OpenAIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenAI:ApiKey"] ?? throw new ArgumentNullException("API Key is missing.");
        }

        public async Task<string> GetResponseAsync(string userPrompt, string systemRole, string exampleJson, int maxTokens)
        {
            var requestBody = new
            {
                model = "gpt-4",
                messages = new[]
                {
                    new { role = "system", content = $"Act as an expert travel planner and trip advisor whogive best travel plan to customers based on their preferences." +
                                                     $" The response **must be a valid JSON**. Here is an example:\n\n```json\n{exampleJson}\n```" },
                    new { role = "user", content = userPrompt }
                },
                temperature = 0.7, // Reduces randomness, making responses more structured
                max_tokens = maxTokens
            };

            var jsonRequest = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

            var response = await _httpClient.PostAsync(OpenAiUrl, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"OpenAI API Error: {responseBody}");
            }

            var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);
            var aiContent = jsonResponse.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
            if (aiContent.StartsWith("```json"))
            {
                aiContent = aiContent.Replace("```json", "").Replace("```", "").Trim();
            }
            // Convert the response to the expected type (T)
            return aiContent ?? "";
        }
    }
}
