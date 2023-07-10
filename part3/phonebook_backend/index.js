const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const Person = require("./models/person");

const requestLogger = morgan(function (tokens, request, response) {
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    tokens["response-time"](request, response),
    "ms",
    JSON.stringify(request.body),
  ].join(" ");
});

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.use(requestLogger);

let persons = [];

// Define API route for getting all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Define API route for getting a single person by ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end();
    })
    .catch((error) => next(error));
});

// Define info route for finding record length

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const currentTime = new Date().toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      });

      const htmlResponse = `<h3>This phonebook has info for ${count} people</h3><p>${currentTime}</p>`;
      response.send(htmlResponse);
    })
    .catch((error) => next(error));
});

// Define delete route for removing a person by ID
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .exec()
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Define post route for adding a new person
app.post("/api/persons/", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number || undefined) {
    response.status(400).json({
      error: "Name & Number are mandatory",
    });
    return;
  }

  const existingPerson = persons.find(
    (person) => person.name === name
  );

  if (existingPerson) {
    response.status(400).json({
      error: "name must be unique",
    });
    return;
  }

  const person = new Person({
    name,
    number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndPoint);

//Define error handler middleware
// Define error handler middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  console.error(error.stack);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    // Mongoose validation error
    const errorMessage = error.message;
    return response.status(400).send({ error: errorMessage });
  }

  next(error);
};
app.use(errorHandler);

//Connecting to the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
