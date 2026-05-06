const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/info', (request, response) => {
  let personsInfo = `<p>Phonebook has info for ${persons.length} people</p>`;
  let date = `<p>${new Date()}</p>`;

  response.send(`<div>${personsInfo}\n${date}</div>`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (!person) {
    response.status(404).end();
  }

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
  }
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  const newId = String(Math.floor(Math.random() * 100000));
  person.id = newId;

  persons = persons.concat(person);
  console.log(person);
  response.status(201).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`);
});