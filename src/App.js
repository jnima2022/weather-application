import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('metric'); // Celsius by default
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastData, setForecastData] = useState([]);
  
  // Function to fetch weather data
  const getWeather = async (city) => {
    setIsLoading(true);
    setError('');
    
    try {
      const apiKey = '6947207802e948ea3e5bd2046a7d58ec'; //free version api
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
      );
      const currentWeather = await currentWeatherResponse.json();

      if (currentWeather.cod !== 200) {
        setError('City not found');
        setIsLoading(false);
        return;
      }

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
      );
      const forecast = await forecastResponse.json();

      setWeatherData(currentWeather);
      setForecastData(forecast.list.slice(0, 5)); // 5-day forecast
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data');
      setIsLoading(false);
    }
  };

  // Function to toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  // Function to get user's location
  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      });
    } else {
      alert('Geolocation not supported');
    }
  };

  // Function to fetch weather by coordinates
  const getWeatherByCoords = async (lat, lon) => {
    setIsLoading(true);
    setError('');
    
    try {
      const apiKey = '6947207802e948ea3e5bd2046a7d58ec';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
      );
      const data = await response.json();
      setWeatherData(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data');
      setIsLoading(false);
    }
  };

  // Get weather based on user input or location
  const handleSearch = () => {
    if (city) {
      getWeather(city);
    } else {
      getLocationWeather();
    }
  };

  // Render weather icon based on condition
  const renderWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div className="app">
      <h2>Weather Application</h2>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Get Weather</button>

      <div className="unit-toggle">
        <button onClick={toggleUnit}>
          {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {weatherData && (
        <div className="weather-info">
          <h3>{weatherData.name}</h3>
          <img src={renderWeatherIcon(weatherData.weather[0].icon)} alt={weatherData.weather[0].description} />
          <p>{weatherData.weather[0].description}</p>
          <p>{weatherData.main.temp}°</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>

          <h4>5-Day Forecast:</h4>
          <div className="forecast">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img src={renderWeatherIcon(day.weather[0].icon)} alt={day.weather[0].description} />
                <p>{day.main.temp}°</p>
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
