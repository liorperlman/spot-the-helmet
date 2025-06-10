import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = ({ onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
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
      // Get file extension from original filename
      const ext = image.name.split('.').pop();
      const nameWithoutExt = image.name.slice(0, image.name.lastIndexOf('.'));
      const annotatedImageUrl = `http://localhost:5000/detections/${nameWithoutExt}-result.${ext}`;
      onUploadComplete(annotatedImageUrl, res.data);
    } catch (err) {
      setError('Upload failed. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '300px' }} />}
      <button onClick={handleUpload} disabled={!image || loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUploader;
