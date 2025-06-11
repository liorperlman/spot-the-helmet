import React from 'react';

const ResultViewer = ({ previewUrl, results }) => {
  if (!previewUrl || !results) return null;

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
      }}>Detection Results</h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <img
            src={previewUrl}
            alt="Processed"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{
            color: '#2c3e50',
            marginBottom: '1rem',
            fontSize: '1.2rem'
          }}>Summary</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Total</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                {results.total_detections}
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>With Helmet</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                {results.helmet_count}
              </div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#ffebee',
              borderRadius: '4px'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>Without Helmet</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>
                {results.no_helmet_count}
              </div>
            </div>
          </div>
        </div>

        {results.detections.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>Detailed Detections</h3>
            
            <div style={{
              display: 'grid',
              gap: '0.5rem'
            }}>
              {results.detections.map((detection, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ color: '#2c3e50' }}>{detection.label}</span>
                  <span style={{
                    backgroundColor: '#e3f2fd',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: '#1976d2'
                  }}>
                    {Math.round(detection.confidence * 100)}% confidence
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultViewer;
