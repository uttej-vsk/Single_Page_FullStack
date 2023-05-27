import React from 'react';

function Persons({ persons, searchInput }) {
  const filteredContacts = persons.filter((person) =>
    person.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      {filteredContacts.map((person) => (
        <div key={person.id}>
          <div>
            {person.name} {person.number}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Persons;
