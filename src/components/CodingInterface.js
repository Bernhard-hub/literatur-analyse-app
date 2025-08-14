// ============================================================================
// ENHANCED CODING FEATURE FOR EVIDENRA ULTIMATE
// Qualitative Content Analysis - Advanced Coding Module
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, Search, Target, Edit, Save, Trash2, 
  Plus, Filter, Eye, FileText, Tag, 
  CheckCircle, AlertCircle, Loader2,
  ChevronDown, ChevronUp, BarChart3
} from 'lucide-react';

// ============================================================================
// CODING DATA MODELS
// ============================================================================

const createCoding = (docId, categoryId, textPassage, explanation, coder = 'AI', confidence = 0.8) => ({
  id: `coding_${Date.now()}_${Math.random()}`,
  docId,
  categoryId,
  text: textPassage,
  textPassage,
  explanation,
  coder, // 'AI', 'manual', 'user1', etc.
  confidence,
  position: { start: 0, end: textPassage.length },
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  tags: [],
  memo: '',
  validated: false
});

const createManualCoding = (docId, categoryId, selectedText, explanation, startPos, endPos) => ({
  ...createCoding(docId, categoryId, selectedText, explanation, 'manual', 1.0),
  position: { start: startPos, end: endPos },
  validated: true
});

// ============================================================================
// CODING STATISTICS UTILITIES
// ============================================================================

const calculateCodingStatistics = (codings, categories) => {
  const stats = {
    total: codings.length,
    byCategory: {},
    byCoder: {},
    averageConfidence: 0,
    validatedCount: 0,
    interRaterReliability: null
  };

  // Calculate category distribution
  categories.forEach(cat => {
    stats.byCategory[cat.name] = {
      count: 0,
      percentage: 0,
      averageConfidence: 0
    };
  });

  codings.forEach(coding => {
    const category = categories.find(cat => cat.id === coding.categoryId);
    if (category) {
      stats.byCategory[category.name].count++;
    }

    // Coder statistics
    if (!stats.byCoder[coding.coder]) {
      stats.byCoder[coding.coder] = { count: 0, averageConfidence: 0 };
    }
    stats.byCoder[coding.coder].count++;

    // Overall statistics
    stats.averageConfidence += coding.confidence;
    if (coding.validated) stats.validatedCount++;
  });

  // Calculate percentages and averages
  Object.keys(stats.byCategory).forEach(catName => {
    const catStats = stats.byCategory[catName];
    catStats.percentage = (catStats.count / stats.total) * 100;
  });

  stats.averageConfidence = stats.total > 0 ? stats.averageConfidence / stats.total : 0;

  return stats;
};

// ============================================================================
// CODING INTERFACE COMPONENTS
// ============================================================================

const CodingInterface = ({ 
  project, 
  updateProject, 
  onAiCoding,
  onManualCoding,
  isAnalyzing = false 
}) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [textSelection, setTextSelection] = useState({ start: 0, end: 0 });
  const [codingExplanation, setCodingExplanation] = useState('');
  const [showCodingForm, setShowCodingForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCoder, setFilterCoder] = useState('all');
  const [expandedCodings, setExpandedCodings] = useState(new Set());

  const textRef = useRef(null);

  // Get current codings with filters
  const filteredCodings = (project.codings || []).filter(coding => {
    const category = project.categories.find(cat => cat.id === coding.categoryId);
    const categoryMatch = filterCategory === 'all' || category?.name === filterCategory;
    const coderMatch = filterCoder === 'all' || coding.coder === filterCoder;
    return categoryMatch && coderMatch;
  });

  const statistics = calculateCodingStatistics(project.codings || [], project.categories);

  // Handle text selection for manual coding
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();
      
      if (selectedText.length >= 10) { // Minimum text length
        setSelectedText(selectedText);
        setTextSelection({
          start: range.startOffset,
          end: range.endOffset
        });
        setShowCodingForm(true);
      }
    }
  };

  // Submit manual coding
  const handleSubmitManualCoding = () => {
    if (!selectedDocument || !selectedCategory || !selectedText.trim()) {
      alert('Bitte wählen Sie Dokument, Kategorie und Text aus');
      return;
    }

    const newCoding = createManualCoding(
      selectedDocument.id,
      selectedCategory.id,
      selectedText,
      codingExplanation,
      textSelection.start,
      textSelection.end
    );

    const updatedCodings = [...(project.codings || []), newCoding];
    updateProject({ codings: updatedCodings });

    // Reset form
    setSelectedText('');
    setCodingExplanation('');
    setShowCodingForm(false);
    
    // Clear selection
    window.getSelection().removeAllRanges();
  };

  // Delete coding
  const deleteCoding = (codingId) => {
    if (window.confirm('Kodierung wirklich löschen?')) {
      const updatedCodings = project.codings.filter(coding => coding.id !== codingId);
      updateProject({ codings: updatedCodings });
    }
  };

  // Validate/toggle coding
  const toggleCodingValidation = (codingId) => {
    const updatedCodings = project.codings.map(coding => 
      coding.id === codingId 
        ? { ...coding, validated: !coding.validated }
        : coding
    );
    updateProject({ codings: updatedCodings });
  };

  // Toggle expanded state
  const toggleExpanded = (codingId) => {
    const newExpanded = new Set(expandedCodings);
    if (newExpanded.has(codingId)) {
      newExpanded.delete(codingId);
    } else {
      newExpanded.add(codingId);
    }
    setExpandedCodings(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header & Statistics */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            🔍 Qualitative Kodierung
          </h2>
          <div className="flex gap-3">
            <button
              onClick={onAiCoding}
              disabled={isAnalyzing || !project.documents.length || !project.categories.length}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              KI-Kodierung starten
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
            <div className="text-sm text-blue-700">Gesamt Kodierungen</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{statistics.validatedCount}</div>
            <div className="text-sm text-green-700">Validiert</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(statistics.averageConfidence * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-orange-700">Ø Konfidenz</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(statistics.byCategory).length}
            </div>
            <div className="text-sm text-purple-700">Kategorien</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">Alle Kategorien</option>
              {project.categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <select
              value={filterCoder}
              onChange={(e) => setFilterCoder(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="all">Alle Kodierer</option>
              {Object.keys(statistics.byCoder).map(coder => (
                <option key={coder} value={coder}>
                  {coder === 'AI' ? '🤖 KI' : 
                   coder === 'manual' ? '👤 Manuell' : coder}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Manual Coding Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-green-600" />
          Manuelle Kodierung
        </h3>

        {/* Document Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dokument auswählen</label>
            <select
              value={selectedDocument?.id || ''}
              onChange={(e) => {
                const doc = project.documents.find(d => d.id === e.target.value);
                setSelectedDocument(doc);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Dokument wählen --</option>
              {project.documents.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie auswählen</label>
            <select
              value={selectedCategory?.id || ''}
              onChange={(e) => {
                const cat = project.categories.find(c => c.id === e.target.value);
                setSelectedCategory(cat);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Kategorie wählen --</option>
              {project.categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Document Text Display */}
        {selectedDocument && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text auswählen (markieren Sie den zu kodierenden Text)
            </label>
            <div
              ref={textRef}
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 max-h-64 overflow-y-auto cursor-text select-text"
              onMouseUp={handleTextSelection}
              style={{ userSelect: 'text' }}
            >
              {selectedDocument.content}
            </div>
          </div>
        )}

        {/* Manual Coding Form */}
        {showCodingForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-3">Neue Kodierung erstellen</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Ausgewählter Text:</label>
                <div className="bg-white p-2 rounded border text-sm italic">
                  "{selectedText}"
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Begründung (optional):</label>
                <textarea
                  value={codingExplanation}
                  onChange={(e) => setCodingExplanation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                  placeholder="Warum ordnen Sie diese Textpassage dieser Kategorie zu?"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitManualCoding}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Kodierung speichern
                </button>
                <button
                  onClick={() => {
                    setShowCodingForm(false);
                    setSelectedText('');
                    setCodingExplanation('');
                    window.getSelection().removeAllRanges();
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coding List */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Kodierungen ({filteredCodings.length})
        </h3>

        {filteredCodings.length > 0 ? (
          <div className="space-y-4">
            {filteredCodings.map((coding) => {
              const category = project.categories.find(cat => cat.id === coding.categoryId);
              const document = project.documents.find(doc => doc.id === coding.docId);
              const isExpanded = expandedCodings.has(coding.id);
              
              return (
                <div key={coding.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleExpanded(coding.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category?.color || '#666' }}
                          />
                          <span className="font-medium text-gray-900">{category?.name || 'Unbekannt'}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            coding.coder === 'AI' ? 'bg-purple-100 text-purple-800' :
                            coding.coder === 'manual' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {coding.coder === 'AI' ? '🤖 KI' : 
                             coding.coder === 'manual' ? '👤 Manuell' : coding.coder}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {(coding.confidence * 100).toFixed(0)}% Konfidenz
                          </span>
                          {coding.validated && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                        <blockquote className="text-gray-700 italic border-l-4 border-gray-300 pl-3">
                          "{coding.textPassage}"
                        </blockquote>
                        <div className="text-xs text-gray-500 mt-2">
                          {document?.name} • {new Date(coding.created).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCodingValidation(coding.id);
                          }}
                          className={`p-1 rounded ${
                            coding.validated 
                              ? 'text-green-600 hover:text-green-800' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title={coding.validated ? 'Validierung entfernen' : 'Kodierung validieren'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCoding(coding.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Kodierung löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? 
                          <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 border-t bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Details</h5>
                          <div className="text-sm space-y-1">
                            <div><strong>Dokument:</strong> {document?.name}</div>
                            <div><strong>Kategorie:</strong> {category?.name}</div>
                            <div><strong>Kodierer:</strong> {
                              coding.coder === 'AI' ? '🤖 KI-System' : 
                              coding.coder === 'manual' ? '👤 Manuell' : coding.coder
                            }</div>
                            <div><strong>Erstellt:</strong> {new Date(coding.created).toLocaleString('de-DE')}</div>
                            {coding.updated !== coding.created && (
                              <div><strong>Geändert:</strong> {new Date(coding.updated).toLocaleString('de-DE')}</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Begründung</h5>
                          <p className="text-sm text-gray-600">
                            {coding.explanation || 'Keine Begründung verfügbar'}
                          </p>
                          {category?.description && (
                            <div className="mt-2">
                              <strong className="text-xs text-gray-500">Kategorie-Definition:</strong>
                              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">Keine Kodierungen vorhanden</h4>
            <p className="text-gray-500 mb-4">
              {project.codings?.length > 0 
                ? 'Keine Kodierungen entsprechen den aktuellen Filtern'
                : 'Führen Sie eine KI-Kodierung durch oder erstellen Sie manuelle Kodierungen'
              }
            </p>
            {project.codings?.length === 0 && (
              <button
                onClick={onAiCoding}
                disabled={!project.documents.length || !project.categories.length}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                🤖 KI-Kodierung starten
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Distribution Chart */}
      {filteredCodings.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Kategorien-Verteilung
          </h3>
          <div className="space-y-3">
            {Object.entries(statistics.byCategory)
              .filter(([_, stats]) => stats.count > 0)
              .sort(([_, a], [__, b]) => b.count - a.count)
              .map(([categoryName, categoryStats]) => {
                const category = project.categories.find(cat => cat.name === categoryName);
                return (
                  <div key={categoryName} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category?.color || '#666' }}
                      />
                      <span className="font-medium text-sm truncate">{categoryName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600 min-w-0">
                        {categoryStats.count} ({categoryStats.percentage.toFixed(1)}%)
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${categoryStats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export { CodingInterface, createCoding, createManualCoding, calculateCodingStatistics };
