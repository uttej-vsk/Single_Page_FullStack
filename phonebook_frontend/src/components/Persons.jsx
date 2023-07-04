import React from "react";

function Persons({
  persons,
  searchInput,
  handleDeleteContact,
}) {
  const filteredContacts = persons.filter((person) =>
    person.name
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  );

  const handleDelete = (id) => {
    handleDeleteContact(id);
  };

  return (
    <div>
      {filteredContacts.map((person) => (
        <div key={person.id}>
          <div>
            {person.name} {person.number}{" "}
            <button onClick={() => handleDelete(person.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Persons;
