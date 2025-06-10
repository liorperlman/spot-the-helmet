from flask import Flask, request, jsonify
from detect import detect_helmets
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_image():
    try:
        data = request.json
        image_path = data.get('imagePath')
        
        if not image_path:
            logger.error('No image path provided')
            return jsonify({'error': 'No image path provided'}), 400
        
        if not os.path.exists(image_path):
            logger.error(f'File not found: {image_path}')
            return jsonify({'error': f'File not found: {image_path}'}), 404
            
        logger.info(f'Processing image: {image_path}')
        results = detect_helmets(image_path)
        logger.info(f'Processing complete: {results}')
        
        # Verify the annotated image exists
        if not os.path.exists(results['annotated_image_path']):
            logger.error(f'Annotated image not found: {results["annotated_image_path"]}')
            return jsonify({'error': 'Failed to generate annotated image'}), 500
            
        return jsonify(results)
    except Exception as e:
        logger.error(f'Error processing image: {str(e)}', exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
