const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: String,
  done: String,
  projectId: String
});


module.exports = mongoose.model('Task', taskSchema);