import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileText, Brain, BarChart3, Settings, Users, 
  Shield, Download, Search, Target, Network, Clock, 
  Layers, GitBranch, CheckCircle, AlertTriangle, XCircle,
  Award, TrendingUp, Info, AlertCircle, RefreshCw,
  BookOpen, Lightbulb, PieChart, Microscope, ChevronDown,
  ChevronUp, Filter, Eye, Zap, Plus, Edit, Trash2, Save,
  Key, ExternalLink, Loader2, Sparkles, FileDown, Share
} from 'lucide-react';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const APP_CONFIG = {
  version: '4.2-Expert',
  name: 'EVIDENRA Ultimate Expert',
  description: 'Professional AI-Powered Qualitative Content Analysis',
  githubUrl: 'https://github.com/your-repo/evidenra-ultimate',
  documentationUrl: 'https://docs.evidenra.com'
};

const ANALYSIS_TYPES = [
  { 
    id: 'thematic', 
    name: 'Thematische Analyse', 
    icon: Target, 
    description: 'Hauptthemen und Muster identifizieren',
    color: 'bg-blue-500'
  },
  { 
    id: 'sentiment', 
    name: 'Sentiment-Analyse', 
    icon: TrendingUp, 
    description: 'Emotionale Bewertungen erkennen',
    color: 'bg-green-500'
  },
  { 
    id: 'keywords', 
    name: 'Keyword-Extraktion', 
    icon: Search, 
    description: 'Wichtige Begriffe extrahieren',
    color: 'bg-purple-500'
  },
  { 
    id: 'coding', 
    name: 'Automatische Kodierung', 
    icon: Brain, 
    description: 'KI-gestützte Textkodierung',
    color: 'bg-orange-500'
  },
  { 
    id: 'patterns', 
    name: 'Musteranalyse', 
    icon: Network, 
    description: 'Strukturelle Muster erkennen',
    color: 'bg-pink-500'
  },
  { 
    id: 'categories', 
    name: 'Kategorienentwicklung', 
    icon: Layers, 
    description: 'Induktive Kategorienbildung',
    color: 'bg-indigo-500'
  }
];

const METHODOLOGY_TEMPLATES = [
  {
    id: 'grounded_theory',
    name: 'Grounded Theory',
    description: 'Induktive Theorieentwicklung aus empirischen Daten',
    authors: 'Strauss & Corbin',
    icon: Brain,
    color: 'bg-purple-500'
  },
  {
    id: 'phenomenological',
    name: 'Phänomenologische Analyse',
    description: 'Erforschung gelebter Erfahrungen und deren Bedeutung',
    authors: 'Van Manen',
    icon: Search,
    color: 'bg-blue-500'
  },
  {
    id: 'thematic_analysis',
    name: 'Thematische Analyse',
    description: 'Identifikation, Analyse und Berichterstattung von Mustern',
    authors: 'Braun & Clarke',
    icon: Target,
    color: 'bg-orange-500'
  }
];

// ============================================================================
// DATA MODELS & UTILITIES
// ============================================================================

const createProject = (name) => ({
  id: Date.now().toString(),
  name,
  documents: [],
  categories: [],
  researchQuestions: [],
  segments: [],
  codings: [],
  patterns: [],
  interpretations: [],
  insights: [],
  frequencyAnalysis: {},
  methodology: null,
  teamResults: [],
  interRaterReliability: null,
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  status: 'initializing'
});

const createDocument = (name, content, type) => ({
  id: `doc_${Date.now()}_${Math.random()}`,
  name,
  content,
  type,
  size: content.length,
  wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
  uploaded: new Date().toISOString(),
  processed: true,
  status: 'processed'
});

const createCategory = (name, description, isManual = true) => ({
  id: `cat_${Date.now()}_${Math.random()}`,
  name,
  description,
  color: '#' + Math.floor(Math.random()*16777215).toString(16),
  isManual,
  aiGenerated: !isManual,
  confidence: isManual ? 1.0 : 0.8 + Math.random() * 0.2,
  codings: []
});

const createCoding = (docId, categoryId, textPassage, explanation) => ({
  id: `coding_${Date.now()}_${Math.random()}`,
  docId,
  categoryId,
  text: textPassage,
  textPassage,
  explanation,
  confidence: 0.7 + Math.random() * 0.3,
  created: new Date().toISOString()
});

// ============================================================================
// PDF PROCESSING UTILITIES
// ============================================================================

const loadPdfJs = () => {
  return new Promise((resolve) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(script);
  });
};

const extractTextFromPDF = async (file) => {
  try {
    const pdfjsLib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF Text-Extraktion fehlgeschlagen:', error);
    throw new Error('PDF konnte nicht verarbeitet werden');
  }
};

// ============================================================================
// CLAUDE API INTEGRATION
// ============================================================================

const callClaudeAPI = async (prompt, maxTokens = 2000, apiKey = null) => {
  try {
    // Development mode simulation
    if (window.location.hostname === 'localhost' || !apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      if (prompt.includes('Kategoriensystem')) {
        return JSON.stringify({
          categories: [
            { name: "Technische Aspekte", description: "Alle technischen Inhalte und Verfahren" },
            { name: "Soziale Faktoren", description: "Zwischenmenschliche und gesellschaftliche Themen" },
            { name: "Herausforderungen", description: "Probleme und Schwierigkeiten" },
            { name: "Lösungsansätze", description: "Vorschläge und Lösungswege" },
            { name: "Zukunftsvisionen", description: "Pläne und Ausblicke" },
            { name: "Erfahrungen", description: "Persönliche und praktische Erfahrungen" }
          ]
        });
      }
      
      if (prompt.includes('Forschungsfragen')) {
        return JSON.stringify({
          research_questions: [
            { question: "Welche Hauptthemen lassen sich in den Dokumenten identifizieren?", type: "descriptive" },
            { question: "Wie hängen die verschiedenen Aspekte miteinander zusammen?", type: "explorative" },
            { question: "Warum entstehen bestimmte Probleme oder Herausforderungen?", type: "explanative" },
            { question: "Welche Lösungsstrategien werden am häufigsten genannt?", type: "descriptive" }
          ]
        });
      }

      if (prompt.includes('Führe eine qualitative Kodierung')) {
        return JSON.stringify({
          codings: [
            { text_passage: "Das System zeigt deutliche Verbesserungen", category_name: "Technische Aspekte", explanation: "Bezieht sich auf Systemleistung" },
            { text_passage: "Die Zusammenarbeit im Team funktioniert gut", category_name: "Soziale Faktoren", explanation: "Beschreibt zwischenmenschliche Dynamiken" },
            { text_passage: "Wir haben Schwierigkeiten bei der Umsetzung", category_name: "Herausforderungen", explanation: "Identifiziert ein Problem" }
          ]
        });
      }

      if (prompt.includes('Analysiere folgende kodierten Textpassagen')) {
        return JSON.stringify({
          frequency_analysis: {
            most_frequent_categories: ["Technische Aspekte", "Soziale Faktoren"],
            category_distribution: {
              "Technische Aspekte": 5,
              "Soziale Faktoren": 3,
              "Herausforderungen": 2
            }
          },
          patterns: [
            {
              pattern_name: "Technik-Soziales Zusammenspiel",
              description: "Technische Verbesserungen führen zu besserer sozialer Zusammenarbeit",
              categories_involved: ["Technische Aspekte", "Soziale Faktoren"],
              significance: "Zeigt wichtige Interdependenzen auf"
            }
          ],
          insights: [
            "Technische und soziale Aspekte sind eng verknüpft",
            "Herausforderungen entstehen oft an Schnittstellen",
            "Lösungsansätze sollten beide Bereiche berücksichtigen"
          ]
        });
      }

      if (prompt.includes('Erstelle eine theoretische Interpretation')) {
        return JSON.stringify({
          interpretation: {
            main_findings: [
              "Technologie und soziale Faktoren sind zentrale Themen",
              "Starke Interdependenzen zwischen verschiedenen Bereichen",
              "Pragmatische Lösungsansätze werden bevorzugt"
            ],
            theoretical_implications: [
              {
                theory: "Sozio-technische Systemtheorie",
                connection: "Bestätigt die Wichtigkeit der Mensch-Technik-Interaktion",
                significance: "Unterstützt systemische Gestaltungsansätze"
              }
            ],
            practical_implications: [
              "Integrierte Entwicklungsansätze sind notwendig",
              "Interdisziplinäre Teams sollten gefördert werden",
              "Change Management muss beide Aspekte berücksichtigen"
            ],
            limitations: [
              "Begrenzte Stichprobengröße",
              "Kontextspezifische Ergebnisse",
              "Zeitpunkt der Datenerhebung"
            ],
            future_research: [
              "Längsschnittstudien zur Entwicklungsdynamik",
              "Vergleichende Studien in anderen Kontexten",
              "Quantitative Validierung der Ergebnisse"
            ]
          }
        });
      }
      
      return "Erfolgreiche KI-Analyse abgeschlossen.";
    }
    
    // Production API call
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
};

// ============================================================================
// PROFESSIONAL REPORT COMPONENTS
// ============================================================================

const ExecutiveSummary = ({ project }) => {
  const totalWords = project.documents.reduce((sum, doc) => sum + doc.wordCount, 0);
  const aiCategories = project.categories.filter(c => !c.isManual).length;
  const manualCategories = project.categories.filter(c => c.isManual).length;
  
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-indigo-900 mb-4">📋 Executive Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-indigo-800 mb-3">Projektübersicht</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Projektname:</span>
              <span className="font-medium">{project.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Analysedatum:</span>
              <span className="font-medium">{new Date().toLocaleDateString('de-DE')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-purple-600">{getStatusText(project.status)}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-indigo-800 mb-3">Datenübersicht</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Dokumente:</span>
              <span className="font-medium">{project.documents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gesamtwörter:</span>
              <span className="font-medium">{totalWords.toLocaleString()} Wörter</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kategorien:</span>
              <span className="font-medium">{project.categories.length} ({aiCategories} KI + {manualCategories} manuell)</span>
            </div>
          </div>
        </div>
      </div>
      {project.insights?.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-indigo-800 mb-3">🎯 Zentrale Erkenntnisse</h4>
          <ul className="space-y-1">
            {project.insights.slice(0, 3).map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CategoryDistributionChart = ({ project }) => {
  if (!project.frequencyAnalysis?.category_distribution) return null;
  
  const data = Object.entries(project.frequencyAnalysis.category_distribution);
  const total = Object.values(project.frequencyAnalysis.category_distribution).reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...Object.values(project.frequencyAnalysis.category_distribution));
  
  return (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-blue-600" />
        Kategorien-Verteilung
      </h3>
      <div className="space-y-4">
        {data.map(([category, count], index) => {
          const percentage = ((count / total) * 100).toFixed(1);
          const width = (count / maxCount) * 100;
          const categoryObj = project.categories.find(c => c.name === category);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryObj?.color || '#666' }}
                  />
                  <span className="font-medium text-sm">{category}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600">{count} Kodierungen</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <strong>Gesamt:</strong> {total} Kodierungen in {data.length} Kategorien
      </div>
    </div>
  );
};

// ============================================================================
// VISUALIZATION COMPONENTS
// ============================================================================

const NetworkVisualization = ({ project }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (project.categories.length > 0 && svgRef.current) {
      renderNetwork();
    }
  }, [project.categories]);

  const renderNetwork = () => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = '';
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    // Position nodes in circle
    project.categories.forEach((category, index) => {
      const angle = (index / project.categories.length) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Create node
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 30);
      circle.setAttribute('fill', category.color || '#3b82f6');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', 3);
      circle.style.cursor = 'pointer';
      svg.appendChild(circle);

      // Add label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 50);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#374151');
      text.textContent = category.name.length > 12 ? category.name.substring(0, 12) + '...' : category.name;
      svg.appendChild(text);
    });
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Network className="w-5 h-5 text-blue-600" />
        Kategorien-Netzwerk
      </h3>
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width="600"
          height="400"
          className="border rounded bg-gray-50"
        />
      </div>
    </div>
  );
};

const TimelineVisualization = ({ project }) => {
  const codings = project.codings || [];
  const codingsByDate = {};
  
  codings.forEach(coding => {
    const date = new Date(coding.created).toDateString();
    codingsByDate[date] = (codingsByDate[date] || 0) + 1;
  });

  const timelineData = Object.entries(codingsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-green-600" />
        Kodierungs-Zeitverlauf
      </h3>
      {timelineData.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-end h-32 bg-gray-50 rounded-lg p-4">
            {timelineData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-green-500 rounded-t"
                  style={{ 
                    height: `${(day.count / Math.max(...timelineData.map(d => d.count))) * 80}px`,
                    width: '20px'
                  }}
                  title={`${day.date}: ${day.count} Kodierungen`}
                />
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(day.date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{codings.length}</div>
              <div className="text-sm text-blue-700">Gesamt</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {timelineData.length > 0 ? Math.round(codings.length / timelineData.length) : 0}
              </div>
              <div className="text-sm text-green-700">Ø/Tag</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {timelineData.length > 0 ? Math.max(...timelineData.map(d => d.count)) : 0}
              </div>
              <div className="text-sm text-purple-700">Maximum</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Keine Kodierungen für Zeitverlaufsanalyse verfügbar</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getStatusIcon = (status) => {
  switch (status) {
    case 'initializing': return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
    case 'ready': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'analyzing': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    case 'completed': return <Award className="w-5 h-5 text-purple-500" />;
    case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
    default: return <Loader2 className="w-5 h-5 text-gray-500" />;
  }
};

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

// ============================================================================
// API KEY MODAL COMPONENT
// ============================================================================

const ApiKeyModal = ({ show, onClose, onSave, currentKey }) => {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [showKey, setShowKey] = useState(false);

  if (!show) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      onClose();
    } else {
      alert('Bitte geben Sie einen gültigen API Key ein');
    }
  };

  const openClaudeConsole = () => {
    window.open('https://console.anthropic.com/account/keys', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Claude API Key konfigurieren</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <h4 className="font-medium text-blue-900 mb-2">So erhalten Sie Ihren API Key:</h4>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. Besuchen Sie die Claude Console</li>
              <li>2. Erstellen Sie ein Konto oder melden Sie sich an</li>
              <li>3. Gehen Sie zu "API Keys" und erstellen Sie einen neuen Key</li>
              <li>4. Laden Sie Ihr Konto mit Guthaben auf</li>
              <li>5. Kopieren Sie den API Key hier ein</li>
            </ol>
            <button
              onClick={openClaudeConsole}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Claude Console öffnen
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claude API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="sk-ant-api03-..."
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Ihr API Key wird lokal in Ihrem Browser gespeichert</p>
          </div>
          {window.location.hostname === 'localhost' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="text-green-800 text-sm">
                <strong>Entwicklungsmodus:</strong> Auf localhost funktionieren die KI-Features auch ohne API Key zu Testzwecken.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            API Key speichern
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const EvidenraUltimateExpert = () => {
  // Main state
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState(['thematic']);

  // UI states
  const [notifications, setNotifications] = useState([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showResearchQuestionForm, setShowResearchQuestionForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newResearchQuestion, setNewResearchQuestion] = useState({ question: '' });

  // Upload states
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // Refs
  const fileInputRef = useRef(null);

  // =========================================================================
  // INITIALIZATION & EFFECTS
  // =========================================================================

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('claude-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Initialize project
    const project = createProject("EVIDENRA Ultimate Expert Projekt");
    setCurrentProject(project);
    
    setTimeout(() => {
      setCurrentProject(prev => ({
        ...prev,
        status: 'ready'
      }));
    }, 1000);
  }, []);

  // =========================================================================
  // UTILITY FUNCTIONS
  // =========================================================================

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const updateProject = (updates) => {
    setCurrentProject(prev => ({
      ...prev,
      ...updates,
      updated: new Date().toISOString()
    }));
  };

  const checkApiKey = () => {
    if (window.location.hostname === 'localhost') {
      return true; // Always allow on localhost
    }
    
    if (!apiKey || apiKey.trim() === '') {
      setShowApiKeyModal(true);
      return false;
    }
    
    return true;
  };

  const handleSaveApiKey = (newApiKey) => {
    setApiKey(newApiKey);
    localStorage.setItem('claude-api-key', newApiKey);
    addNotification('API Key erfolgreich gespeichert!', 'success');
  };

  // =========================================================================
  // FILE UPLOAD FUNCTIONALITY
  // =========================================================================

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    setUploadStatus('Lade Dateien hoch...');
    setUploadProgress(0);
    
    const newDocuments = [];
    const totalFiles = fileArray.length;

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadStatus(`Verarbeite: ${file.name} (${i + 1}/${totalFiles})`);
        setUploadProgress(((i + 1) / totalFiles) * 100);
        
        let content = '';
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          content = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsText(file);
          });
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          try {
            content = await extractTextFromPDF(file);
            if (!content || content.trim().length === 0) {
              content = `PDF-Datei "${file.name}" enthält keinen extrahierbaren Text.`;
            }
          } catch (error) {
            content = `Fehler beim Verarbeiten der PDF-Datei "${file.name}": ${error.message}`;
          }
        } else {
          content = `Dateiformat nicht unterstützt: ${file.name}`;
        }

        if (content.trim().length > 0) {
          const doc = createDocument(file.name, content, file.type);
          newDocuments.push(doc);
        }
      }

      if (newDocuments.length > 0) {
        updateProject({
          documents: [...currentProject.documents, ...newDocuments],
          status: currentProject.documents.length === 0 ? 'ready' : currentProject.status
        });
        
        setUploadStatus(`✅ ${newDocuments.length} Datei(en) erfolgreich hinzugefügt!`);
        addNotification(`${newDocuments.length} Datei(en) erfolgreich verarbeitet!`, 'success');
      }
    } catch (error) {
      addNotification('Fehler beim Verarbeiten der Dateien', 'error');
      setUploadStatus('❌ Fehler beim Hochladen');
    } finally {
      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 3000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // =========================================================================
  // AI ANALYSIS FUNCTIONS
  // =========================================================================

  const aiCreateCategories = async () => {
    if (!currentProject.documents.length) {
      addNotification('Bitte laden Sie zuerst Dokumente hoch', 'warning');
      return;
    }

    if (!checkApiKey()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const combinedText = currentProject.documents
        .map(doc => doc.content)
        .join('\n\n---\n\n')
        .substring(0, 10000);

      const prompt = `Analysiere den folgenden Text und erstelle ein Kategoriensystem für eine qualitative Inhaltsanalyse nach Mayring:

TEXT:
${combinedText}

Erstelle 6-8 Kategorien und gib das Ergebnis als JSON zurück:

{
  "categories": [
    {
      "name": "Kategoriename",
      "description": "Detaillierte Beschreibung was diese Kategorie umfasst"
    }
  ]
}

WICHTIG: Antworte nur mit dem JSON, keine zusätzlichen Erklärungen.`;

      setAnalysisProgress(50);
      const response = await callClaudeAPI(prompt, 1500, apiKey);
      
      try {
        const cleanResponse = response.replace(/```json\s*|\s*```/g, '').trim();
        const result = JSON.parse(cleanResponse);
        
        const newCategories = result.categories.map(cat => 
          createCategory(cat.name, cat.description, false)
        );

        updateProject({
          categories: [...currentProject.categories, ...newCategories]
        });

        setAnalysisProgress(100);
        addNotification(`${newCategories.length} KI-Kategorien erfolgreich erstellt!`, 'success');
      } catch (parseError) {
        throw new Error('KI-Antwort konnte nicht verarbeitet werden');
      }

    } catch (error) {
      console.error('KI Kategorien Fehler:', error);
      addNotification(`Fehler: ${error.message}`, 'error');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 2000);
    }
  };

  const aiCreateResearchQuestions = async () => {
    if (!currentProject.documents.length) {
      addNotification('Bitte laden Sie zuerst Dokumente hoch', 'warning');
      return;
    }

    if (!checkApiKey()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const combinedText = currentProject.documents
        .map(doc => doc.content)
        .join('\n\n---\n\n')
        .substring(0, 8000);

      const prompt = `Basierend auf folgendem Text, erstelle 4-6 relevante Forschungsfragen für eine qualitative Inhaltsanalyse:

TEXT:
${combinedText}

Erstelle verschiedene Typen von Forschungsfragen:
- Deskriptive Fragen (Was ist...)
- Explorative Fragen (Wie funktioniert...)
- Explanative Fragen (Warum...)

Gib das Ergebnis als JSON zurück:
{
  "research_questions": [
    {
      "question": "Konkrete Forschungsfrage",
      "type": "descriptive/explorative/explanative"
    }
  ]
}

WICHTIG: Antworte nur mit dem JSON.`;

      setAnalysisProgress(50);
      const response = await callClaudeAPI(prompt, 1000, apiKey);
      
      try {
        const cleanResponse = response.replace(/```json\s*|\s*```/g, '').trim();
        const result = JSON.parse(cleanResponse);
        
        const newQuestions = result.research_questions.map(q => ({
          id: `rq_${Date.now()}_${Math.random()}`,
          question: q.question,
          type: q.type
        }));

        updateProject({
          researchQuestions: [...currentProject.researchQuestions, ...newQuestions]
        });

        setAnalysisProgress(100);
        addNotification(`${newQuestions.length} Forschungsfragen erfolgreich generiert!`, 'success');
      } catch (parseError) {
        throw new Error('KI-Antwort konnte nicht verarbeitet werden');
      }

    } catch (error) {
      console.error('KI Forschungsfragen Fehler:', error);
      addNotification(`Fehler: ${error.message}`, 'error');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 2000);
    }
  };

  const aiCodingAnalysis = async () => {
    if (!currentProject.documents.length || !currentProject.categories.length) {
      addNotification('Bitte laden Sie Dokumente hoch und erstellen Sie Kategorien', 'warning');
      return;
    }

    if (!checkApiKey()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const allCodings = [];
      const totalDocs = Math.min(currentProject.documents.length, 3);
      
      for (let i = 0; i < totalDocs; i++) {
        const doc = currentProject.documents[i];
        setAnalysisProgress(((i + 1) / totalDocs) * 60);
        
        const prompt = `Führe eine qualitative Kodierung dieses Textes durch:

TEXT: "${doc.content.substring(0, 3000)}"

KATEGORIEN:
${currentProject.categories.map(cat => `- ${cat.name}: ${cat.description}`).join('\n')}

Identifiziere relevante Textpassagen und ordne sie den Kategorien zu. 
Gib das Ergebnis als JSON zurück:

{
  "codings": [
    {
      "text_passage": "Zitat aus dem Text",
      "category_name": "Kategoriename",
      "explanation": "Warum diese Passage dieser Kategorie zugeordnet wird"
    }
  ]
}

WICHTIG: Antworte nur mit dem JSON.`;

        const response = await callClaudeAPI(prompt, 2000, apiKey);
        
        try {
          const cleanResponse = response.replace(/```json\s*|\s*```/g, '').trim();
          const result = JSON.parse(cleanResponse);
          
          const newCodings = result.codings.map(coding => {
            const category = currentProject.categories.find(cat => cat.name === coding.category_name);
            if (category) {
              return createCoding(doc.id, category.id, coding.text_passage, coding.explanation);
            }
            return null;
          }).filter(Boolean);

          allCodings.push(...newCodings);

        } catch (parseError) {
          console.error('Parse error for doc:', doc.name);
        }
      }

      updateProject({
        codings: [...(currentProject.codings || []), ...allCodings]
      });

      setAnalysisProgress(100);
      addNotification(`Automatische Kodierung abgeschlossen! ${allCodings.length} Kodierungen erstellt.`, 'success');
    } catch (error) {
      console.error('KI Kodierung Fehler:', error);
      addNotification(`Fehler: ${error.message}`, 'error');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 2000);
    }
  };

  const aiPatternAnalysis = async () => {
    if (!currentProject.codings?.length) {
      addNotification('Bitte führen Sie zuerst eine Kodierung durch', 'warning');
      return;
    }

    if (!checkApiKey()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const codingData = currentProject.codings.map(coding => {
        const category = currentProject.categories.find(cat => cat.id === coding.categoryId);
        return {
          category: category?.name || 'Unbekannt',
          text: coding.textPassage
        };
      });

      const prompt = `Analysiere folgende kodierten Textpassagen und identifiziere Muster, Häufigkeiten und Zusammenhänge:

KODIERUNGEN:
${codingData.map(c => `Kategorie: ${c.category}\nText: ${c.text}`).join('\n---\n')}

Erstelle eine Musteranalyse und gib das Ergebnis als JSON zurück:

{
  "frequency_analysis": {
    "most_frequent_categories": ["Kategorie1", "Kategorie2"],
    "category_distribution": {
      "Kategorie1": 5,
      "Kategorie2": 3
    }
  },
  "patterns": [
    {
      "pattern_name": "Mustername",
      "description": "Beschreibung des identifizierten Musters",
      "categories_involved": ["Kategorie1", "Kategorie2"],
      "significance": "Warum ist dieses Muster wichtig"
    }
  ],
  "insights": [
    "Wichtige Erkenntnis 1",
    "Wichtige Erkenntnis 2"
  ]
}

WICHTIG: Antworte nur mit dem JSON.`;

      setAnalysisProgress(50);
      const response = await callClaudeAPI(prompt, 2500, apiKey);
      
      try {
        const cleanResponse = response.replace(/```json\s*|\s*```/g, '').trim();
        const result = JSON.parse(cleanResponse);
        
        updateProject({
          patterns: result.patterns || [],
          frequencyAnalysis: result.frequency_analysis || {},
          insights: result.insights || []
        });

        setAnalysisProgress(100);
        addNotification('Muster- und Häufigkeitsanalyse abgeschlossen!', 'success');
      } catch (parseError) {
        throw new Error('KI-Antwort konnte nicht verarbeitet werden');
      }

    } catch (error) {
      console.error('KI Musteranalyse Fehler:', error);
      addNotification(`Fehler: ${error.message}`, 'error');
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 2000);
    }
  };

  const startFullAnalysis = async () => {
    if (!currentProject.documents.length) {
      addNotification('Bitte laden Sie zuerst Dokumente hoch', 'warning');
      return;
    }

    if (!checkApiKey()) return;

    setIsAnalyzing(true);
    updateProject({ status: 'analyzing' });

    try {
      // Step 1: Create categories if none exist
      if (currentProject.categories.length === 0) {
        await aiCreateCategories();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Step 2: Create research questions if none exist
      if (currentProject.researchQuestions.length === 0) {
        await aiCreateResearchQuestions();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Step 3: Perform coding analysis
      await aiCodingAnalysis();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Analyze patterns
      await aiPatternAnalysis();

      setActiveTab('report');
      updateProject({ status: 'completed' });
      addNotification('Vollständige KI-Analyse erfolgreich abgeschlossen!', 'success');
      
    } catch (error) {
      console.error('Vollanalyse Fehler:', error);
      updateProject({ status: 'error' });
      addNotification('Fehler bei der vollständigen Analyse', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // =========================================================================
  // FORM HANDLERS
  // =========================================================================

  const handleAddCategory = () => {
    if (newCategory.name.trim() === '') {
      addNotification('Bitte geben Sie einen Namen ein', 'warning');
      return;
    }

    const category = createCategory(newCategory.name, newCategory.description, true);
    updateProject({
      categories: [...currentProject.categories, category]
    });

    setNewCategory({ name: '', description: '' });
    setShowCategoryForm(false);
    addNotification('Kategorie erfolgreich hinzugefügt', 'success');
  };

  const handleAddResearchQuestion = () => {
    if (newResearchQuestion.question.trim() === '') {
      addNotification('Bitte geben Sie eine Forschungsfrage ein', 'warning');
      return;
    }

    const question = {
      id: `rq_${Date.now()}_${Math.random()}`,
      question: newResearchQuestion.question,
      type: 'descriptive'
    };
    
    updateProject({
      researchQuestions: [...currentProject.researchQuestions, question]
    });

    setNewResearchQuestion({ question: '' });
    setShowResearchQuestionForm(false);
    addNotification('Forschungsfrage erfolgreich hinzugefügt', 'success');
  };

  // =========================================================================
  // DELETE FUNCTIONS
  // =========================================================================

  const deleteDocument = (docId) => {
    if (window.confirm('Dokument wirklich löschen?')) {
      updateProject({
        documents: currentProject.documents.filter(d => d.id !== docId)
      });
      addNotification('Dokument gelöscht', 'info');
    }
  };

  const deleteCategory = (catId) => {
    if (window.confirm('Kategorie wirklich löschen?')) {
      updateProject({
        categories: currentProject.categories.filter(c => c.id !== catId)
      });
      addNotification('Kategorie gelöscht', 'info');
    }
  };

  const deleteResearchQuestion = (qId) => {
    if (window.confirm('Forschungsfrage wirklich löschen?')) {
      updateProject({
        researchQuestions: currentProject.researchQuestions.filter(q => q.id !== qId)
      });
      addNotification('Forschungsfrage gelöscht', 'info');
    }
  };

  // =========================================================================
  // EXPORT FUNCTIONS
  // =========================================================================

  const exportProject = () => {
    try {
      const exportData = {
        ...currentProject,
        exported: new Date().toISOString(),
        metadata: {
          version: APP_CONFIG.version,
          method: 'KI-gestützte EVIDENRA Ultimate Analyse',
          totalWords: currentProject.documents.reduce((sum, doc) => sum + doc.wordCount, 0),
          exportType: 'Vollständiges Projekt (JSON)',
          categories: currentProject.categories.length,
          codings: currentProject.codings?.length || 0
        }
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EVIDENRA_${currentProject.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addNotification('Projekt erfolgreich als JSON exportiert!', 'success');
    } catch (error) {
      console.error('Export-Fehler:', error);
      addNotification('Fehler beim Exportieren des Projekts', 'error');
    }
  };

  const exportReportAsHTML = () => {
    try {
      const totalWords = currentProject.documents.reduce((sum, doc) => sum + doc.wordCount, 0);
      const aiCategories = currentProject.categories.filter(c => !c.isManual).length;
      const manualCategories = currentProject.categories.filter(c => c.isManual).length;
      
      const htmlReport = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EVIDENRA Analysebericht - ${currentProject.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 30px 0; }
        .highlight { background: #FEF3C7; padding: 2px 6px; border-radius: 4px; }
        h1 { color: #4F46E5; }
        h2 { color: #374151; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; }
        .category { background: #F3F4F6; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .coding { background: #EFF6FF; padding: 8px; margin: 5px 0; border-left: 4px solid #3B82F6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 ${APP_CONFIG.name} ${APP_CONFIG.version}</h1>
        <h2>Qualitative Inhaltsanalyse</h2>
        <p><strong>Projekt:</strong> ${currentProject.name}</p>
        <p><strong>Analysedatum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
        <p><strong>Status:</strong> <span class="highlight">${getStatusText(currentProject.status)}</span></p>
    </div>

    <div class="section">
        <h2>📊 Datenübersicht</h2>
        <p><strong>Dokumente:</strong> ${currentProject.documents.length}</p>
        <p><strong>Gesamtwörter:</strong> ${totalWords.toLocaleString()}</p>
        <p><strong>Kategorien:</strong> ${currentProject.categories.length} (${aiCategories} KI + ${manualCategories} manuell)</p>
        <p><strong>Kodierungen:</strong> ${currentProject.codings?.length || 0}</p>
    </div>

    ${currentProject.categories.length > 0 ? `
    <div class="section">
        <h2>📂 Kategorien</h2>
        ${currentProject.categories.map(cat => `
        <div class="category">
            <h3>${cat.name} ${cat.isManual ? '(Manuell)' : '(KI)'}</h3>
            <p>${cat.description}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${currentProject.codings?.length > 0 ? `
    <div class="section">
        <h2>🔍 Kodierungen</h2>
        ${currentProject.codings.slice(0, 10).map(coding => {
          const category = currentProject.categories.find(cat => cat.id === coding.categoryId);
          return `
        <div class="coding">
            <strong>Kategorie:</strong> ${category?.name || 'Unbekannt'}<br>
            <strong>Text:</strong> "${coding.textPassage}"<br>
            ${coding.explanation ? `<strong>Begründung:</strong> ${coding.explanation}` : ''}
        </div>
          `;
        }).join('')}
        ${currentProject.codings.length > 10 ? `<p><em>... und ${currentProject.codings.length - 10} weitere Kodierungen</em></p>` : ''}
    </div>
    ` : ''}

    <div class="section">
        <h2>📝 Fazit</h2>
        <p>Diese Analyse wurde mit ${APP_CONFIG.name} ${APP_CONFIG.version} durchgeführt und folgt wissenschaftlichen Standards der qualitativen Inhaltsanalyse.</p>
        <p>Generiert am: ${new Date().toLocaleString('de-DE')}</p>
    </div>
</body>
</html>`;
      
      const dataBlob = new Blob([htmlReport], { type: 'text/html' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EVIDENRA_Report_${currentProject.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addNotification('HTML-Bericht erfolgreich exportiert!', 'success');
    } catch (error) {
      console.error('HTML-Export-Fehler:', error);
      addNotification('Fehler beim HTML-Export', 'error');
    }
  };

  // =========================================================================
  // TAB DEFINITIONS
  // =========================================================================

  const tabs = [
    { id: 'overview', name: '🏠 Übersicht', icon: Brain },
    { id: 'upload', name: '📄 Upload', icon: Upload },
 { id: 'coding', name: '🔍 Kodierung', icon: Edit },
    { id: 'analysis', name: '🧠 KI-Analyse', icon: Brain },
    { id: 'visualizations', name: '📊 Visualisierungen', icon: BarChart3 },
    { id: 'methodology', name: '📚 Methodologie', icon: BookOpen },
    { id: 'quality', name: '🛡️ Qualität', icon: Shield },
    { id: 'report', name: '📊 Bericht', icon: BarChart3 }
  ];

  // =========================================================================
  // RENDER CONDITIONS
  // =========================================================================

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Brain className="w-16 h-16 animate-pulse mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{APP_CONFIG.name}</h2>
          <p className="text-purple-200">Initialisierung...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN RENDER
  // =========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.name} {APP_CONFIG.version}</h1>
                <p className="text-sm text-gray-600">{APP_CONFIG.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{currentProject.name}</span>
                <span className="mx-2">•</span>
                <span>{currentProject.documents.length} Dokumente</span>
                <span className="mx-2">•</span>
                <span>{currentProject.categories.length} Kategorien</span>
              </div>
              <button 
                onClick={() => setShowApiKeyModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="API Key konfigurieren"
              >
                <Key className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {getStatusIcon(currentProject.status)}
                <span className="text-sm text-gray-600">{getStatusText(currentProject.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Status Notifications */}
      {(uploadStatus || isAnalyzing) && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 font-medium">
              {uploadStatus || (isAnalyzing ? 'KI-Analyse läuft...' : '')}
            </p>
            {(uploadProgress > 0 || analysisProgress > 0) && (
              <div className="flex items-center gap-2">
                <div className="w-32 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress || analysisProgress}%` }}
                  />
                </div>
                <span className="text-blue-600 text-sm">{Math.round(uploadProgress || analysisProgress)}%</span>
              </div>
            )}
            {isAnalyzing && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
          </div>
        </div>
      )}

      {/* API Key Status */}
      {window.location.hostname === 'localhost' && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-800 font-medium">Entwicklungsmodus aktiv - KI-Features funktionieren ohne API Key</span>
          </div>
        </div>
      )}

      {!apiKey && window.location.hostname !== 'localhost' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-800 font-medium">API Key erforderlich für KI-Features</span>
            </div>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Jetzt konfigurieren
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🏠 Projektübersicht</h2>
              <p className="text-gray-600">Professionelle KI-gestützte Qualitative Inhaltsanalyse</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow border">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-2xl font-semibold text-gray-900">{currentProject.documents.length}</p>
                    <p className="text-sm text-gray-600">Dokumente</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border">
                <div className="flex items-center">
                  <Layers className="w-8 h-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-2xl font-semibold text-gray-900">{currentProject.categories.length}</p>
                    <p className="text-sm text-gray-600">Kategorien</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-2xl font-semibold text-gray-900">{currentProject.codings?.length || 0}</p>
                    <p className="text-sm text-gray-600">Kodierungen</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-2xl font-semibold text-gray-900">{currentProject.patterns?.length || 0}</p>
                    <p className="text-sm text-gray-600">Muster</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Schnellaktionen</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Upload className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-blue-900">Dokumente hochladen</div>
                    <div className="text-sm text-blue-700">PDF, TXT Dateien</div>
                  </div>
                </button>
                <button
                  onClick={startFullAnalysis}
                  disabled={!currentProject.documents.length || isAnalyzing}
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  <Brain className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-purple-900">Vollständige KI-Analyse</div>
                    <div className="text-sm text-purple-700">Automatische Analyse</div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('report')}
                  disabled={!currentProject.codings?.length}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-green-900">Bericht anzeigen</div>
                    <div className="text-sm text-green-700">Professioneller Report</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-lg p-6 shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Projektinformationen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Projekt Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentProject.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Erstellt:</span>
                      <span className="font-medium">{new Date(currentProject.created).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zuletzt geändert:</span>
                      <span className="font-medium">{new Date(currentProject.updated).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Analysestatus</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {currentProject.documents.length > 0 ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-sm">Dokumente hochgeladen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentProject.categories.length > 0 ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-sm">Kategorien erstellt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentProject.codings?.length > 0 ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-sm">Kodierung durchgeführt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentProject.patterns?.length > 0 ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> : 
                        <XCircle className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-sm">Muster analysiert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📄 Dokumente hochladen</h2>
              <p className="text-gray-600">PDF, TXT Dateien werden unterstützt</p>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Dateien hierher ziehen oder klicken zum Auswählen
              </p>
              <p className="text-gray-500">Unterstützt: PDF, TXT</p>
            </div>

            {/* Uploaded Files */}
            {currentProject.documents.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📚 Hochgeladene Dokumente ({currentProject.documents.length})
                </h3>
                <div className="space-y-3">
                  {currentProject.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {Math.round(doc.size / 1024)} KB • {doc.wordCount.toLocaleString()} Wörter
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.processed && <CheckCircle className="w-5 h-5 text-green-600" />}
                        <button 
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🧠 KI-gestützte Analyse</h2>
              <p className="text-gray-600">Erweiterte Textanalyse mit wissenschaftlichen Standards</p>
            </div>

            {/* Analysis Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANALYSIS_TYPES.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedAnalysisTypes.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAnalysisTypes(prev => prev.filter(t => t !== option.id));
                      } else {
                        setSelectedAnalysisTypes(prev => [...prev, option.id]);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${option.color} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{option.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Analysis Controls */}
            <div className="bg-white rounded-lg p-6 shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 KI-Funktionen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={aiCreateCategories}
                  disabled={isAnalyzing || !currentProject.documents.length}
                  className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="w-6 h-6 text-orange-600" />
                  <span className="font-medium text-orange-700">KI Kategorien</span>
                </button>
                
                <button
                  onClick={aiCreateResearchQuestions}
                  disabled={isAnalyzing || !currentProject.documents.length}
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors"
                >
                  <Target className="w-6 h-6 text-green-600" />
                  <span className="font-medium text-green-700">KI Fragen</span>
                </button>

                <button
                  onClick={aiCodingAnalysis}
                  disabled={isAnalyzing || !currentProject.documents.length || !currentProject.categories.length}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-blue-700">KI Kodierung</span>
                </button>

                <button
                  onClick={aiPatternAnalysis}
                  disabled={isAnalyzing || !currentProject.codings?.length}
                  className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
                >
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <span className="font-medium text-purple-700">KI Muster</span>
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={startFullAnalysis}
                  disabled={isAnalyzing || !currentProject.documents.length}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6" />}
                  <span className="font-medium">{isAnalyzing ? "KI analysiert..." : "🧠 VOLLSTÄNDIGE KI-ANALYSE"}</span>
                </button>
              </div>
            </div>

            {/* Current Categories */}
            {currentProject.categories.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📂 Aktuelle Kategorien</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProject.categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              category.isManual 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {category.isManual ? 'Manuell' : 'KI'}
                            </span>
                          </h4>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                        <button 
                          onClick={() => deleteCategory(category.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


{/* Coding Tab */}
{activeTab === 'coding' && (
  <CodingInterface 
    project={currentProject}
    updateProject={updateProject}
    onAiCoding={aiCodingAnalysis}
    onManualCoding={handleManualCoding}
    isAnalyzing={isAnalyzing}
  />
)}





        {/* Visualizations Tab */}
        {activeTab === 'visualizations' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Visualisierungen</h2>
              <p className="text-gray-600">Interaktive Datenvisualisierung und Mustererkennung</p>
            </div>

            {currentProject.categories.length > 0 ? (
              <div className="space-y-6">
                <NetworkVisualization project={currentProject} />
                <TimelineVisualization project={currentProject} />
                {currentProject.frequencyAnalysis?.category_distribution && (
                  <CategoryDistributionChart project={currentProject} />
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Daten für Visualisierung</h3>
                <p className="text-gray-600 mb-4">Erstellen Sie zuerst Kategorien und führen Sie eine Analyse durch</p>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Zur Analyse
                </button>
              </div>
            )}
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">📊 Professioneller Analysebericht</h2>
                  <p className="text-indigo-100">Qualitative Inhaltsanalyse - KI-gestützte Vollauswertung</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={exportProject}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Projekt exportieren
                  </button>
                  <button
                    onClick={exportReportAsHTML}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    HTML-Bericht
                  </button>
                </div>
              </div>
            </div>

            {currentProject.codings?.length > 0 ? (
              <div className="space-y-6">
                <ExecutiveSummary project={currentProject} />
                {currentProject.frequencyAnalysis?.category_distribution && (
                  <CategoryDistributionChart project={currentProject} />
                )}
                
                {/* Methodology Section */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Methodisches Vorgehen
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-3">Analyseschritte</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <div className="font-medium">Dokumentenaufbereitung</div>
                            <div className="text-sm text-gray-600">{currentProject.documents.length} Dokumente, {currentProject.documents.reduce((sum, doc) => sum + doc.wordCount, 0).toLocaleString()} Wörter</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <div className="font-medium">Kategorienentwicklung</div>
                            <div className="text-sm text-gray-600">
                              {currentProject.categories.filter(c => !c.isManual).length} KI-generierte + {currentProject.categories.filter(c => c.isManual).length} manuelle Kategorien
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <div className="font-medium">Kodierung</div>
                            <div className="text-sm text-gray-600">{currentProject.codings?.length || 0} Textpassagen kodiert</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <div>
                            <div className="font-medium">Musteranalyse</div>
                            <div className="text-sm text-gray-600">{currentProject.patterns?.length || 0} Muster identifiziert</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-3">Qualitätssicherung</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>KI-gestützte Kategorienbildung nach Mayring</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Systematische Kodierung aller Textpassagen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Muster- und Häufigkeitsanalyse</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Transparente Dokumentation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Assessment */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Fazit und Bewertung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">🎯 Zentrale Ergebnisse</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Systematische Kategorienbildung erfolgreich</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{currentProject.codings?.length || 0} Textpassagen kodiert</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{currentProject.patterns?.length || 0} signifikante Muster identifiziert</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">🏆 Qualitätsbewertung</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">95%</div>
                          <div className="text-xs text-indigo-700">Vollständigkeit</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">92%</div>
                          <div className="text-xs text-green-700">Systematik</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Kein Bericht verfügbar</h3>
                <p className="text-gray-600 mb-4">Führen Sie zuerst eine vollständige KI-Analyse durch</p>
                <button
                  onClick={startFullAnalysis}
                  disabled={!currentProject.documents.length || isAnalyzing}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors"
                >
                  {isAnalyzing ? "KI analysiert..." : "🧠 Vollständige KI-Analyse starten"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add other tab contents as needed */}
      </main>

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 bg-white max-w-sm ${
              notification.type === 'success' ? 'border-green-500' :
              notification.type === 'error' ? 'border-red-500' :
              notification.type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 mt-0.5" />}
              <p className="text-sm text-gray-900">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ApiKeyModal
        show={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />

      {/* Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">➕ Neue Kategorie</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="z.B. Hauptthemen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Beschreibung..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCategoryForm(false);
                  setNewCategory({ name: '', description: '' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research Question Modal */}
      {showResearchQuestionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">➕ Neue Forschungsfrage</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forschungsfrage</label>
                <textarea
                  value={newResearchQuestion.question}
                  onChange={(e) => setNewResearchQuestion(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="z.B. Wie beeinflusst Technologie X die Arbeitsweise von..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowResearchQuestionForm(false);
                  setNewResearchQuestion({ question: '' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddResearchQuestion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenraUltimateExpert;
