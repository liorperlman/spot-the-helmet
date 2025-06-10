import React from 'react';

const ResultViewer = ({ previewUrl, results }) => {
  if (!previewUrl || !results) return null;

  return (
    <div>
      <h3>Detection Results</h3>
      <img src={previewUrl} alt="Processed" style={{ width: '300px' }} />
      <div>
        <h4>Summary</h4>
        <p>Total Detections: {results.total_detections}</p>
        <p>Helmets Detected: {results.helmet_count}</p>
        <p>No Helmets Detected: {results.no_helmet_count}</p>
      </div>
      {results.detections.length > 0 && (
        <div>
          <h4>Detailed Detections</h4>
          <ul>
            {results.detections.map((detection, idx) => (
              <li key={idx}>
                {detection.label} - Confidence: {detection.confidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultViewer;
