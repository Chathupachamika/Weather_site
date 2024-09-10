const apiKey = "4a758dd1aed04dc3950175920231609";
const mapContainer = $("#map");

// DOM Elements
let country1 = $(".country");
let id1 = $(".temp_c");
let lat1 = $("#lat");
let lon1 = $("#lon");
let name1 = $(".name");
let region1 = $(".region");
let url1 = $(".url");
let humidity1 = $(".humidity");
let tz_id1 = $(".tz_id");
let wind_kph1 = $(".wind_kph");
let img = document.getElementById("weatherIcon");

let marker;
let latitude;
let longitude;

//===================== GET LOCATION =================
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by this browser.");
    }
}

//==================== SHOW POSITION ===================
function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    fetchWeatherData(`${latitude},${longitude}`);

    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    // Initialize map
    const map = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Set marker
    marker = L.marker([latitude, longitude]).addTo(map);

    // AJAX call for reverse geocoding
    $.ajax({
        method: "GET",
        url: geoApiUrl,
        success: function(response) {
            console.log(response);
        }
    });
}

//===================== HANDLE SEARCH =================
function handleSearch() {
    const location = document.getElementById("location-input").value;
    fetchWeatherData(location);
}

document.getElementById("search-button").addEventListener("click", handleSearch);

//===================== FETCH WEATHER DATA =================
function fetchWeatherData(location) {
    $.ajax({
        method: "GET",
        url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`,
        success: function(response) {
            const { location, current } = response;

            // Update UI
            country1.text(location.country);
            id1.text(`${current.temp_c}°C`);
            lat1.text(location.lat);
            lon1.text(location.lon);
            name1.text(location.name);
            region1.text(location.region);
            url1.text(current.condition.text);
            humidity1.text(current.humidity);
            tz_id1.text(location.tz_id);
            wind_kph1.text(`${current.wind_kph} kph`);
            img.src = current.condition.icon;

            // Update map
            marker.setLatLng([location.lat, location.lon]).update();
            map.setView([location.lat, location.lon]);
        }
    });
}

//===================== UPDATE LOCAL TIME =================
function updateLocalTime() {
    const localTimeElement = document.getElementById("local-time");
    const now = new Date();
    const localTimeString = now.toLocaleTimeString();
    localTimeElement.textContent = localTimeString;
}

setInterval(updateLocalTime, 1000);

//===================== SEARCH FORECAST DATA =================
function searchForecast() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const timeDiff = endDate - startDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    getWeatherTimeLine("2023-10-01", "2023-09-25");
}

//===================== GET WEATHER TIMELINE =================
function getWeatherTimeLine(startDate, endDate) {
    console.log(startDate, endDate);

    const imgIds = ["img1", "img2", "img3", "img4", "img5", "img6", "img7"];
    const titleClasses = [".title1", ".title2", ".title3", ".title4", ".title5", ".title6", ".title7"];
    const dateIds = ["date1", "date2", "date3", "date4", "date5", "date6", "date7"];

    $.ajax({
        method: "GET",
        url: `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=Panadura&dt=${startDate}&end_dt=${endDate}`,
        success: function(response) {
            const forecastDays = response.forecast.forecastday;

            for (let i = 0; i < forecastDays.length && i < 7; i++) {
                const forecastDay = forecastDays[i].day;
                const img = document.getElementById(imgIds[i]);
                const title = document.querySelector(titleClasses[i]);
                const date = document.getElementById(dateIds[i]);

                img.src = forecastDay.condition.icon;
                title.innerHTML = forecastDay.condition.text;
                date.innerHTML = forecastDays[i].date;
            }
        }
    });
}
// Initialize the map
var map = L.map('map').setView([6.9271, 79.8612], 10); // Default to Colombo, Sri Lanka

// Set up the map layer using OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map
 marker = L.marker([6.9271, 79.8612]).addTo(map)
  .bindPopup('You are in Colombo!')
  .openPopup();

// Function to set user's current location
function setUserLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
      map.setView([lat, lng], 13); // Center the map on the user's location
    marker.setLatLng([lat, lng]).bindPopup('You are here!').openPopup();
    });  } else {
    alert("Geolocation is not supported by this browser.");
}
}

setUserLocation();

document.addEventListener('DOMContentLoaded', () => {
    const cardTitles = document.querySelectorAll('.card h3');
    cardTitles.forEach((title, index) => {
    title.textContent = `Dynamic Title ${index + 1}`;
    }); });