import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebook from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    console.log("Fetching data from Server..");
    phonebook.getAll().then((initialPhoneBook) => {
      setPersons(initialPhoneBook);
    });
  }, []);

  const handleAddContact = (event) => {
    event.preventDefault();

    const newPersonObj = {
      name: newName,
      number: newPhoneNumber,
    };

    const nameExists = persons.some(
      (person) => person.name === newPersonObj.name
    );

    if (nameExists) {
      alert(
        `${newPersonObj.name} is already added to the phonebook`
      );

      setNewName("");
      setNewPhoneNumber("");

      return; // Exit the function without adding the duplicate entry
    }

    phonebook
      .create(newPersonObj)
      .then((responsePerson) => {
        setPersons([...persons, responsePerson]);
        setNewName("");
        setNewPhoneNumber("");
      });
  };

  const handleDeleteContact = (id) => {
    phonebook.del(id).then(() => {
      const updatedPersons = persons.filter(
        (person) => person.id !== id
      );
      setPersons(updatedPersons);
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      <PersonForm
        newName={newName}
        newPhoneNumber={newPhoneNumber}
        setNewName={setNewName}
        setNewPhoneNumber={setNewPhoneNumber}
        handleAddContact={handleAddContact}
      />

      <h2>Contacts</h2>

      <Persons
        persons={persons}
        searchInput={searchInput}
        handleDeleteContact={handleDeleteContact}
      />
    </div>
  );
};

export default App;
