// 🔄 METHODOLOGY TEMPLATES - Wissenschaftliche Forschungstemplate
// src/templates/MethodologyTemplates.js

import React, { useState } from 'react';
import { 
  BookOpen, Target, Lightbulb, Users, FileText, 
  Brain, TrendingUp, Award, CheckCircle, ArrowRight,
  Search, Microscope, PieChart, BarChart3
} from 'lucide-react';

/**
 * 📚 Wissenschaftliche Methodentemplate
 */
export const MethodologyTemplates = {
  
  // 🧬 GROUNDED THEORY nach Strauss & Corbin
  groundedTheory: {
    id: 'grounded_theory',
    name: 'Grounded Theory',
    description: 'Induktive Theorieentwicklung aus empirischen Daten',
    authors: 'Strauss & Corbin, Glaser & Strauss',
    steps: [
      {
        phase: 'Open Coding',
        description: 'Daten aufbrechen, konzeptualisieren und kategorisieren',
        activities: ['Zeile-für-Zeile Kodierung', 'Begriffe entwickeln', 'Kategorien bilden'],
        aiSupport: 'KI-gestützte Kategorienidentifikation'
      },
      {
        phase: 'Axial Coding', 
        description: 'Verbindungen zwischen Kategorien herstellen',
        activities: ['Beziehungen identifizieren', 'Eigenschaften bestimmen', 'Dimensionen entwickeln'],
        aiSupport: 'Muster- und Beziehungsanalyse'
      },
      {
        phase: 'Selective Coding',
        description: 'Kernkategorie identifizieren und Theorie integrieren',
        activities: ['Kernkategorie bestimmen', 'Theorie formulieren', 'Validierung'],
        aiSupport: 'Theoretische Synthese'
      }
    ],
    categories: [
      { name: 'Ursächliche Bedingungen', description: 'Ereignisse die zum Phänomen führen' },
      { name: 'Phänomen', description: 'Zentrale Idee oder Ereignis' },
      { name: 'Kontext', description: 'Spezifische Eigenschaften des Phänomens' },
      { name: 'Intervenierende Bedingungen', description: 'Strukturelle Bedingungen' },
      { name: 'Handlungsstrategien', description: 'Absichtliche Handlungen' },
      { name: 'Konsequenzen', description: 'Resultate der Handlungsstrategien' }
    ],
    researchQuestions: [
      { question: 'Was ist hier vor sich gehend?', type: 'explorative' },
      { question: 'Welche sozialen Prozesse lassen sich identifizieren?', type: 'explorative' },
      { question: 'Wie entwickelt sich das Kernphänomen?', type: 'explanative' },
      { question: 'Welche Theorie erklärt die beobachteten Prozesse?', type: 'theory_building' }
    ],
    qualityCriteria: ['Theoretical sensitivity', 'Constant comparison', 'Theoretical saturation', 'Fit and relevance']
  },

  // 🎭 PHÄNOMENOLOGISCHE ANALYSE nach Van Manen
  phenomenological: {
    id: 'phenomenological',
    name: 'Phänomenologische Analyse',
    description: 'Erforschung gelebter Erfahrungen und deren Bedeutung',
    authors: 'Van Manen, Giorgi, Smith',
    steps: [
      {
        phase: 'Holistische Betrachtung',
        description: 'Gesamteindruck der Erfahrung erfassen',
        activities: ['Mehrfaches Lesen', 'Gesamtbedeutung erfassen', 'Erste Eindrücke'],
        aiSupport: 'Thematische Gesamtschau'
      },
      {
        phase: 'Selektive Betrachtung',
        description: 'Bedeutungseinheiten identifizieren',
        activities: ['Meaningful units', 'Thematische Aussagen', 'Essenzielle Strukturen'],
        aiSupport: 'Bedeutungseinheiten-Erkennung'
      },
      {
        phase: 'Detaillierte Betrachtung',
        description: 'Einzelne Phänomene untersuchen',
        activities: ['Mikroanalyse', 'Sprachliche Nuancen', 'Experiential themes'],
        aiSupport: 'Detaillierte semantische Analyse'
      }
    ],
    categories: [
      { name: 'Leiblichkeit', description: 'Körperliche Erfahrungsdimension' },
      { name: 'Zeitlichkeit', description: 'Temporale Erfahrungsdimension' },
      { name: 'Räumlichkeit', description: 'Spatiale Erfahrungsdimension' },
      { name: 'Beziehungskontext', description: 'Relationale Erfahrungsdimension' },
      { name: 'Stimmung/Atmosphäre', description: 'Emotionale Grundtönung' },
      { name: 'Sinnkonstitution', description: 'Bedeutungsgebende Prozesse' }
    ],
    researchQuestions: [
      { question: 'Wie erleben die Akteure das Phänomen?', type: 'descriptive' },
      { question: 'Welche Bedeutung hat diese Erfahrung für sie?', type: 'interpretive' },
      { question: 'Was ist die Essenz dieser gelebten Erfahrung?', type: 'essential' },
      { question: 'Wie zeigt sich das Phänomen in der Lebenswelt?', type: 'lifeworld' }
    ],
    qualityCriteria: ['Authenticity', 'Plausibility', 'Resonance', 'Situated knowledge']
  },

  // 📊 FALLSTUDIEN-ANALYSE nach Yin
  caseStudy: {
    id: 'case_study',
    name: 'Fallstudien-Analyse',
    description: 'Intensive Untersuchung zeitgenössischer Phänomene im realen Kontext',
    authors: 'Yin, Stake, Merriam',
    steps: [
      {
        phase: 'Case Definition',
        description: 'Fall(grenzen) und Analyseebenen definieren',
        activities: ['Fall identifizieren', 'Kontext abgrenzen', 'Analyseeinheiten bestimmen'],
        aiSupport: 'Kontextuelle Abgrenzung'
      },
      {
        phase: 'Within-Case Analysis',
        description: 'Einzelfallanalyse durchführen',
        activities: ['Chronologie erstellen', 'Muster identifizieren', 'Kausale Netzwerke'],
        aiSupport: 'Temporale und kausale Musteranalyse'
      },
      {
        phase: 'Cross-Case Analysis',
        description: 'Fallvergleichende Analyse (bei Multiple Cases)',
        activities: ['Gemeinsamkeiten finden', 'Unterschiede herausarbeiten', 'Typologien entwickeln'],
        aiSupport: 'Vergleichende Musteranalyse'
      }
    ],
    categories: [
      { name: 'Kontextuelle Faktoren', description: 'Umgebungsbedingungen des Falls' },
      { name: 'Schlüsselereignisse', description: 'Kritische Wendepunkte' },
      { name: 'Akteure und Rollen', description: 'Beteiligte Personen und ihre Funktionen' },
      { name: 'Prozesse und Mechanismen', description: 'Ablaufmuster und Wirkungsweisen' },
      { name: 'Outcomes und Konsequenzen', description: 'Ergebnisse und Folgewirkungen' },
      { name: 'Lessons Learned', description: 'Erkenntnisse und Implikationen' }
    ],
    researchQuestions: [
      { question: 'Wie entwickelt sich der Fall über die Zeit?', type: 'descriptive' },
      { question: 'Warum treten bestimmte Ereignisse auf?', type: 'explanative' },
      { question: 'Was sind die kritischen Erfolgsfaktoren?', type: 'explorative' },
      { question: 'Welche Schlüsse lassen sich für ähnliche Fälle ziehen?', type: 'generalizing' }
    ],
    qualityCriteria: ['Construct validity', 'Internal validity', 'External validity', 'Reliability']
  },

  // 🎯 THEMATISCHE ANALYSE nach Braun & Clarke
  thematicAnalysis: {
    id: 'thematic_analysis',
    name: 'Thematische Analyse',
    description: 'Identifikation, Analyse und Berichterstattung von Mustern in Daten',
    authors: 'Braun & Clarke, Boyatzis',
    steps: [
      {
        phase: 'Familiarization',
        description: 'Vertrautheit mit den Daten entwickeln',
        activities: ['Mehrfaches Lesen', 'Notizen machen', 'Erste Ideen sammeln'],
        aiSupport: 'Automatische Textvorverarbeitung'
      },
      {
        phase: 'Initial Coding',
        description: 'Systematische Kodierung interessanter Features',
        activities: ['Line-by-line coding', 'Semantic coding', 'Latent coding'],
        aiSupport: 'KI-gestützte Kodierungsvorschläge'
      },
      {
        phase: 'Theme Development',
        description: 'Codes zu potentiellen Themen zusammenfassen',
        activities: ['Code clustering', 'Theme mapping', 'Hierarchien entwickeln'],
        aiSupport: 'Themen-Clustering und Visualisierung'
      },
      {
        phase: 'Theme Review',
        description: 'Themen überprüfen und verfeinern',
        activities: ['Internal consistency', 'External distinctiveness', 'Theme refinement'],
        aiSupport: 'Themen-Validierung'
      },
      {
        phase: 'Definition & Naming',
        description: 'Themen final definieren und benennen',
        activities: ['Theme essence', 'Clear definitions', 'Compelling names'],
        aiSupport: 'Themen-Definition Support'
      },
      {
        phase: 'Write-up',
        description: 'Wissenschaftlichen Bericht erstellen',
        activities: ['Narrative construction', 'Evidence selection', 'Argument development'],
        aiSupport: 'Bericht-Generierung'
      }
    ],
    categories: [
      { name: 'Semantische Themen', description: 'Oberflächliche, explizite Bedeutungen' },
      { name: 'Latente Themen', description: 'Zugrundeliegende Ideen und Konzepte' },
      { name: 'Global Themes', description: 'Übergeordnete Meta-Themen' },
      { name: 'Organizing Themes', description: 'Mittlere Abstraktionsebene' },
      { name: 'Basic Themes', description: 'Grundlegende Themenelemente' },
      { name: 'Sub-Themes', description: 'Themenspezifische Unterkategorien' }
    ],
    researchQuestions: [
      { question: 'Welche Themen emergieren aus den Daten?', type: 'explorative' },
      { question: 'Wie hängen die identifizierten Themen zusammen?', type: 'relational' },
      { question: 'Was sind die dominanten Diskurse?', type: 'discourse' },
      { question: 'Welche Muster zeigen sich über verschiedene Teilnehmer hinweg?', type: 'pattern' }
    ],
    qualityCriteria: ['Rich description', 'Theoretical coherence', 'Active researcher role', 'Reflexivity']
  },

  // 🔀 MIXED METHODS nach Creswell
  mixedMethods: {
    id: 'mixed_methods',
    name: 'Mixed Methods Design',
    description: 'Integration qualitativer und quantitativer Ansätze',
    authors: 'Creswell, Tashakkori, Teddlie',
    steps: [
      {
        phase: 'Design Selection',
        description: 'Mixed Methods Design auswählen',
        activities: ['Sequential vs. Concurrent', 'Priority determination', 'Integration planning'],
        aiSupport: 'Design-Empfehlungen basierend auf Forschungsfragen'
      },
      {
        phase: 'Qualitative Strand',
        description: 'Qualitative Datensammlung und -analyse',
        activities: ['Qualitative sampling', 'Data collection', 'Thematic analysis'],
        aiSupport: 'Qualitative Analyse-Suite'
      },
      {
        phase: 'Quantitative Strand',
        description: 'Quantitative Datensammlung und -analyse',
        activities: ['Survey design', 'Statistical analysis', 'Hypothesis testing'],
        aiSupport: 'Quantitative Analyse-Integration'
      },
      {
        phase: 'Integration',
        description: 'Qualitative und quantitative Ergebnisse verbinden',
        activities: ['Data transformation', 'Joint displays', 'Meta-inferences'],
        aiSupport: 'Integrations-Visualisierungen'
      }
    ],
    categories: [
      { name: 'Convergent Findings', description: 'Übereinstimmende Ergebnisse beider Stränge' },
      { name: 'Divergent Findings', description: 'Widersprüchliche Ergebnisse' },
      { name: 'Expansion Findings', description: 'Erweiternde/vertiefende Erkenntnisse' },
      { name: 'Complementary Insights', description: 'Sich ergänzende Perspektiven' },
      { name: 'Confirmation Elements', description: 'Bestätigende Evidenz' },
      { name: 'Disconfirmation Elements', description: 'Widerlegende Evidenz' }
    ],
    researchQuestions: [
      { question: 'Wie ergänzen sich qualitative und quantitative Befunde?', type: 'integration' },
      { question: 'Wo zeigen sich Konvergenzen und Divergenzen?', type: 'comparison' },
      { question: 'Welche umfassenderen Schlüsse lassen sich ziehen?', type: 'meta_inference' },
      { question: 'Wie können beide Datentypen optimal integriert werden?', type: 'methodological' }
    ],
    qualityCriteria: ['Legitimation', 'Commensurability', 'Multiple validities', 'Integration quality']
  }
};

/**
 * 🎯 Template Selector Component
 */
export const MethodologyTemplateSelector = ({ onSelect, currentProject }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleTemplateSelect = (templateId) => {
    const template = MethodologyTemplates[templateId];
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate && onSelect) {
      onSelect(selectedTemplate);
      setShowPreview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(MethodologyTemplates).map(([key, template]) => (
          <div 
            key={key}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTemplateSelect(key)}
          >
            <div className="flex items-start gap-3 mb-4">
              {key === 'groundedTheory' && <Brain className="w-8 h-8 text-purple-600" />}
              {key === 'phenomenological' && <Search className="w-8 h-8 text-blue-600" />}
              {key === 'caseStudy' && <FileText className="w-8 h-8 text-green-600" />}
              {key === 'thematicAnalysis' && <Target className="w-8 h-8 text-orange-600" />}
              {key === 'mixedMethods' && <BarChart3 className="w-8 h-8 text-indigo-600" />}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.authors}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">{template.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{template.steps.length} Schritte</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
              <p className="text-sm text-gray-500 mt-1">nach {selectedTemplate.authors}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Steps */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">📋 Methodische Schritte</h3>
                <div className="space-y-3">
                  {selectedTemplate.steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {index + 1}. {step.phase}
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">{step.description}</p>
                      <div className="text-xs text-gray-600">
                        <strong>Aktivitäten:</strong> {step.activities.join(', ')}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        <strong>KI-Support:</strong> {step.aiSupport}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">💡 Vordefinierte Kategorien</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTemplate.categories.map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3">
                      <h4 className="font-medium text-sm">{category.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Questions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🎯 Beispiel-Forschungsfragen</h3>
                <div className="space-y-2">
                  {selectedTemplate.researchQuestions.map((rq, index) => (
                    <div key={index} className="bg-blue-50 rounded p-3">
                      <p className="text-sm text-blue-900">{rq.question}</p>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                        {rq.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Criteria */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🏆 Qualitätskriterien</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.qualityCriteria.map((criterion, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {criterion}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleApplyTemplate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Template anwenden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 🔧 Template Application Helper
 */
export const applyMethodologyTemplate = (template, currentProject) => {
  return {
    ...currentProject,
    methodology: {
      template: template.id,
      name: template.name,
      appliedAt: new Date().toISOString()
    },
    categories: [
      ...currentProject.categories,
      ...template.categories.map(cat => ({
        id: Date.now().toString() + Math.random(),
        name: cat.name,
        description: cat.description,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        isManual: false,
        isTemplate: true,
        templateSource: template.id
      }))
    ],
    researchQuestions: [
      ...currentProject.researchQuestions,
      ...template.researchQuestions.map(rq => ({
        id: Date.now().toString() + Math.random(),
        question: rq.question,
        type: rq.type,
        isTemplate: true,
        templateSource: template.id
      }))
    ],
    qualityCriteria: template.qualityCriteria
  };
};

export default MethodologyTemplates;
