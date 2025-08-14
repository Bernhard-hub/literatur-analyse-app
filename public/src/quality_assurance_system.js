// 🏆 QUALITY ASSURANCE SYSTEM - Wissenschaftliche Qualitätssicherung
// src/components/QualityAssuranceSystem.js

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, Award, 
  BarChart3, Target, Users, FileText, Brain,
  TrendingUp, Shield, AlertCircle, Info
} from 'lucide-react';

/**
 * 🧮 Wissenschaftliche Qualitäts-Metriken
 */
export class QualityMetrics {
  static calculateCodingDensity(project) {
    if (!project.documents.length || !project.codings?.length) return 0;
    
    const totalWords = project.documents.reduce((sum, doc) => sum + doc.wordCount, 0);
    const codingDensity = project.codings.length / (totalWords / 100); // Kodierungen pro 100 Wörter
    
    return {
      value: Math.round(codingDensity * 100) / 100,
      benchmark: 2.5, // Wissenschaftlicher Richtwert
      status: codingDensity >= 2.0 ? 'excellent' : codingDensity >= 1.5 ? 'good' : codingDensity >= 1.0 ? 'acceptable' : 'low'
    };
  }

  static calculateCategorySaturation(project) {
    if (!project.categories.length || !project.codings?.length) return 0;
    
    const categoryUsage = {};
    project.codings.forEach(coding => {
      const category = project.categories.find(c => c.id === coding.categoryId);
      if (category) {
        categoryUsage[category.name] = (categoryUsage[category.name] || 0) + 1;
      }
    });

    const usedCategories = Object.keys(categoryUsage).length;
    const saturationRate = usedCategories / project.categories.length;
    const evenDistribution = this.calculateDistributionEvenness(categoryUsage);
    
    return {
      value: Math.round(saturationRate * 100),
      distribution: Math.round(evenDistribution * 100),
      benchmark: 85,
      status: saturationRate >= 0.8 ? 'excellent' : saturationRate >= 0.6 ? 'good' : 'needs_improvement'
    };
  }

  static calculateInterRaterReliability(project) {
    if (!project.interRaterReliability) {
      return {
        value: null,
        benchmark: 0.7,
        status: 'not_available',
        coders: project.teamResults?.length || 0
      };
    }

    const kappa = parseFloat(project.interRaterReliability.kappa);
    return {
      value: kappa,
      benchmark: 0.7,
      status: kappa >= 0.8 ? 'excellent' : kappa >= 0.7 ? 'good' : kappa >= 0.6 ? 'acceptable' : 'low',
      coders: project.interRaterReliability.coders,
      agreements: project.interRaterReliability.agreements,
      comparisons: project.interRaterReliability.totalComparisons
    };
  }

  static calculateMethodologicalCompliance(project) {
    const checks = {
      hasDocuments: project.documents.length > 0,
      hasCategories: project.categories.length >= 3,
      hasResearchQuestions: project.researchQuestions.length > 0,
      hasCoding: project.codings?.length > 0,
      hasPatterns: project.patterns?.length > 0,
      hasInterpretation: project.interpretations?.length > 0,
      hasTeamValidation: project.teamResults?.length >= 2,
      hasReliability: project.interRaterReliability !== null
    };

    const completed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const compliance = completed / total;

    return {
      value: Math.round(compliance * 100),
      benchmark: 80,
      status: compliance >= 0.9 ? 'excellent' : compliance >= 0.7 ? 'good' : 'needs_improvement',
      checks,
      completed,
      total
    };
  }

  static calculateDistributionEvenness(usage) {
    const values = Object.values(usage);
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Normalisierte Gleichmäßigkeit (je niedriger die Standardabweichung, desto gleichmäßiger)
    return Math.max(0, 1 - (standardDeviation / mean));
  }

  static generateQualityReport(project) {
    const codingDensity = this.calculateCodingDensity(project);
    const categorySaturation = this.calculateCategorySaturation(project);
    const interRaterReliability = this.calculateInterRaterReliability(project);
    const methodologicalCompliance = this.calculateMethodologicalCompliance(project);

    const overallScore = this.calculateOverallQuality({
      codingDensity,
      categorySaturation,
      interRaterReliability,
      methodologicalCompliance
    });

    return {
      overallScore,
      metrics: {
        codingDensity,
        categorySaturation,
        interRaterReliability,
        methodologicalCompliance
      },
      recommendations: this.generateRecommendations({
        codingDensity,
        categorySaturation,
        interRaterReliability,
        methodologicalCompliance
      }),
      timestamp: new Date().toISOString()
    };
  }

  static calculateOverallQuality(metrics) {
    let totalWeight = 0;
    let weightedSum = 0;

    // Kodierungsdichte (20%)
    if (metrics.codingDensity.value !== null) {
      const normalized = Math.min(100, (metrics.codingDensity.value / metrics.codingDensity.benchmark) * 100);
      weightedSum += normalized * 0.2;
      totalWeight += 0.2;
    }

    // Kategoriensättigung (25%)
    weightedSum += metrics.categorySaturation.value * 0.25;
    totalWeight += 0.25;

    // Inter-Rater-Reliabilität (30%)
    if (metrics.interRaterReliability.value !== null) {
      const normalized = (metrics.interRaterReliability.value / metrics.interRaterReliability.benchmark) * 100;
      weightedSum += Math.min(100, normalized) * 0.3;
      totalWeight += 0.3;
    }

    // Methodische Konformität (25%)
    weightedSum += metrics.methodologicalCompliance.value * 0.25;
    totalWeight += 0.25;

    const score = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    
    return {
      value: score,
      grade: score >= 90 ? 'A+' : score >= 85 ? 'A' : score >= 80 ? 'B+' : score >= 75 ? 'B' : score >= 70 ? 'C+' : score >= 65 ? 'C' : 'D',
      status: score >= 85 ? 'excellent' : score >= 75 ? 'good' : score >= 65 ? 'acceptable' : 'needs_improvement'
    };
  }

  static generateRecommendations(metrics) {
    const recommendations = [];

    // Kodierungsdichte
    if (metrics.codingDensity.status === 'low') {
      recommendations.push({
        type: 'critical',
        category: 'Kodierungsdichte',
        message: 'Zu wenige Kodierungen pro Text. Erhöhen Sie die Kodierungstiefe.',
        action: 'Führen Sie eine intensivere Kodierung durch oder überprüfen Sie die Kategoriendefinitionen.'
      });
    }

    // Kategoriensättigung
    if (metrics.categorySaturation.status === 'needs_improvement') {
      recommendations.push({
        type: 'warning',
        category: 'Kategoriensättigung',
        message: 'Nicht alle Kategorien werden ausreichend verwendet.',
        action: 'Überprüfen Sie ungenutzte Kategorien oder verfeinern Sie das Kategoriensystem.'
      });
    }

    // Inter-Rater-Reliabilität
    if (metrics.interRaterReliability.value === null) {
      recommendations.push({
        type: 'info',
        category: 'Reliabilität',
        message: 'Keine Inter-Rater-Reliabilität verfügbar.',
        action: 'Führen Sie eine Team-Kodierung durch um die wissenschaftliche Qualität zu erhöhen.'
      });
    } else if (metrics.interRaterReliability.status === 'low') {
      recommendations.push({
        type: 'critical',
        category: 'Reliabilität',
        message: `Cohen's Kappa (${metrics.interRaterReliability.value}) unter wissenschaftlichem Standard (0.7).`,
        action: 'Verbessern Sie die Kategoriendefinitionen oder führen Sie Kodiererschulungen durch.'
      });
    }

    // Methodische Konformität
    if (metrics.methodologicalCompliance.status === 'needs_improvement') {
      const missing = Object.entries(metrics.methodologicalCompliance.checks)
        .filter(([key, value]) => !value)
        .map(([key]) => key);
      
      recommendations.push({
        type: 'warning',
        category: 'Methodische Vollständigkeit',
        message: `Fehlende Schritte: ${missing.join(', ')}`,
        action: 'Vervollständigen Sie die methodischen Schritte für eine wissenschaftlich fundierte Analyse.'
      });
    }

    return recommendations;
  }
}

/**
 * 🎯 Quality Assurance Dashboard Component
 */
export const QualityAssuranceDashboard = ({ project, onUpdate }) => {
  const [qualityReport, setQualityReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (project) {
      const report = QualityMetrics.generateQualityReport(project);
      setQualityReport(report);
    }
  }, [project]);

  if (!qualityReport) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Qualitätsanalyse wird geladen...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'acceptable': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'needs_improvement': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />;
      case 'good': return <CheckCircle className="w-5 h-5" />;
      case 'acceptable': return <AlertTriangle className="w-5 h-5" />;
      case 'needs_improvement': return <AlertTriangle className="w-5 h-5" />;
      case 'low': return <XCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-lg">
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">🏆 Wissenschaftliche Qualitätssicherung</h2>
              <p className="text-gray-600">Methodische Standards und Gütekriterien</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{qualityReport.overallScore.value}%</div>
            <div className="text-lg font-semibold text-gray-700">Note: {qualityReport.overallScore.grade}</div>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`p-6 border-b ${getStatusColor(qualityReport.overallScore.status)}`}>
        <div className="flex items-center gap-3">
          {getStatusIcon(qualityReport.overallScore.status)}
          <div>
            <h3 className="font-semibold">
              Gesamtbewertung: {qualityReport.overallScore.status === 'excellent' ? 'Exzellent' :
                               qualityReport.overallScore.status === 'good' ? 'Gut' :
                               qualityReport.overallScore.status === 'acceptable' ? 'Akzeptabel' : 'Verbesserung erforderlich'}
            </h3>
            <p className="text-sm">
              {qualityReport.overallScore.status === 'excellent' && 'Höchste wissenschaftliche Standards erfüllt'}
              {qualityReport.overallScore.status === 'good' && 'Gute wissenschaftliche Qualität erreicht'}
              {qualityReport.overallScore.status === 'acceptable' && 'Grundstandards erfüllt, Verbesserungen möglich'}
              {qualityReport.overallScore.status === 'needs_improvement' && 'Wichtige Qualitätskriterien nicht erfüllt'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Kodierungsdichte */}
          <div className={`p-4 rounded-lg border ${getStatusColor(qualityReport.metrics.codingDensity.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-6 h-6" />
              <span className="text-2xl font-bold">{qualityReport.metrics.codingDensity.value}</span>
            </div>
            <h4 className="font-semibold mb-1">Kodierungsdichte</h4>
            <p className="text-xs">Kodierungen pro 100 Wörter</p>
            <p className="text-xs mt-1">Benchmark: {qualityReport.metrics.codingDensity.benchmark}</p>
          </div>

          {/* Kategoriensättigung */}
          <div className={`p-4 rounded-lg border ${getStatusColor(qualityReport.metrics.categorySaturation.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6" />
              <span className="text-2xl font-bold">{qualityReport.metrics.categorySaturation.value}%</span>
            </div>
            <h4 className="font-semibold mb-1">Kategoriensättigung</h4>
            <p className="text-xs">Verwendete Kategorien</p>
            <p className="text-xs mt-1">Verteilung: {qualityReport.metrics.categorySaturation.distribution}%</p>
          </div>

          {/* Inter-Rater-Reliabilität */}
          <div className={`p-4 rounded-lg border ${getStatusColor(qualityReport.metrics.interRaterReliability.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6" />
              <span className="text-2xl font-bold">
                {qualityReport.metrics.interRaterReliability.value !== null 
                  ? qualityReport.metrics.interRaterReliability.value.toFixed(2)
                  : 'N/A'
                }
              </span>
            </div>
            <h4 className="font-semibold mb-1">Cohen's Kappa</h4>
            <p className="text-xs">Inter-Rater-Reliabilität</p>
            <p className="text-xs mt-1">
              {qualityReport.metrics.interRaterReliability.coders} Kodierer
            </p>
          </div>

          {/* Methodische Konformität */}
          <div className={`p-4 rounded-lg border ${getStatusColor(qualityReport.metrics.methodologicalCompliance.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6" />
              <span className="text-2xl font-bold">{qualityReport.metrics.methodologicalCompliance.value}%</span>
            </div>
            <h4 className="font-semibold mb-1">Methodische Vollständigkeit</h4>
            <p className="text-xs">Abgeschlossene Schritte</p>
            <p className="text-xs mt-1">
              {qualityReport.metrics.methodologicalCompliance.completed}/{qualityReport.metrics.methodologicalCompliance.total} Schritte
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {qualityReport.recommendations.length > 0 && (
        <div className="border-t p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Verbesserungsempfehlungen
          </h3>
          <div className="space-y-3">
            {qualityReport.recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'critical' ? 'bg-red-50 border-red-400' :
                  rec.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {rec.type === 'critical' ? <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" /> :
                   rec.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" /> :
                   <Info className="w-5 h-5 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.category}</h4>
                    <p className="text-sm text-gray-700 mt-1">{rec.message}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Empfehlung:</strong> {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Toggle */}
      <div className="border-t p-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showDetails ? 'Details ausblenden' : 'Detaillierte Analyse anzeigen'}
        </button>
        
        {showDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Detaillierte Metriken</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Analysezeitpunkt:</strong> {new Date(qualityReport.timestamp).toLocaleString('de-DE')}</div>
              <div><strong>Dokumente:</strong> {project.documents.length}</div>
              <div><strong>Kategorien:</strong> {project.categories.length}</div>
              <div><strong>Kodierungen:</strong> {project.codings?.length || 0}</div>
              <div><strong>Team-Mitglieder:</strong> {project.teamResults?.length || 0}</div>
              {qualityReport.metrics.interRaterReliability.value !== null && (
                <div><strong>Übereinstimmungen:</strong> {qualityReport.metrics.interRaterReliability.agreements}/{qualityReport.metrics.interRaterReliability.comparisons}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityAssuranceDashboard;