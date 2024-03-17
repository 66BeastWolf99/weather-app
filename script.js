
document.getElementById("search-button").addEventListener("click", () => {
    let d = document.getElementById("location-input").value.trim();
    if (d) {
        let reop = {
            method: 'GET'
        };

        fetch(`https://api.weatherapi.com/v1/current.json?key=ae6282e8801149f3ab090716241603&q=${d}`, reop)
            .then(response => response.json())
            .then(data => {
                alert("Discover Your  Weather Information in " + data.location.name);
                updateWeatherInfo(data);
                updateMap(data.location.lat, data.location.lon);
                fetchFutureForecast(d);
                fetchPastForecast(d);
            })
            .catch(error => {
                console.error("Error fetching current weather:", error);
                alert("Location not found");
            });
    } else {
        alert("Please enter a location");
    }
});
function updateWeatherInfo(data) {
    document.getElementById("location").innerHTML = data.location.name;
    document.getElementById("temperature temp_c").innerHTML = data.current.temp_c + " °C";
    document.getElementById("temp_c").innerHTML = data.current.temp_c;
    document.getElementById("description url").innerHTML = data.current.condition.text;
    document.getElementById("weatherIcon").src = data.current.condition.icon;
    document.getElementById("local-time").innerHTML = data.location.localtime;
    document.getElementById("region").innerHTML = data.location.region;
    document.getElementById("country").innerHTML = data.location.country;
    document.getElementById("lon").innerHTML = data.location.lon;
    document.getElementById("lat").innerHTML = data.location.lat;
    document.getElementById("condition").innerHTML = data.current.condition.text;
    document.getElementById("humidity").innerHTML = data.current.humidity;
    document.getElementById("wind_kph").innerHTML = data.current.wind_kph;
    document.getElementById("tz_id").innerHTML = data.location.tz_id;
}
function fetchFutureForecast(location) {







    const startDate = new Date();
    let currentDays = new Date(startDate);
    currentDays.setDate(currentDays.getDate() + 1);
    for (let i = 0; i < 7; i++) {
        const formattedDate = currentDays.toISOString().split('T')[0];
        console.log(`https://api.weatherapi.com/v1/forecast.json?key=ae6282e8801149f3ab090716241603&q=${location}&dt=${formattedDate}`);
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=ae6282e8801149f3ab090716241603&q=${location}&dt=${formattedDate}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.forecast.forecastday[0].date);
                document.getElementById(`date${i + 1}`).innerHTML = data.forecast.forecastday[0].date;
                document.getElementById(`img${i + 1}`).src = data.forecast.forecastday[0].day.condition.icon;
                document.getElementById(`title${i + 1}`).innerHTML = data.forecast.forecastday[0].day.condition.text;
                document.getElementById(`c${i + 1}`).innerHTML = `${data.forecast.forecastday[0].day.avgtemp_c} °C`;
            })
            .catch(error => console.error('Error fetching past forecast:', error));

        currentDays.setDate(currentDays.getDate() + 1);
    }
}



function fetchPastForecast(location) {
    const startDate = new Date();
    let currentDays = new Date(startDate);
    currentDays.setDate(currentDays.getDate() - 1);
    for (let i = 8; i > 1; i--) {
        const formattedDate = currentDays.toISOString().split('T')[0];
         fetch(`https://api.weatherapi.com/v1/history.json?key=ae6282e8801149f3ab090716241603&q=${location}&days=7&dt=${formattedDate}&alerts=yes`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`d${i - 1}`).innerHTML = data.forecast.forecastday[0].date;
                document.getElementById(`i${i - 1}`).src = data.forecast.forecastday[0].day.condition.icon;
                document.getElementById(`e${i - 1}`).innerHTML = `${data.forecast.forecastday[0].day.avgtemp_c} °C`;
                document.getElementById(`t${i + 1}`).innerHTML = data.forecast.forecastday[0].day.condition.text;
            })
            .catch(error => console.error('Error fetching past forecast:', error));

        currentDays.setDate(currentDays.getDate() - 1);
    }
}

var map;
function updateMap(latitude, longitude) {
    if (map) {

        map.remove();
    }
    map = L.map('map').setView([latitude, longitude], 13); // Set initial coordinates and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var marker = L.marker([latitude, longitude]).addTo(map); // Add a marker at specified coordinates
}



function updateLocalTime() {
    const localTimeElement = document.getElementById("local-time");
    const now = new Date();
    const localTimeString = now.toLocaleTimeString();

    localTimeElement.textContent = localTimeString;
}
updateLocalTime();
setInterval(updateLocalTime, 1000);