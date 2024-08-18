require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create table
db.run('CREATE TABLE IF NOT EXISTS customers (name TEXT, phone TEXT, email TEXT, address TEXT, organization TEXT)');

// API route to store customer data
app.post('/api/customers', (req, res) => {
  const { name, phone, email, address, organization } = req.body;
  const query = `INSERT INTO customers (name, phone, email, address, organization) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, phone, email, address, organization], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error inserting customer data' });
    }
    res.json({ id: this.lastID, name, phone, email, address, organization });
  });
});

// CRM Integration with Pipedrive
app.post('/api/push-crm', async (req, res) => {
  const customer = req.body;

  try {
    // Use the API key from environment variables
    const pipedriveApiKey = process.env.PIPEDRIVE_API_KEY;

    // Pipedrive API endpoint for creating a deal
    const pipedriveApiUrl = `https://api.pipedrive.com/v1/deals?api_token=${pipedriveApiKey}`;

    // Create a deal in Pipedrive
    const response = await axios.post(pipedriveApiUrl, {
      title: customer.name,
      value: 1000, // Example value
      person_id: null, // Example person ID
      organization_id: null // Example organization ID
    });

    // Respond with success
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending data to Pipedrive:', error);
    res.status(500).json({ success: false, message: 'Error pushing data to Pipedrive' });
  }
});

// Add root route
app.get('/', (req, res) => {
  res.send('Welcome to the API server!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

