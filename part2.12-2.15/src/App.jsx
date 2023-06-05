import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebook from "./services/phonebook";

const App = () => {
	const [persons, setPersons] = useState([]);

	useEffect(() => {
		console.log("Fetching data from Server..");
		phonebook.getAll().then((initialPhoneBook) => {
			setPersons(initialPhoneBook);
		});
	}, []);

	const [newName, setNewName] = useState("");
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [searchInput, setSearchInput] = useState("");

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
			alert(`${newPersonObj.name} is already added to the phonebook`);
			setNewName("");
			setNewPhoneNumber("");
			return; // Exit the function without adding the duplicate entry
		}

		phonebook.create(newPersonObj).then((responsePerson) => {
			setPersons([...persons, responsePerson]);
			setNewName("");
			setNewPhoneNumber("");
		});
	};

	return (
		<div>
			<h2>Phonebook</h2>

			<Filter searchInput={searchInput} setSearchInput={setSearchInput} />

			<PersonForm
				newName={newName}
				newPhoneNumber={newPhoneNumber}
				setNewName={setNewName}
				setNewPhoneNumber={setNewPhoneNumber}
				handleAddContact={handleAddContact}
			/>

			<h2>Contacts</h2>

			<Persons persons={persons} searchInput={searchInput} />
		</div>
	);
};

export default App;
