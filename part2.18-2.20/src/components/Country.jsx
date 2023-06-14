import React, { useState } from "react";

function Country({ countries, searchInput }) {
  const [showCountryData, setShowCountryData] =
    useState(null);
  const [toggleShowButton, setToggleShowButton] =
    useState(true);

  const filteredCountry = countries.filter((country) =>
    country.name.common
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  function handleShowCountryData(country) {
    showCountryData === country
      ? setShowCountryData(null)
      : setShowCountryData(country);
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
                handleShowCountryData(
                  filteredCountry[0].name.common
                )
              }
            >
              {showCountryData ===
              filteredCountry[0].name.common
                ? "close"
                : "show"}
            </button>
          </h2>
          {showCountryData ===
            filteredCountry[0].name.common && (
            <div>
              <p>Capital: {filteredCountry[0].capital}</p>
              <p>Area: {filteredCountry[0].area}</p>
              <h3>Languages:</h3>
              <ul>
                {Object.keys(
                  filteredCountry[0].languages
                ).map((language) => (
                  <li key={language}>
                    {filteredCountry[0].languages[language]}
                  </li>
                ))}
              </ul>
              <p>
                Flag:{" "}
                <span
                  role='img'
                  aria-label={
                    filteredCountry[0].name.common
                  }
                  style={{ fontSize: "6rem" }}
                >
                  {filteredCountry[0].flag}
                </span>
              </p>
            </div>
          )}
        </div>
      ) : filteredCountry.length > 10 ? (
        <p>
          Too many matches, please make your query more
          specific.
        </p>
      ) : (
        <div>
          {filteredCountry.map((country, id) => (
            <div key={id}>
              <h2>
                {country.name.common}{" "}
                <button
                  onClick={() =>
                    handleShowCountryData(
                      country.name.common
                    )
                  }
                >
                  {showCountryData === country.name.common
                    ? "close"
                    : "show"}
                </button>
              </h2>

              {showCountryData === country.name.common && (
                <div>
                  <p>Capital: {country.capital}</p>
                  <p>Area: {country.area}</p>
                  <h3>Languages:</h3>

                  <ul>
                    {Object.keys(country.languages).map(
                      (language) => (
                        <li key={language}>
                          {country.languages[language]}
                        </li>
                      )
                    )}
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
