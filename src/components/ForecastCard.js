import React from "react";

const ForecastCard = ({ data, unit }) => {
  const date = new Date(data.dt * 1000).toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
<div className="forecast-card bg-blue-100 shadow-md p-6 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
  <h3 className="text-lg font-bold text-gray-800">{date}</h3>
  <p className="text-gray-700 mt-2">
    High: {data.main.temp_max}°{unit === "metric" ? "C" : "F"}
  </p>
  <p className="text-gray-700">
    Low: {data.main.temp_min}°{unit === "metric" ? "C" : "F"}
  </p>
  <div className="flex justify-center mt-6 mb-4">
    <div className="icon-container bg-blue-300 p-4 rounded-full shadow-md">
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt="Weather icon"
        className="w-16 h-16"  // Keeping the original size
      />
    </div>
  </div>
  <p className="text-gray-600 capitalize">{data.weather[0].description}</p>
</div>

  
  );
};

export default ForecastCard;
