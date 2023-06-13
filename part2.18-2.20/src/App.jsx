import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import phonebook from "./services/phonebook.jsx";
import Country from "./components/Country";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    console.log("Fetching data from Server..");
    phonebook.getAll().then((initialCountry) => {
      setCountries(initialCountry);
    });
  }, []);

  return (
    <div>
      <Filter setSearchInput={setSearchInput} />
      <Country
        countries={countries}
        searchInput={searchInput}
      />
    </div>
  );
}

export default App;
