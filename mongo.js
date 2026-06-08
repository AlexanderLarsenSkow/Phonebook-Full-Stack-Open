const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as argument!');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://phone_dev:${password}@phonebookcluster.lccgkwn.mongodb.net/phonebook?appName=phonebookCluster`

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

async function createPerson(name, number) {
  const newPerson = new Person({ name, number });

  await newPerson.save();
  console.log(`added ${name} number ${number} to phonebook!`);

  mongoose.connection.close();
}

async function getPersons() {
  const persons = await Person.find({});

  function logPerson({ name, number }) {
    console.log(name, number);
  }

  console.log('Phonebook:');
  persons.forEach(logPerson);
  mongoose.connection.close();
}

async function runApp() {
  const args = process.argv;
  const [name, number] = [args[3], args[4]];

  if (name && number) {
    await createPerson(name, number);
  } else {
    await getPersons();
  }
}

runApp();