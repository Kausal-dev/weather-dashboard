# 🌦️ Weather Dashboard

A professional weather dashboard built with HTML, CSS, and Vanilla JavaScript using the Open-Meteo API. Features a premium glassmorphism UI with vibrant weather icons and smooth animations.

## 🚀 Usage
1. Clone the repository.
2. Open `index.html` in your web browser.
3. Allow location access for automatic weather detection or search for a city manually.

## 🛠️ Features

### Search & Location
- **City Search Autocomplete**: Real-time city suggestions as you type with intelligent debouncing
- **Geolocation Support**: Automatically detects user location to show local weather
- **Smart Search**: Geocoding API converts city names to coordinates

### Weather Data
- **Current Weather**: Temperature, weather condition, and large weather icon
- **Feels Like Temperature**: Apparent temperature for accurate comfort level
- **Wind Speed**: Current wind conditions in km/h
- **Humidity**: Relative humidity percentage
- **Sunrise & Sunset**: Daily sunrise and sunset times
- **5-Day Forecast**: Visual forecast cards with high/low temperatures and conditions

### Design & UI
- **Premium Glassmorphism**: Modern translucent glass-effect cards with backdrop blur
- **Colorful Weather Icons**: Vibrant, context-aware icon colors (golden sun, blue rain, cyan snow, etc.)
- **Smooth Animations**: Staggered fade-ins, floating icons, and hover effects
- **Gradient Buttons**: Eye-catching gradient buttons with ripple effects
- **Fixed Background**: Clean purple gradient background for optimal content visibility
- **Responsive Design**: Fully responsive layout that adapts to mobile and desktop screens

### Technical Features
- **Error Handling**: Graceful error messages for invalid city names or network issues
- **WMO Weather Codes**: Comprehensive weather condition mapping
- **Modern ES6+ JavaScript**: Clean, maintainable code with async/await
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required
- **API Efficiency**: Debounced autocomplete to minimize API calls

## 💻 Tech Stack
- **Frontend**: HTML5, CSS3 (Flexbox/Grid), Vanilla JavaScript (ES6+)
- **API**: Open-Meteo (Weather & Geocoding) - Free, no API key required
- **Icons**: FontAwesome 6.4.0
- **Fonts**: Google Fonts (Poppins)

## 🎨 Design Features
- Custom CSS variables for easy theming
- Advanced CSS animations and transitions
- Backdrop filter blur for glassmorphism effect
- Responsive grid layout for forecast cards
- Individual colored icons for different weather conditions
- Multi-layered text shadows for enhanced readability

## 🌐 Browser Support
Works on all modern browsers that support:
- CSS backdrop-filter
- ES6+ JavaScript features
- Geolocation API (optional)
