const mongoose = require('mongoose')

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Contact name is required'],
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 10,
        validate: {
            validator(value) {
                return /^(09-\d{8}|\d{3}[-\s]?\d{3}[-\s]?\d{4}|\d{10})$/.test(
                    value,
                )
            },
            message: (props) => `not a valid phone number ${props.value}`,
        },
        required: [true, 'User phone number required'],
    },
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

// Person.find({}).then((result) => {
//   console.log("phonebook:");
//   result.forEach((person) => {
//     console.log(person.name, " - ", person.number);
//   });
//   mongoose.connection.close();
// });

// person.save().then((result) => {
//   console.log(
//     `Added ${process.argv[3]} to the database with number ${process.argv[4]}`
//   );
//   mongoose.connection.close();
// });
// const person = new Person({ persons });

const Person = mongoose.model('Person', phonebookSchema)

module.exports = Person
