const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const weatherDataSection = document.getElementById('weather-data');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const suggestionsContainer = document.getElementById('suggestions-container');

let debounceTimer;

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchCoordinates(city);
        suggestionsContainer.classList.add('hidden');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchCoordinates(city);
            suggestionsContainer.classList.add('hidden');
        }
    }
});

// Autocomplete with debouncing
cityInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // Clear previous timer
    clearTimeout(debounceTimer);

    if (query.length < 2) {
        suggestionsContainer.classList.add('hidden');
        return;
    }

    // Debounce - wait 300ms after user stops typing
    debounceTimer = setTimeout(() => {
        fetchSuggestions(query);
    }, 300);
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!suggestionsContainer.contains(e.target) && e.target !== cityInput) {
        suggestionsContainer.classList.add('hidden');
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude, "Your Location");
            },
            (error) => {
                showError("Unable to retrieve your location.");
                hideLoading();
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
});

// Fetch Suggestions
async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
        const data = await response.json();

        if (!data.results) {
            suggestionsContainer.classList.add('hidden');
            return;
        }

        displaySuggestions(data.results);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Display Suggestions
function displaySuggestions(results) {
    suggestionsContainer.innerHTML = '';

    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';

        const locationText = `${result.name}, ${result.country}${result.admin1 ? ', ' + result.admin1 : ''}`;
        item.innerHTML = `<strong>${result.name}</strong>, ${result.country}${result.admin1 ? ', ' + result.admin1 : ''}`;

        item.addEventListener('click', () => {
            cityInput.value = result.name;
            fetchWeather(result.latitude, result.longitude, `${result.name}, ${result.country}`);
            suggestionsContainer.classList.add('hidden');
        });

        suggestionsContainer.appendChild(item);
    });

    suggestionsContainer.classList.remove('hidden');
}

// Fetch Coordinates
async function fetchCoordinates(city) {
    showLoading();
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const data = await response.json();

        if (!data.results) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name, country } = data.results[0];
        fetchWeather(latitude, longitude, `${name}, ${country}`);
    } catch (error) {
        showError(error.message);
        hideLoading();
    }
}

// Fetch Weather Data
async function fetchWeather(lat, lon, cityName) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`);
        const data = await response.json();

        updateUI(data, cityName);
        hideLoading();
    } catch (error) {
        showError("Failed to fetch weather data.");
        hideLoading();
    }
}

// Update UI
function updateUI(data, cityName) {
    // Current Weather
    const current = data.current;
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('temp').textContent = Math.round(current.temperature_2m);
    document.getElementById('feels-like').textContent = Math.round(current.apparent_temperature);
    document.getElementById('wind-speed').textContent = current.wind_speed_10m;
    document.getElementById('humidity').textContent = current.relative_humidity_2m;

    // Sunrise and Sunset
    const sunrise = new Date(data.daily.sunrise[0]);
    const sunset = new Date(data.daily.sunset[0]);
    document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const weatherCode = current.weather_code;
    const weatherInfo = getWeatherInfo(weatherCode);
    document.getElementById('condition').textContent = weatherInfo.description;
    document.getElementById('weather-icon').className = `fa-solid ${weatherInfo.icon}`;

    // 5-Day Forecast
    const daily = data.daily;
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const date = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const code = daily.weather_code[i];
        const info = getWeatherInfo(code);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="forecast-date">${date}</p>
            <i class="forecast-icon fa-solid ${info.icon}"></i>
            <p class="forecast-temp">${maxTemp}° / ${minTemp}°</p>
            <p class="forecast-desc">${info.description}</p>
        `;
        forecastContainer.appendChild(card);
    }

    weatherDataSection.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

// Helper Functions
function showLoading() {
    loading.classList.remove('hidden');
    weatherDataSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
    suggestionsContainer.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherDataSection.classList.add('hidden');
}

// WMO Weather Code Mapping
function getWeatherInfo(code) {
    const codes = {
        0: { description: "Clear Sky", icon: "fa-sun" },
        1: { description: "Mainly Clear", icon: "fa-cloud-sun" },
        2: { description: "Partly Cloudy", icon: "fa-cloud-sun" },
        3: { description: "Overcast", icon: "fa-cloud" },
        45: { description: "Fog", icon: "fa-smog" },
        48: { description: "Depositing Rime Fog", icon: "fa-smog" },
        51: { description: "Light Drizzle", icon: "fa-cloud-rain" },
        53: { description: "Moderate Drizzle", icon: "fa-cloud-rain" },
        55: { description: "Dense Drizzle", icon: "fa-cloud-showers-heavy" },
        56: { description: "Light Freezing Drizzle", icon: "fa-snowflake" },
        57: { description: "Dense Freezing Drizzle", icon: "fa-snowflake" },
        61: { description: "Slight Rain", icon: "fa-cloud-rain" },
        63: { description: "Moderate Rain", icon: "fa-cloud-showers-heavy" },
        65: { description: "Heavy Rain", icon: "fa-cloud-showers-water" },
        66: { description: "Light Freezing Rain", icon: "fa-snowflake" },
        67: { description: "Heavy Freezing Rain", icon: "fa-snowflake" },
        71: { description: "Slight Snow Fall", icon: "fa-snowflake" },
        73: { description: "Moderate Snow Fall", icon: "fa-snowflake" },
        75: { description: "Heavy Snow Fall", icon: "fa-snowflake" },
        77: { description: "Snow Grains", icon: "fa-snowflake" },
        80: { description: "Slight Rain Showers", icon: "fa-cloud-rain" },
        81: { description: "Moderate Rain Showers", icon: "fa-cloud-showers-heavy" },
        82: { description: "Violent Rain Showers", icon: "fa-cloud-showers-water" },
        85: { description: "Slight Snow Showers", icon: "fa-snowflake" },
        86: { description: "Heavy Snow Showers", icon: "fa-snowflake" },
        95: { description: "Thunderstorm", icon: "fa-bolt" },
        96: { description: "Thunderstorm with Hail", icon: "fa-bolt" },
        99: { description: "Thunderstorm with Heavy Hail", icon: "fa-bolt" }
    };

    return codes[code] || { description: "Unknown", icon: "fa-question" };
}
