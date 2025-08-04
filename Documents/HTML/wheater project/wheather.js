const API_KEY = "c91cc5645e894e2f5f990cb6896cb9fc";

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (city.trim() === "") {
        alert("Please enter a city name!");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById("weatherResult").innerHTML = "❌ City not found!";
            } else {
                document.getElementById("weatherResult").innerHTML = 
                    `🌍 ${data.name}, ${data.sys.country} <br> 
                     🌡 Temperature: ${data.main.temp}°C <br>
                     🌤 Weather: ${data.weather[0].description}`;
            }
        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML = "⚠️ Error fetching data!";
        });
}