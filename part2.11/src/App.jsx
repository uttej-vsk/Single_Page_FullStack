import { useState, useEffect } from 'react';
import axios from 'axios'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    console.log('Fetching data from Server..')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log(response.data)
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleAddContact = (event) => {
    event.preventDefault();

    const newPersonObj = {
      name: newName,
      number: newPhoneNumber
    };

    const nameExist = persons.some((person) => person.name === newPersonObj.name);

    nameExist
      ? alert(`${newPersonObj.name} is already added to the phonebook`)
      : setPersons([...persons, newPersonObj]);

    setNewName('');
    setNewPhoneNumber('');
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

      />
    </div>
  );
};

export default App;
