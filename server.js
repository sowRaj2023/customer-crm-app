const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios'); // For CRM integration
const Customer = require('./models/Customer'); // Mongoose model

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (optional)
mongoose.connect('mongodb://localhost/customerDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Route to handle customer data submission
app.post('/api/customers', (req, res) => {
  const newCustomer = new Customer(req.body);
  newCustomer.save()
    .then(customer => res.status(201).json(customer))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Route to handle CRM integration
app.post('/api/push-to-crm', (req, res) => {
  const { customerId } = req.body;

  // Fetch customer data
  Customer.findById(customerId)
    .then(customer => {
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // CRM integration logic
      axios.post('https://crm-api-url.com', customer)
        .then(response => res.status(200).json({ message: 'Data pushed to CRM successfully' }))
        .catch(err => res.status(500).json({ error: 'Failed to push data to CRM' }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Default route for root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Customer Information API');
});

// Start server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




