const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ Helmet Detection API is live');
});

module.exports = app;
