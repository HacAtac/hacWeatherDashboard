// Access to OpenWeather Api
var ApiKey = "11844fc65296129b6cf4bbaa841fc2e6";
var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon{lon}" + ApiKey;
var searchHistoryList = document.querySelector("#search-list");
var searchCity = document.querySelector("#search");
var searchCityBtn = document.querySelector("#search-button")