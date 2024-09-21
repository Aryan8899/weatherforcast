import React, { useState, useEffect } from "react";
import ForecastCard from "./ForecastCard";

const ForecastDisplay = ({ city, unit }) => {
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e5304ec8a6785b8bc8bfec1c36a1af93&units=${unit}`
        );
        const data = await response.json();

        if (response.ok) {
          const filteredData = [];
          const daysMap = new Map();

          data.list.forEach((reading) => {
            const date = new Date(reading.dt * 1000).toLocaleDateString("en-US", {
              weekday: "long",
            });
            if (!daysMap.has(date)) {
              daysMap.set(date, reading);
              filteredData.push(reading);
            }
          });

          setForecastData(filteredData.slice(0, 4)); // Fetch only 4 days for 2 pairs of rows
          setError("");
        } else {
          setError(`Forecast data for "${city}" not found.`);
          setForecastData([]);
        }
      } catch (error) {
        setError("Failed to fetch forecast data.");
        setForecastData([]);
      }
    };

    fetchForecast();
  }, [city, unit]);

  if (error) {
    return <div className="error text-red-500">{error}</div>;
  }

  if (!forecastData.length) {
    return <div className="loading text-gray-500">Loading forecast...</div>;
  }

  return (
    <div className="forecast-container grid grid-cols-2 gap-4">
      {forecastData.map((data) => (
        <ForecastCard key={data.dt} data={data} unit={unit} />
      ))}
    </div>
  );
};

export default ForecastDisplay;
