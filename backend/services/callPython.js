const axios = require('axios');

/**
 * Calls the Python script to process the image and detect helmets.
 * @param {string} imagePath - Path to the uploaded image file.
 * @returns {Promise<Object>} - JSON metadata with detection results.
 */
async function callPythonProcessor(imagePath) {
  try {
    // Send request to processor service
    const response = await axios.post('http://processor:5001/process', {
      imagePath: imagePath
    });
    return response.data;
  } catch (error) {
    console.error('Error calling processor service:', error);
    throw error;
  }
}

module.exports = { callPythonProcessor };
