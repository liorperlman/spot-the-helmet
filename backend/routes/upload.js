const express = require('express');
const multer = require('multer');
const path = require('path');
const { callPythonProcessor } = require('../services/callPython');

const router = express.Router();

// Configure multer for saving files to /shared/uploads
const upload = multer({
  dest: path.join(__dirname, '../../shared/uploads'),
});

// @route   POST /api/upload
// @desc    Upload image and process it using Python
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  try {
    const result = await callPythonProcessor(req.file.path);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Processing failed:', err);
    return res.status(500).json({ error: 'Image processing failed.' });
  }
});

module.exports = router;
