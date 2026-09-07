import React, { useState } from 'react';
import axios from 'axios';

const EXAMPLES = [
  { name: 'demo-with-helmets-1.jpg', label: 'With helmets', src: '/examples/demo-with-helmets-1.jpg' },
  { name: 'demo-with-helmets-2.jpeg', label: 'With helmets (2)', src: '/examples/demo-with-helmets-2.jpeg' },
  { name: 'demo-no-helmet.jpg', label: 'No helmet', src: '/examples/demo-no-helmet.jpg' },
];

const ImageUploader = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (file) => {
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleFileChange = (e) => {
    selectFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      selectFile(file);
    }
  };

  const handleSelectExample = async (example) => {
    try {
      const res = await fetch(example.src);
      const blob = await res.blob();
      selectFile(new File([blob], example.name, { type: blob.type }));
    } catch (err) {
      setError('Could not load example image.');
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const ext = image.name.split('.').pop();
      const nameWithoutExt = image.name.slice(0, image.name.lastIndexOf('.'));
      const annotatedImageUrl = `http://localhost:5000/detections/${nameWithoutExt}-result.${ext}`;
      onUploadComplete(annotatedImageUrl, res.data);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        marginBottom: '1.5rem',
        color: '#2c3e50',
        fontSize: '1.5rem'
      }}>Upload Image</h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? '#3498db' : '#ccc'}`,
            borderRadius: '4px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease'
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label
            htmlFor="file-input"
            style={{
              cursor: 'pointer',
              display: 'block',
              color: '#666'
            }}
          >
            {image ? 'Change Image' : 'Drag and drop an image here, or click to select'}
          </label>
        </div>

        <div>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>
            No image handy? Try an example:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {EXAMPLES.map((example) => (
              <button
                key={example.name}
                type="button"
                onClick={() => handleSelectExample(example)}
                title={example.label}
                aria-label={example.label}
                style={{
                  padding: 0,
                  width: '64px',
                  height: '64px',
                  border: '2px solid transparent',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'none'
                }}
              >
                <img
                  src={example.src}
                  alt={example.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        </div>

        {previewUrl && (
          <div style={{
            textAlign: 'center'
          }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!image || loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: image ? '#3498db' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: image ? 'pointer' : 'not-allowed',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? 'Processing...' : 'Analyze Image'}
        </button>

        {error && (
          <p style={{
            color: '#e74c3c',
            margin: '0.5rem 0',
            fontSize: '0.9rem'
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
