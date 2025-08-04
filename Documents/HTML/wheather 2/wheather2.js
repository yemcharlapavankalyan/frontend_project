const API_KEY = "YOUR_API_KEY_HERE";
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        // Fetch real-time weather data
        const response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${API_KEY}`);
        const data = await response.json();

        if (!data || !data.data) {
            alert("Invalid location. Please enter a valid city name.");
            return;
        }

        // Extract weather data
        const { temperature, weatherCode, windSpeed } = data.data.values;

        // Update UI
        document.getElementById("location").innerText = city;
        document.getElementById("temperature").innerText = `${temperature.toFixed(1)}°C`;
        document.getElementById("condition").innerText = mapWeatherCode(weatherCode);
        document.getElementById("wind").innerText = `Wind: ${windSpeed.toFixed(1)} km/h`;

        // Set weather icon
        document.getElementById("weatherIcon").src = getWeatherIcon(weatherCode);
        
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Error fetching weather data. Please try again.");
    }
}

// Function to map weather codes to descriptions
function mapWeatherCode(code) {
    const weatherMap = {
        1000: "Clear",
        1100: "Partly Cloudy",
        1101: "Mostly Cloudy",
        1102: "Cloudy",
        2000: "Fog",
        2100: "Light Fog",
        3000: "Light Wind",
        4000: "Drizzle",
        4200: "Light Rain",
        5000: "Snow",
        6000: "Freezing Rain",
    };
    return weatherMap[code] || "Unknown Weather";
}

// Function to get the weather icon based on weather code
function getWeatherIcon(code) {
    const iconMap = {
        1000: "https://cdn-icons-png.flaticon.com/512/869/869869.png",  // Clear
        1100: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", // Partly Cloudy
        1101: "https://cdn-icons-png.flaticon.com/512/1163/1163625.png", // Mostly Cloudy
        1102: "https://cdn-icons-png.flaticon.com/512/414/414825.png",   // Cloudy
        2000: "https://cdn-icons-png.flaticon.com/512/1779/1779808.png", // Fog
        3000: "https://cdn-icons-png.flaticon.com/512/869/869868.png",  // Light Wind
        4000: "https://cdn-icons-png.flaticon.com/512/2932/2932445.png", // Drizzle
        4200: "https://cdn-icons-png.flaticon.com/512/1163/1163623.png", // Light Rain
        5000: "https://cdn-icons-png.flaticon.com/512/869/869873.png",  // Snow
        6000: "https://cdn-icons-png.flaticon.com/512/1779/1779814.png", // Freezing Rain
    };
    return iconMap[code] || "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Default icon
}