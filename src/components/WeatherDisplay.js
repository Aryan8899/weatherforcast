// src/components/WeatherDisplay.jsx

import React, { useState, useEffect, useCallback } from "react";

const WeatherDisplay = ({ city, unit }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const API_KEY = "e5304ec8a6785b8bc8bfec1c36a1af93"; // Replace with your actual API key

  // Function to fetch current weather data
  const fetchWeather = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
        setError("");
        // Cache current weather data
        localStorage.setItem("weatherData", JSON.stringify(data));
        // Cache last searched city
        localStorage.setItem("lastCity", city);
      } else {
        setError(`City "${city}" not found.`);
        setWeatherData(null);
      }
    } catch (err) {
      setError("Failed to fetch weather data. Please check your network.");
      // Load cached weather data if available
      const cachedData = localStorage.getItem("weatherData");
      if (cachedData) {
        setWeatherData(JSON.parse(cachedData));
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [city, unit, API_KEY]);

  // Function to fetch 5-day forecast data
  const fetchForecast = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      const data = await response.json();
      if (response.ok) {
        const filteredData = filterForecast(data.list);
        setForecastData(filteredData);
        setError("");
        // Cache forecast data
        localStorage.setItem(`${city}-forecast`, JSON.stringify(filteredData));
      } else {
        setError(`Forecast data for "${city}" not found.`);
        setForecastData([]);
      }
    } catch (err) {
      setError("Failed to fetch forecast data.");
      // Load cached forecast data if available
      const cachedForecast = localStorage.getItem(`${city}-forecast`);
      if (cachedForecast) {
        setForecastData(JSON.parse(cachedForecast));
      }
    }
  }, [city, unit, API_KEY]);

  // Filter forecast data to get one entry per day
  const filterForecast = (data) => {
    const filteredData = [];
    const daysMap = new Map();

    data.forEach((reading) => {
      const date = new Date(reading.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (!daysMap.has(date)) {
        daysMap.set(date, reading);
        filteredData.push(reading);
      }
    });

    return filteredData.slice(0, 5); // Fetch 5 days
  };

  // Initial fetch on component mount
  useEffect(() => {
    // Load last searched city from localStorage
    const cachedCity = localStorage.getItem("lastCity");
    if (cachedCity && cachedCity !== city) {
      // If there's a cached city different from the current, update it
      // This ensures that when the app loads, it shows the last searched city
      // You might need to adjust this logic based on your app's flow
    }

    // Fetch current weather data
    fetchWeather();

    // Listen to online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fetchWeather, city]);

  // Pull-to-refresh implementation
  useEffect(() => {
    let isThrottled = false;

    const handleScroll = () => {
      if (isThrottled) return;
      if (window.scrollY === 0) {
        isThrottled = true;
        fetchWeather().then(() => {
          setTimeout(() => {
            isThrottled = false;
          }, 2000); // Throttle to prevent rapid refreshes
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchWeather]);

  if (error) {
    return <div className="error text-red-500 text-center">{error}</div>; // Display error message
  }

  if (!weatherData) {
    return <div className="loading-spinner">Loading...</div>;
  }

  const temperature = weatherData.main.temp.toFixed(2);
  const weatherIcon = weatherData.weather[0].icon
    ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    : null;

  return (
    <div className="weather-display bg-blue-100 shadow-lg p-8 rounded-lg text-center max-w-lg mx-auto relative">
      {/* Refreshing Indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 w-full bg-blue-100 p-2">
          <p className="text-blue-500">Refreshing...</p>
        </div>
      )}

      {/* Connectivity Status */}
      {!isOnline && (
        <div className="absolute top-0 left-0 w-full bg-yellow-100 p-2">
          <p className="text-yellow-700">You are offline. Showing cached data.</p>
        </div>
      )}

      <h2 className="text-4xl font-semibold text-gray-800">{weatherData.name}</h2>
      <p className="text-xl text-gray-600 mt-2">
        Temperature: {temperature}°{unit === "metric" ? "C" : "F"}
      </p>
      <p className="text-lg text-gray-500 mt-2 capitalize">
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
              e.target.src = "/path/to/default/icon.png"; // Provide a default icon path
            }}
          />
        ) : (
          <p className="text-gray-500">Icon not available</p>
        )}
      </div>

      {/* Optional: Button to manually refresh */}
      <button
        onClick={fetchWeather}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
};

export default WeatherDisplay;
