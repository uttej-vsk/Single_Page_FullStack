import React from 'react';

function PersonForm({ newName, newPhoneNumber, setNewName, setNewPhoneNumber, handleAddContact }) {
  const handleInputNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleInputNumberChange = (event) => {
    setNewPhoneNumber(event.target.value);
  };

  return (
    <form onSubmit={handleAddContact}>
      <div>
        <div>
          Name: <input onChange={handleInputNameChange} value={newName} />
        </div>

        <div>
          Number: <input onChange={handleInputNumberChange} value={newPhoneNumber} />
        </div>

        <div>
          <button type="submit">Add</button>
        </div>
      </div>
    </form>
  );
}

export default PersonForm;
