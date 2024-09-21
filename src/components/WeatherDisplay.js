import React, { useState, useEffect } from "react";

const WeatherDisplay = ({ city, unit }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(""); // Add error state

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e5304ec8a6785b8bc8bfec1c36a1af93&units=${unit}`
        );
        const data = await response.json();
        if (response.ok) {
          setWeatherData(data);
          setError(""); // Clear error if successful
        } else {
          setError(`City "${city}" not found.`); // Handle city not found error
          setWeatherData(null);
        }
      } catch (error) {
        setError("Failed to fetch weather data. Please check your network.");
        setWeatherData(null); // Handle network errors
      }
    };

    fetchWeather();
  }, [city, unit]);

  if (error) {
    return <div className="error text-red-500">{error}</div>; // Display error message
  }

  if (!weatherData) {
    return <div className="loading text-gray-500">Loading...</div>;
  }

  const weatherIcon = weatherData.weather[0].icon
    ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    : null;

  return (
    <div className="weather-display bg-white shadow-lg p-8 rounded-lg text-center max-w-lg mx-auto">
      <h2 className="text-4xl font-semibold text-gray-800">{weatherData.name}</h2>
      <p className="text-xl text-gray-600 mt-2">
        Temperature: {weatherData.main.temp}°{unit === "metric" ? "C" : "F"}
      </p>
      <p className="text-lg text-gray-500 mt-2">
        Condition: {weatherData.weather[0].description}
      </p>
      <div className="flex justify-center mt-6">
        {weatherIcon ? (
          <img
            src={weatherIcon}
            alt="Weather icon"
            className="w-24 h-24 rounded-full bg-blue-300 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/path/to/default/icon.png"; // Provide a default icon here
            }}
          />
        ) : (
          <p className="text-gray-500">Icon not available</p>
        )}
      </div>
    </div>
  );
};

export default WeatherDisplay;
