// 🔧 FIXED App.js - src/App.js
import React, { useState } from 'react';

function App() {
  const [files, setFiles] = useState([]);
  
  // ✅ FIX: Fehlende State-Variablen hinzugefügt
  const [currentProject, setCurrentProject] = useState({
    id: 'default-project',
    name: 'EVIDENRA Ultimate Projekt',
    documents: [],
    categories: [],
    codings: [],
    patterns: [],
    interpretations: [],
    researchQuestions: [],
    teamResults: [],
    interRaterReliability: null,
    methodology: null,
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  });

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
    
    // Update currentProject with new documents
    const newDocuments = newFiles.map((file, index) => ({
      id: `doc_${Date.now()}_${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      content: '', // Will be filled when file is read
      wordCount: 0,
      uploaded: new Date().toISOString()
    }));
    
    setCurrentProject(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
      updated: new Date().toISOString()
    }));
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
        <div style={{
          fontSize: '14px',
          opacity: 0.8,
          marginTop: '10px'
        }}>
          Projekt: {currentProject.name} | Dokumente: {currentProject.documents.length}
        </div>
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
              accept=".txt,.pdf,.docx"
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

        {/* Projekt-Status */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px'
        }}>
          <h3>📊 Projekt-Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentProject.documents.length}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Dokumente</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentProject.categories.length}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Kategorien</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentProject.codings?.length || 0}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Kodierungen</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentProject.teamResults?.length || 0}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Team-Mitglieder</div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        opacity: 0.7
      }}>
        <p>✅ GitHub Pages Deployment erfolgreich!</p>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>
          Letztes Update: {new Date(currentProject.updated).toLocaleString('de-DE')}
        </p>
      </footer>
    </div>
  );
}

export default App;
