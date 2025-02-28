$(document).ready(function () {
    $('#btnCreatePackage').click(function () {
        TravelPackageUtilities.GetIdealDurationAlert();
    })
})
TravelPackageUtilities = {
    GetDestinationOverView: function () {
        var model = {
            Destination: $('#travellingTo').val(),
            BoardingFrom: $('#boardingFrom').val(),
            TravelDuration: $('#expectedTravelDuration').val(),
            TravellingWith: $('#travellingWith').val(),
        }
        var result = GeneralGenericUtilities.callajaxReturnSuccess("/Home/GetDestinationOverview", "POST", model, false);
        result.then(function (data) {
            $('#tripOverview').removeClass("d-none");
            var jsonData = JSON.parse(data);

            $("#destinationName").text(jsonData.destination);
            $("#countryName").text(jsonData.country);
            $("#description").text(jsonData.description);
            $("#annualVisitors").text(jsonData.annualvisitors);

            // Populate Best Time to Visit
            $("#bestTimeContainer,#shoulderSeasonContainer,#monthstoAvoidContainer").html('')
            jsonData.besttimetovisit.forEach(function (month) {
                $("#bestTimeContainer").append(`<span class="best-time">${month}</span>`);
            });

            // Populate Shoulder Season
            jsonData.shoulderseason.forEach(function (month) {
                $("#shoulderSeasonContainer").append(`<span class="shoulder-season">${month}</span>`);
            });
            // Populate Shoulder Season
            jsonData.monthstoavoid.forEach(function (month) {
                $("#monthstoAvoidContainer").append(`<span class="shoulder-season">${month}</span>`);
            });
            // Set Destination Image
            TravelPackageUtilities.GetHowToReachSection();
            TravelPackageUtilities.GetWhereToStaySection();
            TravelPackageUtilities.GetDayWiseItineary();
        })
    },
    GetIdealDurationAlert: function () {
        var model = {
            Destination: $('#travellingTo').val(),
            BoardingFrom: $('#boardingFrom').val(),
            TravelDuration: $('#expectedTravelDuration').val(),
            TravellingWith: $('#travellingWith').val(),
        }
        var result = GeneralGenericUtilities.callajaxReturnSuccess("/Home/GetImportantInformation", "POST", model, true);
        result.then(function (data) {
            var jsonData = JSON.parse(data);
            $("#alertMessage").text(jsonData.message);
            TravelPackageUtilities.GetDestinationOverView();
        })
    },
    GetHowToReachSection: function () {
        var model = {
            Destination: $('#travellingTo').val(),
            BoardingFrom: $('#boardingFrom').val(),
            TravelDuration: $('#expectedTravelDuration').val(),
            TravellingWith: $('#travellingWith').val(),
        }
        var result = GeneralGenericUtilities.callajaxReturnSuccess("/Home/GetHowToReachSection", "POST", model, false);
        result.then(function (data) {
            var jsonData = JSON.parse(data);
            // Populate Destination Data
            $("#destinationName").text(jsonData.destination);
            $("#countryName").text(jsonData.boardingFrom);

            // 🚆 Train Route
            if (jsonData.travelModes.train.available) {
                $("#trainAvailability").text("✅ Train is available.");
                $("#nearestRailwayStation").text("Nearest Railway Station: " + jsonData.travelModes.train.nearestRailwayStation);
                $("#trainRouteSection").show();
            }

            // 🚖 Train + Taxi/Bus Route
            if (jsonData.travelModes.trainTaxiBus.available) {
                $("#trainTaxiBusStation").text(jsonData.travelModes.trainTaxiBus.nearestRailwayStation);
                $("#travelTimeByTaxiOrBus").text(jsonData.travelModes.trainTaxiBus.travelTimeByTaxiOrBus);
                $("#trainTaxiBusSection").show();
            }
            $("#connectingFlightsList,#directFlightsList").html('')
            // ✈️ Flight Options
            if (jsonData.travelModes.flight.directFlights.length > 0 || jsonData.travelModes.flight.connectingFlights.length > 0) {
                $("#flightSection").show();

                jsonData.travelModes.flight.directFlights.forEach(flight => {
                    $("#directFlightsList").append(`<li>✈️ ${flight.from} ➝ ${flight.to} (${flight.airline}, ${flight.duration})</li>`);
                });

                jsonData.travelModes.flight.connectingFlights.forEach(flight => {
                    $("#connectingFlightsList").append(`<li>🛫 ${flight.from} ➝ Layover: ${flight.layover} ➝ ${flight.to} (${flight.airline}, ${flight.duration})</li>`);
                });
            }

            // ✅ Recommended Travel Option
            if (jsonData.travelModes.recommendedOption) {
                $("#recommendedMethod").html(`<strong>Best Option:</strong> ${jsonData.travelModes.recommendedOption.method}`);
                $("#recommendedReason").html(`<strong>Why?</strong> ${jsonData.travelModes.recommendedOption.reason}`);
                $("#recommendedOptionSection").show();
            }
            GeneralGenericUtilities.ajaxindicatorstop();
        })
    },
    GetWhereToStaySection: function () {
        var model = {
            Destination: $('#travellingTo').val(),
            BoardingFrom: $('#boardingFrom').val(),
            TravelDuration: $('#expectedTravelDuration').val(),
            TravellingWith: $('#travellingWith').val(),
        }
        var result = GeneralGenericUtilities.callajaxReturnSuccess("/Home/GetHotelRecommendations", "POST", model, false);
        result.then(function (data) {
            var jsonData = JSON.parse(data);
            $("#stayLocationsList").html('')
            // Populate "Where to Stay" Section
            if (jsonData.recommended_locations.length > 0) {
                $("#whereToStaySection").show();
                jsonData.recommended_locations.forEach(location => {
                    $("#stayLocationsList").append(`<li><strong>${location.location}</strong> - ${location.reason}. ${location.transportation_advantage}.</li>`);
                });
            }
            GeneralGenericUtilities.ajaxindicatorstop();
        })
    },
    GetDayWiseItineary: function () {
        var model = {
            Destination: $('#travellingTo').val(),
            BoardingFrom: $('#boardingFrom').val(),
            TravelDuration: $('#expectedTravelDuration').val(),
            TravellingWith: $('#travellingWith').val(),
        }
        var result = GeneralGenericUtilities.callajaxReturnSuccess("/Home/DayWiseItiniary", "POST", model, false);
        result.then(function (response1) {
            debugger;
            var response = JSON.parse(response1);
            //console.log(jsonData)
            $("#itinerarySection ").html('')
            // Populate Day-wise Itinerary
            // Populate Day-wise Itinerary with Attractions and Restaurants

            var rawContent = response.choices[0].message.content;
            var itineraryData;

            try {
                itineraryData = JSON.parse(rawContent);
            } catch (e) {
                console.error("Error parsing JSON from response:", e);
                return;
            }

            // 2. Access the day-wise itinerary array
            var dayWiseItinerary = itineraryData.day_wise_itinerary || [];

            // 3. Populate the itinerary in the #itinerarySection
            dayWiseItinerary.forEach(dayPlan => {
                let dayNumber = dayPlan.day;
                let activities = dayPlan.activities || [];

                // Create a container card for each day
                let dayCard = `
        <div class="card p-3 mb-4">
          <h4 class="text-primary mb-3"><i class="fas fa-calendar-day"></i> Day ${dayNumber}</h4>
          <div class="row" id="day${dayNumber}Activities">
          </div>
        </div>
      `;

                // Append this Day card to itinerarySection
                $("#itinerarySection").append(dayCard);

                // Now, fill in the activities for this day
                activities.forEach(act => {
                    let visitClass = "";
                    switch ((act.visit_type || "").toLowerCase()) {
                        case "must visit":
                            visitClass = "must-visit";
                            break;
                        case "recommended":
                            visitClass = "recommended";
                            break;
                        case "optional":
                            visitClass = "optional";
                            break;
                        default:
                            visitClass = "optional";
                            break;
                    }

                    let activityCard = `
          <div class="col-md-6">
            <div class="card mb-3 p-3">
              <h5>${act.attraction_name}</h5>
              <p class="rating">⭐ ${act.rating || "N/A"}</p>
              <span class="visit-type ${visitClass}">${act.visit_type || "Optional"}</span>
              ${act.image_url ? `<img src="${act.image_url}" alt="${act.attraction_name}" class="img-fluid mt-2 mb-2" style="max-height: 200px; border-radius: 5px;">` : ""}
              ${act.description ? `<p>${act.description}</p>` : ""}
            </div>
          </div>
        `;
                    $(`#day${dayNumber}Activities`).append(activityCard);
                });
            });


            //if (jsonData.day_wise_itinerary.length > 0) {
            //    jsonData.day_wise_itinerary.forEach(dayPlan => {
            //        var dayCard = `
            //    <div class="card p-3 mb-4">
            //        <h4 class="text-primary"><i class="fas fa-calendar-day"></i> Day ${dayPlan.day}</h4>
            //        <hr>

            //        <!-- Attractions Section -->
            //        <h5 class="text-dark"><i class="fas fa-map-marker-alt"></i> Attractions</h5>
            //        <div class="row">`;

            //        dayPlan.activities.forEach(activity => {
            //            dayCard += `
            //        <div class="col-md-6">
            //            <div class="card p-3 mb-3">
            //                <h5>${activity.attraction_name}</h5>
            //                <p class="rating">⭐ ${activity.rating}</p>
            //                <p class="badge bg-${activity.visit_type === 'Must Visit' ? 'danger' : 'secondary'}">${activity.visit_type}</p>
            //            </div>
            //        </div>`;
            //        });

            //        dayCard += `</div><hr>`;

            //        // Restaurants Section
            //        //if (dayPlan.recommended_restaurants.length > 0) {
            //        //    dayCard += `
            //        //<h5 class="text-dark"><i class="fas fa-utensils"></i> Recommended Restaurants</h5>
            //        //<div class="row">`;

            //        //    dayPlan.recommended_restaurants.forEach(restaurant => {
            //        //        dayCard += `
            //        //    <div class="col-md-6">
            //        //        <div class="card p-3 mb-3">
            //        //            <h5>${restaurant.restaurant_name}</h5>
            //        //            <p>🍽️ Cuisine: ${restaurant.cuisine}</p>
            //        //            <p>📍 Location: ${restaurant.location}</p>
            //        //            <p class="rating">⭐ ${restaurant.rating}</p>
            //        //            <a href="${restaurant.review_link}" target="_blank" class="tripadvisor-btn">View on TripAdvisor</a>
            //        //        </div>
            //        //    </div>`;
            //        //    });

            //        //    dayCard += `</div>`;
            //        //}

            //        dayCard += `</div>`;
            //        $("#itinerarySection").append(dayCard);
            //    });
            //}
            GeneralGenericUtilities.ajaxindicatorstop();
        })
    }
}