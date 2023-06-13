import React from "react";

function Country({ countries, searchInput }) {
  const filteredCountry = countries.filter((country) =>
    country.name.common
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  return (
    <div>
      {searchInput.length === 0 ? (
        <p>Enter something.</p>
      ) : filteredCountry.length === 1 ? (
        <div>
          <h2>{filteredCountry[0].name.common}</h2>
          <p>Capital: {filteredCountry[0].capital}</p>
          <p>Area: {filteredCountry[0].area}</p>
          <p>Flag: {filteredCountry[0].flag}</p>
          <h3>Languages:</h3>
          <ul>
            {Object.keys(filteredCountry[0].languages).map(
              (language) => (
                <li key={language}>
                  {filteredCountry[0].languages[language]}
                </li>
              )
            )}
          </ul>
        </div>
      ) : filteredCountry.length > 10 ? (
        <p>
          Too many matches, please make your query more
          specific.
        </p>
      ) : (
        <div>
          {filteredCountry.map((country) => (
            <div key={country.name.common}>
              <h2>{country.name.common}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Country;
