import React, { useState, useEffect, useRef } from "react";

// Debounce function to delay the API call
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CitySearch = ({ setCity }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]); // To store the city suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // To control dropdown visibility

  const searchRef = useRef(null); // Ref to the search input

  // Function to fetch city suggestions using OpenWeather's Geocoding API
  const fetchCitySuggestions = async (query) => {
    try {
      if (query.length > 2) { // Only fetch if the input is longer than 2 characters
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=e5304ec8a6785b8bc8bfec1c36a1af93`
        );
        const data = await response.json();
        if (data.length > 0) {
          setSuggestions(data); // Update suggestions based on API response
          setShowSuggestions(true); // Show the dropdown
        } else {
          setSuggestions([]); // Clear suggestions if no result is found
          setShowSuggestions(false); // Hide dropdown if no suggestions are found
        }
      } else {
        setSuggestions([]); // Clear suggestions if the input is too short
        setShowSuggestions(false); // Hide dropdown if input is too short
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  // Debounced version of the fetch function
  const debouncedFetchCitySuggestions = debounce(fetchCitySuggestions, 300);

  // Function to handle input changes and debounce the API call
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      // Immediately clear suggestions and hide the dropdown if input is empty
      setSuggestions([]); 
      setShowSuggestions(false);
    } else {
      setShowSuggestions(false); // Force hiding dropdown immediately while fetching
      debouncedFetchCitySuggestions(value); // Call the debounced version of fetchCitySuggestions
    }
  };

  // Function to handle the selection of a city from the suggestions
  const handleSuggestionClick = (city) => {
    setCity(city.name); // Set the selected city as the current city
    setSearch(""); // Clear the search input
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide the suggestions dropdown
  };

  // Function to handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search); // Set the typed city if no suggestion is selected
      setSuggestions([]); // Clear suggestions
      setShowSuggestions(false); // Hide the dropdown
    } else {
      setShowSuggestions(false); // Explicitly hide dropdown when input is empty
    }
  };

  // Function to hide the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false); // Hide dropdown when clicking outside the input or dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full flex justify-center">
      <form onSubmit={handleSearchSubmit} className="relative flex justify-center w-full sm:w-auto">
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          placeholder="Search for a city"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 w-64 sm:w-64 md:w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg ml-4 sm:ml-4 hover:bg-blue-700 transition-colors"
        >
          Search
        </button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white shadow-lg rounded-lg mt-1 max-h-40 overflow-y-auto w-64 left-0 top-full sm:w-64">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.lat + suggestion.lon} // Unique key for each suggestion
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-center"
              >
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default CitySearch;
