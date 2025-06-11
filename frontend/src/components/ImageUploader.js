import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
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
      handleFileChange({ target: { files: [file] } });
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
            {image ? 'Change Image' : 'Drag or Click to select an image'}
          </label>
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
            transition: 'background-color 0.3s ease'
          }}
        >
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
