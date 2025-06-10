const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the detections folder
app.use('/detections', express.static('/shared/uploads/detections'));

// Routes
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ Helmet Detection API is live');
});

module.exports = app;
