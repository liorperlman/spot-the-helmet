import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultViewer from './components/ResultViewer';

function App() {
  const [previewUrl, setPreviewUrl] = useState('');
  const [results, setResults] = useState(null);

  const handleUploadComplete = (previewUrl, results) => {
    setPreviewUrl(previewUrl);
    setResults(results);
  };

  return (
    <div className="app-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#2c3e50',
          marginBottom: '1rem'
        }}>Spot the Helmet</h1>
        <p style={{
          color: '#666',
          fontSize: '1.1rem'
        }}>Upload an image to detect safety helmets in construction sites</p>
      </header>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        <ImageUploader onUploadComplete={handleUploadComplete} />
        <ResultViewer previewUrl={previewUrl} results={results} />
      </div>
    </div>
  );
}

export default App;