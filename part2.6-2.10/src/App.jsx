import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);

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
