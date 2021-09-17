// Access to OpenWeather Api
var apiKey = "11844fc65296129b6cf4bbaa841fc2e6";
//moment.js for current day
var today = moment().format('l');
document.getElementById("#search-list");
//will store searched cities in this.
var citySearchList;
//getting local storage so that I can append back to page after refresh
if (JSON.parse(localStorage.getItem("searched-city"))) {
    citySearchList= JSON.parse(localStorage.getItem("searched-city"))
}else {
    citySearchList = []  
}

for (i = 0; i < citySearchList.length; i++) {
    var cityInput = $(` <li class = "list-group-item row background">${citySearchList[i]}</li>`);
        // And also it adds to the search history NEED THE SEARCHES TO DISPLAY ON PAGE
        $("#search-list").append(cityInput)

}

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
            ${cityResponse.name} ${today} <img src="${iconURL}"  /></h2>
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
        // NOTE FOR MYSELF NEEDS TO APPEND B4 CONDITION SO THAT THE ID EXSISTS
        // When you view the UV index needs to show a color regarding what condition it is
        $("#cityInfo").append(heatIndexP);
        if (heatIndex < 2) {
            $("#heatIndexColor").addClass("uvfavorable");
        }else if (heatIndex >= 2 && heatIndex <=6) {
            $("#heatIndexColor").addClass("uvmoderate");
        }else if(heatIndex >= 6 && heatIndex <=12) {
            $("#heatIndexColor").addClass("uvsevere");
        }
        

        nextDaysCondition(lat, lon);
        })
        
// HEAT INDEX COLOR CORD ISNT WORKING YET NEED TO FINISH IT CONDITIONAL ?

    })
    
}

//need event listener of some sorts when click the previos search history will pull forcast back up
$("#search-list").on("click", "li", function(event) {
    //console.log("listitemhit");
    //event object dot notation 
    var listCities = $(this).text();
    //console.log(listCities);
    currentConditions(listCities);
})

//$(document).on("click", "list-group-item", function() {
    //var listCities = $(this).text();
   // currentConditions(listCities);
//});


// Need to make a function that will show next conditions within 5 days
// Will need to show conditions, temp, humidity, wind for the next 5 days.

function nextDaysCondition(lat, lon) {

    var nextDaysURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
 
    $.ajax({
        url:nextDaysURL,
        method: "GET"
    }).then(function(nextResponse){
        console.log(nextResponse);
        $("#next-days").empty();

        for (i = 0; i < 5; i++) {
            
            var cityInfo = {
                date: nextResponse.daily[i].dt,
                icon: nextResponse.daily[i].weather[0].icon,
                humidity: nextResponse.daily[i].humidity,
                temp: nextResponse.daily[i].temp.day
            };
            console.log(cityInfo.date);
        var todayDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
        console.log(todayDate);
        var iconPic = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png">`;
        
        var nextDaysDiv = `
            <div class=:"pl-3">
                <div class = "card pl-3 pt-3 mb-3 bg-primary text-light" style="width:12rem;>
                    <div class="card-body">
                        <h5>${todayDate}</h5>
                        <p>${iconPic}</p>
                        <p>TEMP: ${cityInfo.temp}F</p>
                        <p>Humidity: ${cityInfo.humidity}%</p>
                    </div>
                </div>
                </div>

        `;
        
        $("#next-days").append(nextDaysDiv);
        
        }
    });
    

}

//click event listener for the search button
$("#search-button").on("click", function(event) {
    event.preventDefault();
    var city = $("#search").val().trim();
    currentConditions(city);
    if (!citySearchList.includes(city)) {
        citySearchList.push(city);
        var cityInput = $(` <li class = "list-group-item row background">${city}</li>`);
        // And also it adds to the search history NEED THE SEARCHES TO DISPLAY ON PAGE
        $("#search-list").append(cityInput);
    };
    
    localStorage.setItem("searched-city", JSON.stringify(citySearchList));
    console.log(citySearchList);
});






