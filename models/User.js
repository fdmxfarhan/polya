var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  school: String,
  username: String,
  email: String,
  idNumber: String,
  ipAddress: String,
  phone: String,
  education: String,
  fullname: String,
  password: String,
  role: String,
  card: Number,
  sex: String,
  file: {
    type: [Object],
    default: []
  },
  avatar: Number,
  classes: {
    type: Object,
    default: {},
  },
  classesID: {
    type: [String],
    default: [],
  },
  planType: {
    type: String,
    default: 'free', // 'forever', 'month', 'year', 'semester', 'free'
  },
  expirationDate: {
    type: Number,
    default: Date.now(),
  },
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
