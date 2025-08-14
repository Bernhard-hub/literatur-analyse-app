import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, CheckCircle, AlertCircle, 
  Loader2, Target, TrendingUp, 
  FileText, Lightbulb, Award, 
  Sparkles, Upload, Key, ExternalLink,
  Trash2, Download, BarChart3, BookOpen, 
  PieChart, FileDown, 
  ChevronDown, ChevronUp,
  UserPlus, Users, Crown, UserCheck, Send,
  Menu, X, Zap, Star, Rocket
} from 'lucide-react';

// Vereinfachte Datenmodelle
const createProject = (name) => ({
  id: Date.now().toString(),
  name,
  documents: [],
  categories: [],
  researchQuestions: [],
  codings: [],
  patterns: [],
  insights: [],
  created: new Date().toISOString(),
  status: 'initializing'
});

const createDocument = (name, content) => ({
  id: Date.now().toString() + Math.random(),
  name,
  content,
  wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
  created: new Date().toISOString(),
  status: 'processed'
});

// Status-Helper
const getStatusText = (status) => {
  switch (status) {
    case 'initializing': return 'Initialisiert...';
    case 'ready': return 'Bereit für Analyse';
    case 'analyzing': return 'Analysiert...';
    case 'completed': return 'Analyse abgeschlossen';
    case 'error': return 'Fehler aufgetreten';
    default: return 'Unbekannt';
  }
};

// Hauptkomponente
const EVIDENRAUltimate = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Projekt initialisieren
  useEffect(() => {
    const project = createProject("EVIDENRA Ultimate Projekt");
    setCurrentProject(project);
    
    setTimeout(() => {
      setCurrentProject(prev => ({
        ...prev,
        status: 'ready'
      }));
    }, 1000);
  }, []);

  // Einfacher Datei-Upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentProject) return;

    setUploadStatus('Lade Dateien hoch...');
    setUploadProgress(0);
    
    const newDocuments = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        setUploadStatus(`Verarbeite: ${file.name} (${i + 1}/${totalFiles})`);
        setUploadProgress(((i + 1) / totalFiles) * 100);
        
        let content = '';
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          content = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsText(file);
          });
        } else {
          content = `Datei: ${file.name} (${file.type})`;
        }

        if (content.trim().length > 0) {
          const doc = createDocument(file.name, content);
          newDocuments.push(doc);
        }
      } catch (error) {
        console.error('Datei-Verarbeitungs-Fehler:', error);
      }
    }

    if (newDocuments.length > 0) {
      setCurrentProject(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments],
        status: prev.documents.length === 0 ? 'ready' : prev.status
      }));
      
      setUploadStatus(`✅ ${newDocuments.length} Datei(en) erfolgreich hinzugefügt!`);
      
      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 3000);
    }

    e.target.value = '';
  };

  // Delete Document
  const deleteDocument = (docId) => {
    if (window.confirm('Dokument wirklich löschen?')) {
      setCurrentProject(prev => ({
        ...prev,
        documents: prev.documents.filter(d => d.id !== docId)
      }));
    }
  };

  // Tabs Configuration
  const tabs = [
    { 
      id: 'overview', 
      label: 'Übersicht', 
      icon: Rocket,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Projektstart & Schnellzugang'
    },
    { 
      id: 'documents', 
      label: 'Dokumente', 
      icon: FileText,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Upload & Verwaltung'
    },
    { 
      id: 'research', 
      label: 'Forschung', 
      icon: Target,
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Fragen & Hypothesen'
    },
    { 
      id: 'categories', 
      label: 'Kategorien', 
      icon: Lightbulb,
      gradient: 'from-orange-500 to-red-500',
      description: 'Klassifikationssystem'
    },
    { 
      id: 'report', 
      label: 'Bericht', 
      icon: BarChart3,
      gradient: 'from-violet-500 to-purple-500',
      description: 'Wissenschaftliche Ergebnisse'
    }
  ];

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Brain className="w-20 h-20 text-white mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 mx-auto">
              <div className="w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EVIDENRA Ultimate v3.1
          </h2>
          <p className="text-purple-200 animate-pulse">Wissenschaftliche Integration wird initialisiert...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50 animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Brain className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    EVIDENRA Ultimate
                  </span>
                  <span className="ml-3 text-2xl font-light text-blue-100">v3.1</span>
                </h1>
                <p className="text-lg text-blue-100/90 font-medium">
                  Wissenschaftliche KI-Integration • Team-Kollaboration • Narrative Synthese
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-green-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Claude Max Integration
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <Star className="w-4 h-4" />
                    Professional Research Tool
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-6 py-3">
                <div className="text-right">
                  <div className="text-sm text-blue-100">Aktuelles Projekt</div>
                  <div className="font-semibold text-white">{currentProject.name}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Status Banner */}
        {uploadStatus && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-blue-800 font-medium">{uploadStatus}</p>
              </div>
              {uploadProgress > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: uploadProgress + '%' }}
                    />
                  </div>
                  <span className="text-blue-600 text-sm font-semibold">{Math.round(uploadProgress)}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: FileText, value: currentProject.documents.length, label: "Dokumente", gradient: "from-blue-500 to-cyan-500", bgGradient: "from-blue-50 to-cyan-50" },
            { icon: Target, value: currentProject.researchQuestions.length, label: "Fragen", gradient: "from-green-500 to-emerald-500", bgGradient: "from-green-50 to-emerald-50" },
            { icon: Lightbulb, value: currentProject.categories.length, label: "Kategorien", gradient: "from-orange-500 to-red-500", bgGradient: "from-orange-50 to-red-50" },
            { icon: Brain, value: currentProject.codings?.length || 0, label: "Kodierungen", gradient: "from-purple-500 to-pink-500", bgGradient: "from-purple-50 to-pink-50" },
            { icon: Users, value: 0, label: "Team", gradient: "from-teal-500 to-cyan-500", bgGradient: "from-teal-50 to-cyan-50" },
            { icon: Award, value: (currentProject.documents.reduce((sum, doc) => sum + doc.wordCount, 0) / 1000).toFixed(1) + 'k', label: "Wörter", gradient: "from-indigo-500 to-purple-500", bgGradient: "from-indigo-50 to-purple-50" }
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-4 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center gap-3 px-6 py-4 min-w-max font-medium text-sm transition-all duration-300 relative ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} shadow-lg`}></div>
                    )}
                    
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-200/50 group-hover:bg-gray-200'
                      }`}>
                        <tab.icon className={`w-4 h-4 transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                        }`} />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        {isActive && (
                          <div className="text-xs text-white/80">{tab.description}</div>
                        )}
                      </div>
                    </div>
                    
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-white/50 backdrop-blur-sm min-h-96">
            {activeTab === 'overview' && (
              <div className="text-center py-16">
                <div className="relative group mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                  <Brain className="relative w-24 h-24 text-gray-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 EVIDENRA Ultimate v3.1 - Vollintegration
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Wissenschaftliche qualitative Inhaltsanalyse mit eingebauter Claude API, Team-Kollaboration und narrativer Synthese
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {[
                    { icon: Upload, title: "Dokumente hochladen", desc: "TXT Support", gradient: "from-green-500 to-emerald-500", action: () => fileInputRef.current?.click() },
                    { icon: Brain, title: "KI-Vollanalyse", desc: "Automatische Kodierung", gradient: "from-purple-500 to-pink-500", action: () => alert('KI-Features kommen in Phase 2!') },
                    { icon: Users, title: "Team-Kollaboration", desc: "Inter-Rater-Reliabilität", gradient: "from-blue-500 to-cyan-500", action: () => alert('Team-Features kommen in Phase 2!') },
                    { icon: BarChart3, title: "Wissenschaftlicher Bericht", desc: "Professionelle Ergebnisse", gradient: "from-orange-500 to-red-500", action: () => setActiveTab('report') }
                  ].map((action, index) => (
                    <button 
                      key={index} 
                      onClick={action.action}
                      className="group bg-white rounded-xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">📄 Dokumente verwalten</h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    📄 Hinzufügen
                  </button>
                </div>

                {currentProject.documents.length > 0 ? (
                  <div className="space-y-4">
                    {currentProject.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{doc.name}</h4>
                              <p className="text-sm text-gray-600">
                                {doc.wordCount.toLocaleString()} Wörter • {new Date(doc.created).toLocaleDateString('de-DE')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                          {doc.content.substring(0, 300) + (doc.content.length > 300 ? '...' : '')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Dokumente</h3>
                    <p className="text-gray-600 mb-4">Laden Sie Dokumente für die wissenschaftliche Analyse hoch</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Dateien hochladen
                    </button>
                  </div>
                )}
              </div>
            )}

            {(activeTab !== 'overview' && activeTab !== 'documents') && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  {tabs.find(t => t.id === activeTab)?.icon && 
                    React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-8 h-8 text-white" })
                  }
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {tabs.find(t => t.id === activeTab)?.label} - Coming in Phase 2
                </h3>
                <p className="text-gray-600">
                  {tabs.find(t => t.id === activeTab)?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,text/plain"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default EVIDENRAUltimate;
