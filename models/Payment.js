var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
  userID: String,
  fullname: String,
  idNumber: String,
  phone: String,
  email: String,
  amount: Number,
  description: String,
  date: Date,
  payDate: Date,
  payed: {
    type: Boolean,
    default: false,
  },
  track_id: String,
  classList: [Object],
  discount: Number,
  planType: {
    type: String,
    default: 'free', // 'forever', 'month', 'year', 'semester', 'free'
  },
  expirationDate: {
    type: String,
    default: new Date(),
  },
});

var Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;