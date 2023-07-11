const personsRouter = require('express').Router()
const Person = require('../models/person')

const persons = [];

// Define API route for getting all persons
personsRouter.get('/', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

// Define API route for getting a single person by ID
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end();
    })
    .catch((error) => next(error));
});

// Define info route for finding record length
personsRouter.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const currentTime = new Date().toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      });

      const htmlResponse = `<h3>This phonebook has info for ${count} people</h3><p>${currentTime}</p>`;
      response.send(htmlResponse);
    })
    .catch((error) => next(error));
});

// Define delete route for removing a person by ID
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .exec()
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Define post route for adding a new person
personsRouter.post('/', (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number || undefined) {
    response.status(400).json({
      error: 'Name & Number are mandatory',
    });
    return;
  }

  const existingPerson = persons.find((person) => person.name === name);

  if (existingPerson) {
    response.status(400).json({
      error: 'name must be unique',
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

module.exports = personsRouter;