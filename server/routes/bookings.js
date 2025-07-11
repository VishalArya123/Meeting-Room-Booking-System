const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Received request for user_id:', req.query.user_id);
    const user_id = req.query.user_id;
    const url = user_id
      ? `http://localhost/Meeting-Room-Booking-System/php/bookings.php?user_id=${user_id}`
      : 'http://localhost/Meeting-Room-Booking-System/php/bookings.php';
    
    console.log('Forwarding to:', url);
    const response = await axios.get(url);
    
    console.log('Received from PHP:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    
    const response = await axios.post(
      'http://localhost/Meeting-Room-Booking-System/php/bookings.php', 
      req.body, 
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('PHP response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('Full error:', err);
    console.error('Error response data:', err.response?.data);
    res.status(500).json({ 
      error: err.response?.data?.error || err.message,
      details: err.response?.data
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(
      `http://localhost/Meeting-Room-Booking-System/php/bookings.php?id=${req.params.id}`
    );
    res.json(response.data);
  } catch (err) {
    console.error('Error deleting booking:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;