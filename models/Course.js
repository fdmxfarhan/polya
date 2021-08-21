var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  price: Number, // Rial
  off: Number, //percent
  title: String, 
  description: Text,
  teacher: String,
  startDate: Date,
  session: Number,
  requiredCourse: [Object],
  requiredTools: [Object],
  minAge: Number,
  maxAge: Number,
  status: String,
  capacity: Number,
  
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;


