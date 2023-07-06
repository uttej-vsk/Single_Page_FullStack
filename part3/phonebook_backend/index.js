const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

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

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//define API route for persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//define API route for single entry of persons
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

//define info route
app.get("/info", (request, response) => {
  let info = persons.length;

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

  const htmlResponse = `<h3>This phonebook has info for ${info} people</h3><p>${currentTime}</p>`;

  response.send(htmlResponse);
});

//delete route
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

function generateId() {
  const maxId =
    persons.length > 0
      ? Math.max(...persons.map((person) => person.id)) + 1
      : 0;
  return maxId;
}

app.post("/api/persons/", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
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

  const person = {
    id: generateId(),
    name,
    number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.use(unknownEndPoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
