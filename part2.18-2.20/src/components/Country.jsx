import React, { useState, useEffect } from "react";
import { getCurrentWeather } from "../services/weatherData";

function Country({ countries, searchInput }) {
  const [showCountryName, setShowCountryName] = useState(null);
  const [toggleShowButton, setToggleShowButton] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  const filteredCountry = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchInput.toLowerCase())
  );

  useEffect(() => {
    if (showCountryName !== null) {
      getCurrentWeather(showCountryName)
        .then((data) => {
          setWeatherData(data);
        })
        .catch((error) => {
          console.log("Error in weather data", error);
        });
    }
  }, [showCountryName]);

  function handleShowCountryName(country) {
    setShowCountryName((prevCountryName) =>
      prevCountryName === country ? null : country
    );
    setToggleShowButton(!toggleShowButton);
  }

  return (
    <div>
      {searchInput.length === 0 ? (
        <p>Enter something.</p>
      ) : filteredCountry.length === 1 ? (
        <div>
          <h2>
            {filteredCountry[0].name.common}{" "}
            <button
              onClick={() =>
                handleShowCountryName(filteredCountry[0].name.common)
              }
            >
              {showCountryName === filteredCountry[0].name.common
                ? "close"
                : "show"}
            </button>
          </h2>

          {showCountryName === filteredCountry[0].name.common && (
            <div>
              <p>Capital: {filteredCountry[0].capital}</p>
              <p>Area: {filteredCountry[0].area}</p>
              <h3>Languages:</h3>
              <ul>
                {Object.keys(filteredCountry[0].languages).map((language) => (
                  <li key={language}>
                    {filteredCountry[0].languages[language]}
                  </li>
                ))}
              </ul>
              <p>
                Flag:{" "}
                <span
                  role='img'
                  aria-label={filteredCountry[0].name.common}
                  style={{ fontSize: "6rem" }}
                >
                  {filteredCountry[0].flag}
                </span>
              </p>

              {weatherData && (
                <div>
                  <h3>Weather Report</h3>
                  <p>Temperature: {weatherData.main.temp} Kelvin</p>
                  {weatherData.wind && (
                    <p>
                      Wind Speed: {weatherData.wind.speed} m/s, Direction:{" "}
                      {weatherData.wind.deg}
                      &deg;
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : filteredCountry.length > 10 ? (
        <p>Too many matches, please make your query more specific.</p>
      ) : (
        <div>
          {filteredCountry.map((country, id) => (
            <div key={id}>
              <h2>
                {country.name.common}{" "}
                <button
                  onClick={() => handleShowCountryName(country.name.common)}
                >
                  {showCountryName === country.name.common ? "close" : "show"}
                </button>
              </h2>

              {showCountryName === country.name.common && (
                <div>
                  <p>Capital: {country.capital}</p>
                  <p>Area: {country.area}</p>
                  <h3>Languages:</h3>

                  <ul>
                    {Object.keys(country.languages).map((language) => (
                      <li key={language}>{country.languages[language]}</li>
                    ))}
                  </ul>

                  <p>
                    Flag:{" "}
                    <span
                      role='img'
                      aria-label={country.name.common}
                      style={{ fontSize: "6rem" }}
                    >
                      {country.flag}
                    </span>
                  </p>

                  {weatherData && (
                    <div>
                      <h3>Weather Report</h3>
                      <p>Temperature: {weatherData.main.temp} Kelvin</p>
                      {weatherData.wind && (
                        <p>
                          Wind Speed: {weatherData.wind.speed} m/s, Direction:{" "}
                          {weatherData.wind.deg}
                          &deg;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Country;
