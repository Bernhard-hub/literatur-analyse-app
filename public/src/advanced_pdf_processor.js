// 📄 ADVANCED PDF PROCESSOR - Wissenschaftliche PDF-Verarbeitung
// src/utils/advancedPDFProcessor.js

import * as pdfjsLib from 'pdfjs-dist';

// PDF.js Worker konfigurieren
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

/**
 * 🧬 Erweiterte PDF-Text-Extraktion mit wissenschaftlichen Standards
 */
export class AdvancedPDFProcessor {
  constructor() {
    this.options = {
      preserveLayout: true,
      extractTables: true,
      extractFootnotes: true,
      extractHeaders: true,
      detectColumns: true,
      cleanText: true
    };
  }

  /**
   * 📖 Hauptfunktion für erweiterte PDF-Verarbeitung
   */
  async extractAdvancedText(file, options = {}) {
    const config = { ...this.options, ...options };
    
    try {
      console.log('🔍 Starte erweiterte PDF-Analyse...');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const extractionResult = {
        fullText: '',
        pages: [],
        structure: {
          headers: [],
          footnotes: [],
          tables: [],
          columns: [],
          citations: []
        },
        metadata: {
          pageCount: pdf.numPages,
          title: '',
          author: '',
          keywords: '',
          processingTime: 0
        }
      };

      const startTime = Date.now();

      // 📋 PDF-Metadaten extrahieren
      try {
        const metadata = await pdf.getMetadata();
        if (metadata.info) {
          extractionResult.metadata.title = metadata.info.Title || '';
          extractionResult.metadata.author = metadata.info.Author || '';
          extractionResult.metadata.keywords = metadata.info.Keywords || '';
        }
      } catch (error) {
        console.warn('Metadaten nicht verfügbar:', error);
      }

      // 📄 Seite für Seite verarbeiten
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`📖 Verarbeite Seite ${pageNum}/${pdf.numPages}`);
        
        const page = await pdf.getPage(pageNum);
        const pageData = await this.processPage(page, pageNum, config);
        
        extractionResult.pages.push(pageData);
        extractionResult.fullText += pageData.cleanText + '\n\n';
        
        // Strukturelemente sammeln
        extractionResult.structure.headers.push(...pageData.headers);
        extractionResult.structure.footnotes.push(...pageData.footnotes);
        extractionResult.structure.tables.push(...pageData.tables);
        extractionResult.structure.citations.push(...pageData.citations);
      }

      // 🧹 Post-Processing
      extractionResult.fullText = this.cleanFullText(extractionResult.fullText);
      extractionResult.structure = this.analyzeStructure(extractionResult.structure);
      extractionResult.metadata.processingTime = Date.now() - startTime;

      console.log('✅ Erweiterte PDF-Analyse abgeschlossen:', {
        pages: extractionResult.pages.length,
        characters: extractionResult.fullText.length,
        headers: extractionResult.structure.headers.length,
        footnotes: extractionResult.structure.footnotes.length,
        tables: extractionResult.structure.tables.length,
        processingTime: `${extractionResult.metadata.processingTime}ms`
      });

      return extractionResult;

    } catch (error) {
      console.error('❌ Fehler bei erweiterter PDF-Verarbeitung:', error);
      throw new Error(`Erweiterte PDF-Verarbeitung fehlgeschlagen: ${error.message}`);
    }
  }

  /**
   * 📖 Einzelne Seite verarbeiten
   */
  async processPage(page, pageNum, config) {
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    
    const pageData = {
      pageNumber: pageNum,
      rawText: '',
      cleanText: '',
      headers: [],
      footnotes: [],
      tables: [],
      citations: [],
      layout: {
        width: viewport.width,
        height: viewport.height,
        columns: []
      }
    };

    // 📝 Text und Position extrahieren
    const textItems = textContent.items.map(item => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: item.height,
      fontSize: item.height,
      fontName: item.fontName || ''
    }));

    // 🗂️ Text nach Y-Position sortieren (Top-Down)
    textItems.sort((a, b) => b.y - a.y);

    // 📊 Spalten erkennen
    if (config.detectColumns) {
      pageData.layout.columns = this.detectColumns(textItems, viewport);
    }

    // 📄 Strukturelemente identifizieren
    for (const item of textItems) {
      const text = item.text.trim();
      if (!text) continue;

      pageData.rawText += text + ' ';

      // 📋 Header erkennen (große Schrift, zentriert)
      if (this.isHeader(item, textItems)) {
        pageData.headers.push({
          text: text,
          level: this.getHeaderLevel(item),
          page: pageNum,
          position: { x: item.x, y: item.y }
        });
      }

      // 📝 Fußnoten erkennen (kleine Schrift, unten)
      if (this.isFootnote(item, viewport)) {
        pageData.footnotes.push({
          text: text,
          page: pageNum,
          position: { x: item.x, y: item.y }
        });
      }

      // 📚 Zitationen erkennen
      if (this.isCitation(text)) {
        pageData.citations.push({
          text: text,
          page: pageNum,
          type: this.getCitationType(text)
        });
      }

      // 📊 Tabellen erkennen (vereinfacht)
      if (this.isTableElement(item, textItems)) {
        // Tabellenerkennung implementieren
      }
    }

    // 🧹 Text reinigen
    pageData.cleanText = this.cleanPageText(pageData.rawText);

    return pageData;
  }

  /**
   * 🏗️ Spalten-Erkennung
   */
  detectColumns(textItems, viewport) {
    const columns = [];
    const threshold = viewport.width * 0.3; // 30% der Seitenbreite
    
    const xPositions = [...new Set(textItems.map(item => Math.round(item.x / 10) * 10))].sort((a, b) => a - b);
    
    let currentColumn = { start: 0, end: viewport.width, items: [] };
    
    for (const x of xPositions) {
      if (x > currentColumn.start + threshold) {
        if (currentColumn.items.length > 0) {
          columns.push(currentColumn);
        }
        currentColumn = { start: x, end: viewport.width, items: [] };
      }
    }
    
    if (currentColumn.items.length > 0) {
      columns.push(currentColumn);
    }

    return columns;
  }

  /**
   * 📋 Header-Erkennung
   */
  isHeader(item, allItems) {
    const avgFontSize = allItems.reduce((sum, i) => sum + i.fontSize, 0) / allItems.length;
    const isLargeFont = item.fontSize > avgFontSize * 1.3;
    const hasHeaderPattern = /^(\d+\.?\d*\s+|\w+\.\s+)/.test(item.text.trim());
    
    return isLargeFont || hasHeaderPattern;
  }

  /**
   * 📝 Fußnoten-Erkennung
   */
  isFootnote(item, viewport) {
    const isBottomArea = item.y < viewport.height * 0.15; // Untere 15%
    const isSmallFont = item.fontSize < 10;
    const hasFootnotePattern = /^\d+\s+/.test(item.text.trim());
    
    return isBottomArea && (isSmallFont || hasFootnotePattern);
  }

  /**
   * 📚 Zitations-Erkennung
   */
  isCitation(text) {
    const citationPatterns = [
      /\(\s*\w+,?\s+\d{4}\s*\)/,  // (Author, 2023)
      /\(\s*\w+\s+et\s+al\.?,?\s+\d{4}\s*\)/, // (Smith et al., 2023)
      /\[\d+\]/, // [1]
      /\(\d+\)/, // (1)
      /doi:\s*10\.\d+/i, // DOI
      /https?:\/\/[^\s]+/ // URLs
    ];
    
    return citationPatterns.some(pattern => pattern.test(text));
  }

  /**
   * 📊 Tabellen-Element-Erkennung
   */
  isTableElement(item, allItems) {
    // Vereinfachte Tabellenerkennung
    const hasTabularSpacing = item.text.includes('\t') || /\s{3,}/.test(item.text);
    const isAligned = allItems.filter(i => Math.abs(i.x - item.x) < 5).length > 2;
    
    return hasTabularSpacing || isAligned;
  }

  /**
   * 🧹 Text-Reinigung
   */
  cleanPageText(rawText) {
    return rawText
      .replace(/\s+/g, ' ') // Mehrfache Leerzeichen
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Satzende-Korrektur
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Wortgrenze-Korrektur
      .replace(/\s+([.,:;!?])/g, '$1') // Satzzeichen-Korrektur
      .trim();
  }

  /**
   * 🧹 Volltext-Reinigung
   */
  cleanFullText(fullText) {
    return fullText
      .replace(/\n{3,}/g, '\n\n') // Mehrfache Zeilenumbrüche
      .replace(/^\s+|\s+$/gm, '') // Zeilenanfang/-ende trimmen
      .replace(/([.!?])\n([a-z])/g, '$1 $2') // Satzumbrüche korrigieren
      .replace(/(\w)-\s*\n(\w)/g, '$1$2') // Silbentrennung auflösen
      .trim();
  }

  /**
   * 🏗️ Struktur-Analyse
   */
  analyzeStructure(structure) {
    // Header-Hierarchie aufbauen
    structure.headers = structure.headers.map((header, index) => ({
      ...header,
      id: `header_${index}`,
      level: this.determineHeaderLevel(header, structure.headers)
    }));

    // Fußnoten verknüpfen
    structure.footnotes = structure.footnotes.map((footnote, index) => ({
      ...footnote,
      id: `footnote_${index}`,
      linkedToText: this.findFootnoteLink(footnote)
    }));

    // Zitationen kategorisieren
    structure.citations = structure.citations.map((citation, index) => ({
      ...citation,
      id: `citation_${index}`,
      category: this.categorizeCitation(citation.text)
    }));

    return structure;
  }

  /**
   * 📊 Header-Level bestimmen
   */
  determineHeaderLevel(header, allHeaders) {
    // Einfache Heuristik basierend auf Schriftgröße und Position
    return 1; // Vereinfacht
  }

  /**
   * 🔗 Fußnoten-Verknüpfung finden
   */
  findFootnoteLink(footnote) {
    // Vereinfacht - würde nach Nummern im Haupttext suchen
    return null;
  }

  /**
   * 📚 Zitations-Kategorisierung
   */
  categorizeCitation(text) {
    if (/doi:/i.test(text)) return 'DOI';
    if (/https?:\/\//.test(text)) return 'URL';
    if (/\(\s*\w+,?\s+\d{4}\s*\)/.test(text)) return 'Author-Date';
    if (/\[\d+\]/.test(text)) return 'Numeric';
    return 'Other';
  }

  /**
   * 📋 Header-Level bestimmen
   */
  getHeaderLevel(item) {
    if (item.fontSize > 16) return 1;
    if (item.fontSize > 14) return 2;
    if (item.fontSize > 12) return 3;
    return 4;
  }

  /**
   * 📚 Zitations-Typ bestimmen
   */
  getCitationType(text) {
    if (/doi:/i.test(text)) return 'DOI';
    if (/https?:\/\//.test(text)) return 'URL';
    if (/\(\s*\w+,?\s+\d{4}\s*\)/.test(text)) return 'AuthorDate';
    if (/\[\d+\]/.test(text)) return 'Numeric';
    return 'Other';
  }
}

/**
 * 🚀 Hauptexport-Funktion für einfache Verwendung
 */
export async function extractAdvancedPDFText(file, options = {}) {
  const processor = new AdvancedPDFProcessor();
  return await processor.extractAdvancedText(file, options);
}

/**
 * 📊 PDF-Analyse-Statistiken
 */
export function generatePDFAnalysisReport(extractionResult) {
  return {
    summary: {
      pages: extractionResult.pages.length,
      totalCharacters: extractionResult.fullText.length,
      wordCount: extractionResult.fullText.split(/\s+/).filter(w => w.length > 0).length,
      processingTime: extractionResult.metadata.processingTime
    },
    structure: {
      headers: extractionResult.structure.headers.length,
      footnotes: extractionResult.structure.footnotes.length,
      citations: extractionResult.structure.citations.length,
      tables: extractionResult.structure.tables.length
    },
    quality: {
      averagePageLength: Math.round(extractionResult.fullText.length / extractionResult.pages.length),
      structureRichness: (extractionResult.structure.headers.length + extractionResult.structure.footnotes.length) / extractionResult.pages.length,
      citationDensity: extractionResult.structure.citations.length / extractionResult.pages.length
    }
  };
}

export default AdvancedPDFProcessor;