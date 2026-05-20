const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const logger = morgan((tokens, request, response) => {
  morgan.token('post', (request, response) => {
    if (request.method === 'POST') {
      return JSON.stringify(request.body);
    }
  });

  return [
    tokens.method(request, response),
    tokens.url(request, response),
    (tokens.status(request, response)),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](response, request), 'ms',
    tokens.post(request, response),
  ].join(' ');
});

app.use(logger);

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

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve("dist/index.html"));
// });

app.get('/', (request, response) => {
  response.send('<h1>/Hello there<h1>');
});

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

function hasName(name) {
  return !!persons.find(p => p.name === name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const id = String(Math.floor(Math.random() * 100000));

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'Name or Number fields are not present in body.'
    });
  }

  if (hasName(body.name)) {
    return response.status(404).json({
      error: 'This person already exists!'
    });
  }

  const person = {
    id,
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`);
});