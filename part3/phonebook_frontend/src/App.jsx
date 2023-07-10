import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebook from "./services/phonebook";
import Notification from "./components/Notification";

function App() {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

    const existingPerson = persons.find(
      (person) => person.name === newPersonObj.name
    );

    if (existingPerson) {
      const updatedPersonObj = {
        ...newPersonObj,
        id: existingPerson.id,
      };

      phonebook
        .update(existingPerson.id, updatedPersonObj)
        .then((responsePerson) => {
          const updatedPersons = persons.map((person) =>
            person.id === existingPerson.id ? responsePerson : person
          );
          setPersons(updatedPersons);
          setNewName("");
          setNewPhoneNumber("");
          setSuccessMessage("Contact updated successfully");
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    } else {
      phonebook
        .create(newPersonObj)
        .then((responsePerson) => {
          setPersons([...persons, responsePerson]);
          setNewName("");
          setNewPhoneNumber("");
          setSuccessMessage("Contact Added Successfully");
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };

  const handleDeleteContact = (id) => {
    console.log(typeof id);
    phonebook
      .del(id)
      .then(() => {
        const updatedPersons = persons.filter(
          (person) => person.id !== id
        );
        setPersons(updatedPersons);
      })
      .catch((error) => {
        const deletedContact = persons.find(
          (person) => person.id === id
        );
        setErrorMessage(
          `${deletedContact.name} is already deleted in the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />

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
}

export default App;
