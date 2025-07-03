const express = require('express');
const cors = require('cors');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');

const app = express();

// Simplified CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  next();
});

// Routes
app.use('/rooms', roomsRouter);
app.use('/bookings', bookingsRouter);

// Email endpoint
app.post('/email', (req, res) => {
  console.log('Email endpoint called:', req.body);
  res.json({ message: 'Email endpoint called' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});