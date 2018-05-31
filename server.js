const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose');
const cors = require('cors');
const key = require('./.key.js')

const app = express();


app.use(cors());

mongoose.connect(`mongodb://${key}@ds139950.mlab.com:39950/durz-todo`)
mongoose.connection.once("open", () => {
  console.log('connected to database')
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('now listening on port 4000')
})