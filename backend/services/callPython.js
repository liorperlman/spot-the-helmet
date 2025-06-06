// backend/services/callPython.js

const { spawn } = require('child_process');
const path = require('path');

/**
 * Calls the Python script to process the image and detect helmets.
 * @param {string} imagePath - Path to the uploaded image file.
 * @returns {Promise<Object>} - JSON metadata with detection results.
 */
function callPythonProcessor(imagePath) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = 'python3';
    const scriptPath = path.resolve(__dirname, '../../processor/detect.py');

    const subprocess = spawn(pythonExecutable, [scriptPath, imagePath]);

    let stdout = '';
    let stderr = '';

    subprocess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    subprocess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    subprocess.on('close', (code) => {
      if (code === 0) {
        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed);
        } catch (err) {
          reject(`Invalid JSON output: ${err.message}`);
        }
      } else {
        reject(`Python process exited with code ${code}: ${stderr}`);
      }
    });
  });
}

module.exports = { callPythonProcessor };
