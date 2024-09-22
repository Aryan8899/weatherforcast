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

  // Load cached city if available
  useEffect(() => {
    const cachedCity = localStorage.getItem("lastCity");
    if (cachedCity) {
      setCity(cachedCity);
    }
  }, [setCity]);

  // Save the current city in localStorage
  useEffect(() => {
    localStorage.setItem("lastCity", search);
  }, [search]);

  // Function to fetch city suggestions using OpenWeather's Geocoding API
  const fetchCitySuggestions = async (query) => {
    try {
      if (query.length > 2) {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=e5304ec8a6785b8bc8bfec1c36a1af93`
        );
        const data = await response.json();
        if (data.length > 0) {
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const debouncedFetchCitySuggestions = debounce(fetchCitySuggestions, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(false);
      debouncedFetchCitySuggestions(value);
    }
  };

  const handleSuggestionClick = (city) => {
    setCity(city.name);
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setCity(search);
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

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
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64 sm:w-64 md:w-64"
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
                key={suggestion.lat + suggestion.lon}
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
