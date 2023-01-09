const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

mongoose.set('strictQuery', true);
mongoose.connect(connectionString, { connectTimeoutMS: 4000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));