const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost/Meeting-Room-Booking-System/php/rooms.php');
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching rooms:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;