const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const eventsRouter = require('./routes/events');

// Middleware to parse JSON requests
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Event Locator API!');
});

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRouter);

// Start the server
app.listen(5000, () => console.log('✅ Server running on port 5000'));

// Database connection
require("./db");
