const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
console.log('Connecting to ', url);

async function connect() {
  try {
    await mongoose.connect(url, { family: 4 });
    console.log('Connected to MongoDB!');
  } catch(error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
  }
}

connect();

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    validate: {
      validator(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message({ value }) {
        return `${value} is not a valid phone number!`;
      }
    },
  },
});

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', PersonSchema);
module.exports = Person;
