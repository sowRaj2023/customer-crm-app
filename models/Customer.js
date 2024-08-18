// models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  organization: { type: String }
});

module.exports = mongoose.model('Customer', CustomerSchema);

