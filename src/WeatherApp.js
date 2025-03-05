import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "ab0d186f55bb7f452f4d24d9513d2349";

  const fetchWeather = async (unitType = unit) => {
   
    const sanitizedCity = city.replace(/[^a-zA-Z\s]/g, "").trim();

    if (!sanitizedCity) {
      setWeather(null);
      setError("Invalid city name. Please enter a valid city.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${sanitizedCity}&units=${unitType}&appid=${API_KEY}`
      );
      setWeather(response.data);
      setError(""); // Clear error on successful fetch
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setError("Invalid city name. Please enter a valid city.");
    }
  };

  const getBackgroundStyle = () => {
    if (!weather && !error) return { backgroundImage: "url(/images/default.jpeg)" };

    if (error) {
      return darkMode
        ? { backgroundColor: "#1a202c", color: "white" }
        : { backgroundColor: "lightblue", color: "#333" };
    }

    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("cloud")) return { backgroundImage: "url(/images/cloudy.jpeg)" };
    if (condition.includes("clear")) return { backgroundImage: "url(/images/sunny1.jpg)" };
    if (condition.includes("rain")) return { backgroundImage: "url(/images/rainy.jpeg)" };

    return { backgroundImage: "url(/images/default.jpg)" };
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    fetchWeather(newUnit); // Re-fetch weather in the new unit
  };

  return (
    <div
      className={`app-container ${darkMode ? "dark" : ""}`}
      style={{ ...getBackgroundStyle(), backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <button onClick={() => setDarkMode(!darkMode)} className="mode-toggle">
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1 className="title">Weather App</h1>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="city-input"
        placeholder="Enter city name..."
      />

      <button onClick={() => fetchWeather()} className="get-weather">
        Get Weather
      </button>

      {weather && (
        <button onClick={toggleUnit} className="unit-toggle">
          °C / °F
        </button>
      )}

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p className="temperature">{weather.main.temp}°{unit === "metric" ? "C" : "F"}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
