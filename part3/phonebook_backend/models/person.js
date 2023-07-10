const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting....");

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB ✅");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  //_id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) =>
        `${props.value} must be a 10 digit phone number!`,
    },
    required: [true, "User phone number required"],
  },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

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
//const person = new Person({ persons });

module.exports = mongoose.model("Person", phonebookSchema);
