require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const PersonModel = require('./models/person');
const { fileURLToPath } = require('url');

console.log(path.join(__dirname, 'dist', 'index.html'));

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

app.get('/', (request, response) => {
  response.send('<h1>/Hello there<h1>');
});

async function getPersons() {
  return await PersonModel.find({});
}

app.get('/info', async (request, response) => {
  const persons = await getPersons();

  let personsInfo = `<p>Phonebook has info for ${persons.length} people</p>`;
  let date = `<p>${new Date()}</p>`;

  response.send(`<div>${personsInfo}\n${date}</div>`);
});

app.get('/api/persons', async (request, response) => {
  const persons = await getPersons();
  response.json(persons);
});

async function getPerson(id) {
  return await PersonModel.findById(id);
}

app.get('/api/persons/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const person = await getPerson(id);
    response.json(person);
  } catch(e) {
    response.status(404).end();
  }
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`);
});