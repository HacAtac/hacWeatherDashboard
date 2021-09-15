// Access to OpenWeather Api
var apiKey = "11844fc65296129b6cf4bbaa841fc2e6";
//will store searched cities in this.
var citySearchList = [];
//moment.js for current day
var today = moment().format('l');
document.getElementById("#search-list");


// Need to make a function that will show current conditions 
// Will show conditions, temp, humidity, wind, UV index, also need color for  current UV 
// Current Condition UV index should show favorable, moderate, or severe color
function currentConditions(city) {
    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(cityResponse){
        console.log(cityResponse);
        $("#cityInfo").empty();

        var iconPic = cityResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconPic}.png`;
        var currentCity = $(`
        <h2 id= "currentCity">
            ${cityResponse.name} ${today} <img src="${iconURL}" alt="${cityResponse.weather[0].description}" /></h2>
        <p>Temp: ${cityResponse.main.temp} F</p>
        <p>Humidity: ${cityResponse.main.humidity}%</p>
        <p>Wind: ${cityResponse.wind.speed}MPH</p>
            `);
    $("#cityInfo").append(currentCity);
        //HEAT INDEX
        var lat = cityResponse.coord.lat;
        var lon = cityResponse.coord.lon;
        var uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviURL,
            method:"GET"
        }).then(function(uviResponse){
            console.log(uviResponse);
        
        var heatIndex = uviResponse.value;
        var heatIndexP = $(`<p>Heat Index: <span id ="heatIndexColor" class="px-4 py-4 square">${heatIndex}</span></p>`);
        $("#cityInfo").append(heatIndexP);
        })

    })

}

// And also it adds to the search history NEED THE SEARCHES TO DISPLAY ON PAGE

// Need to make a function that will show next conditions within 5 days
// Will need to show conditions, temp, humidity, wind, UV index for the next 5 days.
// When you view the UV index needs to show a fontawesome icon regarding what condition it is



//click event listener for the search button
$("#search-button").on("click", function(event) {
    event.preventDefault();
    var city = $("#search").val().trim();
    currentConditions(city);
    if (!citySearchList.includes(city)) {
        citySearchList.push(city);
        var cityInput = $(` <li class = "list-group-item" "row" "background">${city}</li>`);
        $("#search-list").append(cityInput);
    };
    
    localStorage.setItem("searched-city", JSON.stringify(citySearchList));
    console.log(citySearchList);
})



