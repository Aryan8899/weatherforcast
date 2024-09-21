
# Weather Forecast Application

## Overview

This Weather Forecast Application is a React app that displays the current weather and a 5-day weather forecast for any city worldwide. Users can search for cities, view real-time weather conditions, and switch between Celsius and Fahrenheit units for temperature.

### Features:
- Search for a city using the OpenWeather Geocoding API.
- Display current weather details, including temperature, condition, and icons.
- Display a 5-day weather forecast with high and low temperatures.
- Unit toggle between Celsius and Fahrenheit.
- Consistent error handling for city not found or network errors.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
  - [CitySearch](#citysearch-component)
  - [WeatherDisplay](#weatherdisplay-component)
  - [ForecastDisplay](#forecastdisplay-component)
  - [TempToggle](#temptoggle-component)
- [Error Handling](#error-handling)
- [Technologies Used](#technologies-used)
- [License](#license)

## Installation

To install and run this application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-forecast-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd weather-forecast-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Obtain your API key from OpenWeather and create a `.env` file at the root of the project:
   ```
   REACT_APP_WEATHER_API_KEY=your_openweather_api_key
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Type the name of a city in the search bar.
2. Click on the `Search` button to fetch the weather and forecast data.
3. Switch between Celsius and Fahrenheit using the toggle button.

## Components

### CitySearch Component

The `CitySearch` component is responsible for searching and suggesting city names from the OpenWeather Geocoding API. When a city is selected or typed in, it triggers the weather fetch.

#### Props:
- `setCity`: A function that sets the selected city name to be used for fetching weather and forecast data.

### WeatherDisplay Component

This component is responsible for displaying the current weather information for a selected city. It fetches data from the OpenWeather API based on the city name and displays temperature, condition, and an icon.

#### Props:
- `city`: The selected city name.
- `unit`: The unit system (metric or imperial) to display the temperature.

### ForecastDisplay Component

This component displays the 5-day forecast for the selected city. It fetches forecast data from the OpenWeather API and displays high and low temperatures along with weather conditions for the next five days.

#### Props:
- `city`: The selected city name.
- `unit`: The unit system (Celsius or Fahrenheit) for displaying temperature.

### TempToggle Component

This component allows the user to switch between Celsius and Fahrenheit for temperature display.

#### Props:
- `isCelsius`: A boolean value indicating if the current unit is Celsius.
- `toggleUnit`: A function to toggle the unit between Celsius and Fahrenheit.

## Error Handling

The application has consistent error handling across components. If a city is not found or there's a network issue, a relevant error message is shown.

- **City Not Found**: Displays "City not found" when the API cannot locate the city.
- **Network Error**: Displays "Failed to fetch data" in case of a network issue.

## Technologies Used

- **React**: For building the application.
- **Tailwind CSS**: For styling and responsiveness.
- **OpenWeather API**: To fetch real-time weather and forecast data.
- **Debounce**: To limit the API calls while typing in the search input.

