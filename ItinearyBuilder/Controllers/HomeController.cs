using System.Diagnostics;
using ItinearyBuilder.Business.Models;
using ItinearyBuilder.Business.Services;
using ItinearyBuilder.Models;
using Microsoft.AspNetCore.Mvc;

namespace ItinearyBuilder.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly OpenAIService _openAIService;
        public HomeController(OpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetImportantInformation(TravellerInputModel Model)
        {
            var prompt = $"The user is planning a trip to {Model.Destination} and is considering different duration options: 2-3 days, 5-6 days, or 10-11 days. " +
                          $"Based on expert travel recommendations, suggest the **most suitable trip duration** based on common travel patterns and experiences for {Model.Destination}. " +
                          $"The recommendation should be dynamic and not always default to 5-6 days. Consider:\n" +
                          $"- Whether {Model.Destination} is best experienced as a short, medium, or long trip.\n" +
                          $"- Attractions, sightseeing spots, and activities that require more or less time.\n" +
                          $"- The travel distance and effort required to reach {Model.Destination}.\n\n" +
                          $"Respond **strictly** in JSON format with the following structure:\n\n" +
                          @"{
                             ""message"": ""Based on travel insights, the ideal duration for visiting Destination is X-Y days. This allows travelers to fully explore key attractions without feeling rushed.""
                           }";

            var systemRole = "Please act as an expert travel planner and trip advisor. ONLY return raw JSON output, without any formatting, explanations, or markdown code blocks.";

            var exampleJson = @"{
                                    ""message"": ""Based on travel insights, the ideal duration for visiting Destination is X-Y days. This allows travelers to fully explore key attractions without feeling rushed.""
                                }";

            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson, 200);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetDestinationOverview(TravellerInputModel Model)
        {
            var prompt = $"The user is planning a trip to {Model.Destination}, departing from {Model.BoardingFrom}. " +
              $"They will be traveling {Model.TravellingWith}. " +
              $"Provide a detailed overview of {Model.Destination} in about 150 words, highlighting its key attractions, culture, and travel experience. " +
              $"Additionally, include tourist statistics, focusing on travel trends from {Model.BoardingFrom}." +
              $"Provide insights into the best months to visit, the shoulder season, and any months that should be avoided for a more budget-friendly trip. ";
            var systemRole = "Please Act as an expert travel planer and trip advisor. ONLY respond with raw JSON output, without any formatting, explanations, or Markdown code blocks.";

            var exampleJson = @"{
                                    ""destination"": ""Paris"",
                                    ""country"": ""France"",
                                    ""description"": ""Paris is known as the 'City of Love' with landmarks like the Eiffel Tower."",
                                    ""annualvisitors"": ""please specifiy trends with respective to boarding from country in texttual format"",
                                    ""besttimetovisit"": [""Jan"", ""Feb"", ""Sep"",""Oct""],
                                    ""shoulderseason"": [""Mar""]
                                    ""monthstoavoid"": [""Mar""]
                                }";

            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson, 500);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetHowToReachSection(TravellerInputModel Model)
        {
            var prompt = $"The user is planning a trip to {Model.Destination}, departing from {Model.BoardingFrom}. " +
               $"They will be traveling {Model.TravellingWith}. " +
               $"Provide a detailed **'How to Reach'** guide for traveling from {Model.BoardingFrom} to {Model.Destination}. " +
               $"Include the following details in structured JSON format:\n\n" +

               $"1️⃣ **Train Route**:\n" +
               $"- If a train route is available, suggest the **nearest railway station** to {Model.Destination}.\n\n" +

               $"2️⃣ **Train + Taxi/Bus Combination**:\n" +
               $"- If reaching {Model.Destination} requires both a **train and taxi/bus**, suggest:\n" +
               $"  - The **nearest railway station** to {Model.Destination}.\n" +
               $"  - The **estimated travel time** from the railway station to {Model.Destination} via taxi/bus.\n\n" +

               $"3️⃣ **Flight Options**:\n" +
               $"- If flights are available, list both **direct and connecting flights**.\n" +
               $"- Mention the **recommended option** considering **budget & convenience**.\n\n" +
               $"Key Considerations:\n" +
               $"- If multiple options exist, prioritize **fastest and most budget-friendly routes**.\n" +
               $"- Use **realistic estimates** for train and flight times.\n" +
               $"- Avoid assuming transport availability unless confirmed.\n" +
               $"- **Only return JSON output** without any explanations or extra text.";

            var systemRole = "Please Act as an expert travel planner and trip advisor. ONLY respond with raw JSON output, without any formatting, explanations, or Markdown code blocks.";

            var exampleJson = @"{
                                    ""destination"": ""Almaty"",
                                    ""boardingFrom"": ""Delhi"",
                                    ""travelModes"": {
                                        ""train"": {
                                            ""available"": false,
                                            ""nearestRailwayStation"": ""N/A""
                                        },
                                        ""trainTaxiBus"": {
                                            ""available"": true,
                                            ""nearestRailwayStation"": ""Shymkent Railway Station"",
                                            ""travelTimeByTaxiOrBus"": ""3 hours""
                                        },
                                        ""flight"": {
                                            ""directFlights"": [
                                                {
                                                    ""from"": ""Indira Gandhi International Airport (DEL)"",
                                                    ""to"": ""Almaty International Airport (ALA)"",
                                                    ""airline"": ""Air Astana"",
                                                    ""duration"": ""4 hours""
                                                }
                                            ],
                                            ""connectingFlights"": [
                                                {
                                                    ""from"": ""Indira Gandhi International Airport (DEL)"",
                                                    ""layover"": ""Istanbul (IST)"",
                                                    ""to"": ""Almaty International Airport (ALA)"",
                                                    ""airline"": ""Turkish Airlines"",
                                                    ""duration"": ""10 hours (including layover)""
                                                }
                                            ]
                                        },
                                        ""recommendedOption"": {
                                            ""method"": ""Direct Flight"",
                                            ""reason"": ""Most convenient & fastest way with reasonable cost""
                                        }
                                    }
                                }";

            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson, 2000);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetHotelRecommendations(TravellerInputModel Model)
        {
            var prompt = $"The user is planning a trip to {Model.Destination}, departing from {Model.BoardingFrom}. " +
                        $"They will be traveling {Model.TravellingWith}. Your task is to provide strategic hotel booking **location recommendations** based on the following rules:\n\n" +

                        $"1️⃣ **No Specific Hotel Suggestions:** Do **not** recommend specific hotels. Only suggest **general locations** suitable for staying.\n\n" +

                        $"2️⃣ **Proximity to Attractions:** Recommend locations that are **centrally located** near the majority of the key attractions to minimize travel time.\n\n" +

                        $"3️⃣ **Smart Itinerary Planning:** If the traveler is visiting two main attractions (e.g., A and B), and they plan to stay at location C:\n" +
                        $"- If traveling from A → B takes **less time** than A → C, then suggest visiting **B first** before heading to C the next day.\n" +
                        $"- If this is **not feasible**, then suggest staying near **A and B** instead, ensuring that they can cover other nearby attractions efficiently.\n\n" +

                        $"4️⃣ **Minimizing Hotel Changes:** The recommendation should **minimize** the number of different hotel locations to avoid the hassle of packing and moving luggage frequently.\n\n" +

                        $"Respond **strictly** in JSON format with the following structured output:\n\n";

            var systemRole = "Please act as an expert travel planner and trip advisor. ONLY return raw JSON output, without any formatting, explanations, or markdown code blocks.";
            var exampleJson = @"{
                            ""recommended_locations"": [
                                {
                                    ""location"": ""Name of the recommended area"",
                                    ""reason"": ""Why this location is ideal, including its proximity to attractions and convenience for itinerary planning."",
                                    ""transportation_advantage"": ""Briefly explain why this location helps reduce travel time.""
                                }
                            ]
                        }";

            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson, 500);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> DayWiseItiniary(TravellerInputModel Model)
        {
            var prompt = $"The user is planning a trip to {Model.Destination}, departing from {Model.BoardingFrom}. " +
                         $"Provide a **day-wise itinerary** with attraction details, ensuring the following rules are followed:\n\n" +

                         $"1️⃣ **Distribute attractions evenly across the days based on {Model.TravelDuration}**:\n" +

                         $"2️⃣ **Show all Attractions with Key Information:** Each attraction must include:\n" +
                         $"   - Name of the attraction\n" +
                         $"   - Average visitor rating\n" +
                         $"   - Image URL of the attraction\n" +
                         $"   - Include out-of-city scenic attractions** \n" +
                         $"   - Distribute them into the itinerary days if feasible, or suggest a separate day trip if needed.\n\n" +

                         $"3️⃣ **Categorization:** Mark attractions as **Must Visit** or **Optional** based on their popularity and uniqueness.\n\n" +

                         $"6️⃣ **Strict JSON Output Format:** Ensure the response strictly adheres to the following structure:\n\n";

            var systemRole = "Please act as an expert travel planner and trip advisor. ONLY return raw JSON output, without any formatting, explanations, or markdown code blocks.";

            var exampleJson = @"{
                 ""day_wise_itinerary"": [
                     {
                         ""day"": 1,
                         ""activities"": [
                             {
                                 ""attraction_name"": ""Eiffel Tower"",
                                 ""rating"": 4.8,
                                 ""visit_type"": ""Must Visit""
                             }
                         ]
                        ]
                     }
                 ],
                
             }";
            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson, 3000);
            var refinePrompt = "Refine the following JSON itinerary to improve clarity, add any missing details, add missing important attractions, " +
                                "add out-of-the city famous attractions," +
                                "and ensure each day has well-balanced attractions.make sure that same daye attractions should't be too far. " +
                                "Maintain the same JSON structure, but enhance descriptions if needed. Here is the JSON:\n\n" + response;

            var refinedResponse = await _openAIService.GetPerplexResponseAsync(refinePrompt, systemRole, exampleJson, 6000,true);

            var finalPrompt = "now based on these below attractions response, can you now combine them to create a final itineary to the "+Model.Destination+"" +
                    "and ensure each day has well-balanced attractions.make sure that same daye attractions should't be too far. " +
                    "Maintain the same JSON structure, but enhance descriptions if needed. Here is the JSON:\n\n" + refinedResponse;
            var finalResponse = await _openAIService.GetPerplexResponseAsync(finalPrompt, systemRole, exampleJson, 6000, true);
            return Ok(refinedResponse);
        }
    }
}
