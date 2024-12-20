

const express = require('express');
const ConnectToMongo = require('./db');
const cors = require('cors');

// Connect to MongoDB
ConnectToMongo();

const app = express();
const port = 3000;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'auth-token', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));


// Use express.json() specifically for /api/admin and skip for multipart routes
app.use('/api/admin', express.json(), require('./routes/admin'));

// Define /api/student route for file uploads (without express.json())
app.use('/api/student', express.json(), require('./routes/student'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
