import React from 'react';

function Filter({ search, setSearchInput }) {
  function handleSearchContact(event) {
    setSearchInput(event.target.value);
  }

  return (
    <form onChange={handleSearchContact} role="search">
      <div>
        <label htmlFor="search-phone-book">Search Phonebook</label>
        <input type="search" id="search-phone-book" name="search-input" placeholder="search this phonebook.." />
      </div>
    </form>
  );
}

export default Filter;
