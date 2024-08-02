const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const app = express();

// json parser
app.use(express.json());
// enables cross-origin resource sharing
app.use(cors());
// grant public access to given directory
app.use(express.static('dist'));

// custom token for logging
morgan.token('body', (request) => JSON.stringify(request.body));
// logger based on tiny config
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>
      Phonebook has info for ${persons.length} people
      <br/>
      ${date}
    </p>`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((person) => {
    response.status(204).end();
  });
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    });
  }
  // else if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique',
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
