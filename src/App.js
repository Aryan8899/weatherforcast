import React, { useState } from "react";
import WeatherDisplay from "./components/WeatherDisplay";
import ForecastDisplay from "./components/ForecastDisplay";
import CitySearch from "./components/CitySearch";
import "./App.css"; // Keep this for any custom styles, if needed

const App = () => {
  const [city, setCity] = useState("New York"); // Default city
  const [unit, setUnit] = useState("metric"); // Toggle between Celsius and Fahrenheit

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="app-container w-full p-6 bg-blue-200 min-h-screen ">
      <h1 className="text-4xl font-bold text-gray-700 mb-6 text-center">
        Weather Forecast
      </h1>
      <div className="search-bar flex justify-center items-center mb-8">
        {/* Use CitySearch component to search for a city */}
        <CitySearch setCity={setCity} />
      </div>
      <button
        className="unit-toggle-button p-3 bg-gray-100 border border-gray-300 rounded-lg mb-8 hover:bg-gray-200 transition-all focus:outline-none"
        onClick={handleUnitToggle}
      >
        Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
      </button>
      <div className="mb-12">
        {/* Display weather for the searched city */}
        <WeatherDisplay city={city} unit={unit} />
      </div>
      <ForecastDisplay city={city} unit={unit} />
    </div>
  );
};

export default App;
