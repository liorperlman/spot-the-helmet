import React from 'react';

const ResultViewer = ({ previewUrl, results }) => {
  if (!previewUrl || !results) return null;

  return (
    <div>
      <h3>Detection Results</h3>
      <img src={previewUrl} alt="Processed" style={{ width: '300px' }} />
      <ul>
        {results.people?.map((p, idx) => (
          <li key={idx}>
            Person #{idx + 1} – Confidence: {p.confidence}
          </li>
        ))}
      </ul>
      <ul>
        {results.helmets?.map((h, idx) => (
          <li key={idx}>
            Helmet #{idx + 1} – Confidence: {h.confidence}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultViewer;
