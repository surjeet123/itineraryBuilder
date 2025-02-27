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
            var prompt = $"The user is planning a trip to {Model.Destination} and is considering a duration of either 2-3 days or 10-11 days. " +
                  $"However, the ideal travel duration is 5-6 days. " +
                  $"Provide an important message informing the user that the recommended stay is 5-6 days for the best experience.";
            var systemRole = "Please Act as an expert travel planer and trip advisor. ONLY respond with raw JSON output";

            var exampleJson = @"{
                                    ""message"": ""Ideal duration to travel to Destination is 5-6 days""
                                }";

            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson,200);
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

            var response = await _openAIService.GetResponseAsync(prompt, systemRole, exampleJson,500);
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
               $"- Mention the **recommended option** considering **budget & convenience**.\n\n";

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

    }
}
