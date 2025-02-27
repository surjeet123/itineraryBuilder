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
    }

}