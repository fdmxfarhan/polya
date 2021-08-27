var mongoose = require('mongoose');

var ClassSchema = new mongoose.Schema({
  userID: String,
  creator: String,
  title: String,
  icon: String,
  decks: [Object],
  createDate: Date,

});

var Class = mongoose.model('Class', ClassSchema);

module.exports = Class;


