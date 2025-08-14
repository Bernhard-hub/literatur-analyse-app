import React, { useState } from 'react';

const App = () => {
  const [message, setMessage] = useState('EVIDENRA Ultimate v3.1 lädt...');
  const [documents, setDocuments] = useState([]);

  React.useEffect(() => {
    setTimeout(() => {
      setMessage('✅ EVIDENRA Ultimate v3.1 erfolgreich geladen!');
    }, 1000);
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899)',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          margin: '0',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🧠 EVIDENRA Ultimate v3.1
        </h1>
        <p style={{
          fontSize: '1.2rem',
          margin: '0.5rem 0 0 0',
          opacity: 0.9
        }}>
          Wissenschaftliche KI-gestützte Literaturanalyse
        </p>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Status */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🚀 Status</h2>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>{message}</p>
        </div>

        {/* Upload Section */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>📄 Dokumente hochladen</h2>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8 }}>
            Laden Sie TXT-Dateien für die Analyse hoch
          </p>
          
          <label style={{
            display: 'inline-block',
            background: 'linear-gradient(45deg, #10B981, #059669)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            📁 Dateien auswählen
            <input
              type="file"
              multiple
              accept=".txt,text/plain"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
              📚 Hochgeladene Dokumente ({documents.length})
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {documents.map(doc => (
                <div key={doc.id} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    📄 {doc.name}
                  </div>
                  <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    Größe: {(doc.size / 1024).toFixed(1)} KB | Typ: {doc.type || 'text/plain'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { icon: '🧠', title: 'KI-Analyse', desc: 'Automatische Kategorisierung' },
            { icon: '👥', title: 'Team-Kollaboration', desc: 'Inter-Rater-Reliabilität' },
            { icon: '📊', title: 'Wissenschaftliche Berichte', desc: 'Professionelle Ergebnisse' },
            { icon: '📖', title: 'Narrative Synthese', desc: 'Qualitative Interpretation' }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {feature.icon}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                {feature.title}
              </h3>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        opacity: 0.7,
        marginTop: '3rem'
      }}>
        <p style={{ margin: 0 }}>
          🚀 EVIDENRA Ultimate v3.1 - Phase 1: GitHub Pages Deployment Test
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
          ✅ Wenn du das siehst, funktioniert GitHub Pages!
        </p>
      </footer>
    </div>
  );
};

export default App;
