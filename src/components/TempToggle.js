import React from 'react';

const TempToggle = ({ isCelsius, toggleUnit }) => {
  return (
    <button onClick={toggleUnit}
    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg mt-4 hover:bg-gray-300 transition-colors text-sm sm:text-base"
    >
      
      {isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
    </button>
  );
};

export default TempToggle;
