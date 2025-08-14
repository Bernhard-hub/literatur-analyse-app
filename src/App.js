import React, { useState } from 'react';

function App() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🧠 EVIDENRA Ultimate v3.1
        </h1>
        <p style={{
          fontSize: '20px',
          margin: '10px 0',
          opacity: 0.9
        }}>
          Wissenschaftliche Literaturanalyse
        </p>
      </header>

      <main style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>📄 Dokumente hochladen</h2>
          
          <label style={{
            display: 'inline-block',
            background: '#10B981',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            📁 Dateien auswählen
            <input
              type="file"
              multiple
              accept=".txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {files.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '20px',
            borderRadius: '15px'
          }}>
            <h3>📚 Hochgeladene Dateien ({files.length})</h3>
            {files.map((file, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px'
              }}>
                📄 {file.name} ({Math.round(file.size/1024)} KB)
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {['🧠 KI-Analyse', '👥 Team-Kollaboration', '📊 Berichte', '📖 Synthese'].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                {feature.split(' ')[0]}
              </div>
              <div>{feature.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        opacity: 0.7
      }}>
        <p>✅ GitHub Pages Deployment Test erfolgreich!</p>
      </footer>
    </div>
  );
}

export default App;
