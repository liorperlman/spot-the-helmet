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
    <div style={{ padding: '2rem' }}>
      <h1>Spot the Helmet!</h1>
      <ImageUploader onUploadComplete={handleUploadComplete} />
      <ResultViewer previewUrl={previewUrl} results={results} />
    </div>
  );
}

export default App;