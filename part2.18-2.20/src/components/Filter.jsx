import React from "react";

function Filter({ setSearchInput }) {
  function handleSearchContact(event) {
    setSearchInput(event.target.value);
  }

  return (
    <div>
      <form onChange={handleSearchContact} role='search'>
        <div>
          <label htmlFor='search-country-name'>
            Find Countries
          </label>
          <input
            type='search'
            id='search-country-name'
            name='search-input'
            placeholder='search here'
          />
        </div>
      </form>
    </div>
  );
}
export default Filter;
