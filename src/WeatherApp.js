import React, { useState } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";
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
      setError("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setError("Invalid city name. Please enter a valid city.");
    }
  };

  const getBackgroundStyle = () => {
    if (!weather || error) {
      return { backgroundImage: "url(/images/default.jpg)" }; 
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
    fetchWeather(newUnit);
  };

  return (
    <div
      className={`app-container ${darkMode ? "dark" : ""}`}
      style={{ ...getBackgroundStyle(), backgroundSize: "cover", backgroundPosition: "center" }}
    >
     
      <div className="toggle-container">
        <label className="mode-toggle">
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <span className="slider">
            <span className="toggle-icon">{darkMode ? <FaMoon /> : <FaSun />}</span>
          </span>
        </label>
      </div>

      <h1 className="title">Weather App</h1>
      <div className="weather-container">
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

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <p>{weather.weather[0].description}</p>
            <p className="temperature">{weather.main.temp}°{unit === "metric" ? "C" : "F"}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}</p>

           
            <div className="unit-toggle-container">
              <span>°C</span>
              <label className="unit-switch">
                <input type="checkbox" checked={unit === "imperial"} onChange={toggleUnit} />
                <span className="slider"></span>
              </label>
              <span>°F</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
