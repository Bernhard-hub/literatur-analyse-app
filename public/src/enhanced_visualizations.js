// 📊 ENHANCED VISUALIZATIONS - Erweiterte Datenvisualisierung
// src/components/EnhancedVisualizations.js

import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart, BarChart3, Network, TrendingUp, Target, 
  Layers, GitBranch, Clock, Users, Zap, Eye, Download,
  ChevronDown, ChevronUp, Settings, Filter, RefreshCw
} from 'lucide-react';

/**
 * 🕸️ Interactive Category Network Visualization
 */
export const CategoryNetworkVisualization = ({ project, onCategorySelect }) => {
  const svgRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showConnections, setShowConnections] = useState(true);
  const [networkData, setNetworkData] = useState(null);

  useEffect(() => {
    if (project.categories.length > 0 && project.codings?.length > 0) {
      const data = generateNetworkData(project);
      setNetworkData(data);
      renderNetwork(data);
    }
  }, [project, showConnections]);

  const generateNetworkData = (project) => {
    const nodes = project.categories.map(category => {
      const codingCount = project.codings?.filter(c => c.categoryId === category.id).length || 0;
      return {
        id: category.id,
        name: category.name,
        color: category.color || '#666',
        size: Math.max(20, Math.min(80, codingCount * 5)),
        codingCount,
        type: category.isManual ? 'manual' : 'ai'
      };
    });

    // Calculate co-occurrence links
    const links = [];
    const cooccurrenceMatrix = {};

    // Build co-occurrence matrix from documents
    project.documents.forEach(doc => {
      const docCodings = project.codings?.filter(c => c.docId === doc.id) || [];
      const categoryIds = [...new Set(docCodings.map(c => c.categoryId))];
      
      for (let i = 0; i < categoryIds.length; i++) {
        for (let j = i + 1; j < categoryIds.length; j++) {
          const key = `${categoryIds[i]}-${categoryIds[j]}`;
          cooccurrenceMatrix[key] = (cooccurrenceMatrix[key] || 0) + 1;
        }
      }
    });

    // Create links from co-occurrence matrix
    Object.entries(cooccurrenceMatrix).forEach(([key, weight]) => {
      const [sourceId, targetId] = key.split('-');
      if (weight >= 2) { // Minimum co-occurrence threshold
        links.push({
          source: sourceId,
          target: targetId,
          weight,
          strength: Math.min(weight / 5, 1) // Normalize strength
        });
      }
    });

    return { nodes, links };
  };

  const renderNetwork = (data) => {
    if (!svgRef.current || !data) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 400;

    // Clear previous content
    svg.innerHTML = '';

    // Simple force-directed layout simulation
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Position nodes in a circle
    data.nodes.forEach((node, index) => {
      const angle = (index / data.nodes.length) * 2 * Math.PI;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
    });

    // Create SVG elements
    const svgElement = svg;

    // Draw links
    if (showConnections) {
      data.links.forEach(link => {
        const sourceNode = data.nodes.find(n => n.id === link.source);
        const targetNode = data.nodes.find(n => n.id === link.target);
        
        if (sourceNode && targetNode) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', sourceNode.x);
          line.setAttribute('y1', sourceNode.y);
          line.setAttribute('x2', targetNode.x);
          line.setAttribute('y2', targetNode.y);
          line.setAttribute('stroke', '#e2e8f0');
          line.setAttribute('stroke-width', Math.max(1, link.weight));
          line.setAttribute('opacity', 0.6);
          svgElement.appendChild(line);
        }
      });
    }

    // Draw nodes
    data.nodes.forEach(node => {
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.size);
      circle.setAttribute('fill', node.color);
      circle.setAttribute('stroke', node.type === 'manual' ? '#3b82f6' : '#8b5cf6');
      circle.setAttribute('stroke-width', selectedCategory === node.id ? 4 : 2);
      circle.setAttribute('opacity', 0.8);
      circle.style.cursor = 'pointer';
      
      circle.addEventListener('click', () => {
        setSelectedCategory(node.id);
        onCategorySelect && onCategorySelect(node);
      });
      
      svgElement.appendChild(circle);

      // Node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y + node.size + 15);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#374151');
      text.textContent = node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name;
      svgElement.appendChild(text);

      // Coding count badge
      const badge = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      badge.setAttribute('cx', node.x + node.size * 0.7);
      badge.setAttribute('cy', node.y - node.size * 0.7);
      badge.setAttribute('r', 12);
      badge.setAttribute('fill', '#ef4444');
      badge.setAttribute('stroke', 'white');
      badge.setAttribute('stroke-width', 2);
      svgElement.appendChild(badge);

      const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      badgeText.setAttribute('x', node.x + node.size * 0.7);
      badgeText.setAttribute('y', node.y - node.size * 0.7 + 4);
      badgeText.setAttribute('text-anchor', 'middle');
      badgeText.setAttribute('font-size', '10');
      badgeText.setAttribute('font-weight', 'bold');
      badgeText.setAttribute('fill', 'white');
      badgeText.textContent = node.codingCount;
      svgElement.appendChild(badgeText);
    });
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-600" />
          Kategorien-Netzwerk
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConnections(!showConnections)}
            className={`px-3 py-1 rounded text-sm ${showConnections ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
          >
            Verbindungen
          </button>
          <button
            onClick={() => renderNetwork(networkData)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          className="border rounded bg-gray-50"
        />
        
        {selectedCategory && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs">
            <h4 className="font-semibold text-gray-900">Kategorie Details</h4>
            {(() => {
              const category = project.categories.find(c => c.id === selectedCategory);
              const codingCount = project.codings?.filter(c => c.categoryId === selectedCategory).length || 0;
              return category ? (
                <div className="text-sm text-gray-600 mt-1">
                  <div><strong>{category.name}</strong></div>
                  <div>{codingCount} Kodierungen</div>
                  <div className="text-xs mt-1">{category.description}</div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-600"></div>
          <span>Manuell</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-purple-600"></div>
          <span>KI-generiert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-gray-400"></div>
          <span>Größe = Anzahl Kodierungen</span>
        </div>
      </div>
    </div>
  );
};

/**
 * 🕰️ Temporal Coding Pattern Analysis
 */
export const TemporalCodingVisualization = ({ project }) => {
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedPattern, setSelectedPattern] = useState(null);

  const generateTemporalData = () => {
    if (!project.codings?.length) return [];

    const codingsByDate = {};
    project.codings.forEach(coding => {
      const date = new Date(coding.created).toDateString();
      if (!codingsByDate[date]) {
        codingsByDate[date] = { date, total: 0, categories: {} };
      }
      codingsByDate[date].total++;
      
      const category = project.categories.find(c => c.id === coding.categoryId);
      if (category) {
        codingsByDate[date].categories[category.name] = 
          (codingsByDate[date].categories[category.name] || 0) + 1;
      }
    });

    return Object.values(codingsByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const temporalData = generateTemporalData();

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          Kodierungs-Zeitverlauf
        </h3>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="daily">Täglich</option>
          <option value="weekly">Wöchentlich</option>
          <option value="monthly">Monatlich</option>
        </select>
      </div>

      <div className="space-y-4">
        {temporalData.length > 0 ? (
          <>
            {/* Timeline Visualization */}
            <div className="relative h-32 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-end h-full">
                {temporalData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 rounded-t"
                      style={{ 
                        height: `${(day.total / Math.max(...temporalData.map(d => d.total))) * 80}px`,
                        width: '20px'
                      }}
                      title={`${day.date}: ${day.total} Kodierungen`}
                    />
                    <div className="text-xs text-gray-600 mt-1 writing-mode-vertical transform rotate-45">
                      {new Date(day.date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {temporalData.reduce((sum, day) => sum + day.total, 0)}
                </div>
                <div className="text-sm text-blue-700">Gesamt Kodierungen</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(temporalData.reduce((sum, day) => sum + day.total, 0) / temporalData.length)}
                </div>
                <div className="text-sm text-green-700">Durchschnitt/Tag</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...temporalData.map(d => d.total))}
                </div>
                <div className="text-sm text-purple-700">Maximum/Tag</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Keine Kodierungen für Zeitverlaufsanalyse verfügbar</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 🎯 Code Co-occurrence Matrix
 */
export const CodeCooccurrenceMatrix = ({ project }) => {
  const [matrixData, setMatrixData] = useState([]);
  const [sortBy, setSortBy] = useState('frequency');

  useEffect(() => {
    generateCooccurrenceMatrix();
  }, [project, sortBy]);

  const generateCooccurrenceMatrix = () => {
    if (!project.categories.length || !project.codings?.length) return;

    const matrix = {};
    const categoryNames = project.categories.map(c => c.name);
    
    // Initialize matrix
    categoryNames.forEach(cat1 => {
      matrix[cat1] = {};
      categoryNames.forEach(cat2 => {
        matrix[cat1][cat2] = 0;
      });
    });

    // Calculate co-occurrences within documents
    project.documents.forEach(doc => {
      const docCodings = project.codings.filter(c => c.docId === doc.id);
      const categoriesInDoc = docCodings.map(c => {
        const category = project.categories.find(cat => cat.id === c.categoryId);
        return category?.name;
      }).filter(Boolean);

      // Count co-occurrences
      for (let i = 0; i < categoriesInDoc.length; i++) {
        for (let j = 0; j < categoriesInDoc.length; j++) {
          if (categoriesInDoc[i] && categoriesInDoc[j]) {
            matrix[categoriesInDoc[i]][categoriesInDoc[j]]++;
          }
        }
      }
    });

    // Convert to array for easier handling
    const matrixArray = categoryNames.map(cat1 => ({
      category: cat1,
      cooccurrences: categoryNames.map(cat2 => ({
        with: cat2,
        count: matrix[cat1][cat2],
        percentage: matrix[cat1][cat1] > 0 ? (matrix[cat1][cat2] / matrix[cat1][cat1] * 100) : 0
      }))
    }));

    // Sort by total frequency if requested
    if (sortBy === 'frequency') {
      matrixArray.sort((a, b) => {
        const totalA = a.cooccurrences.reduce((sum, co) => sum + co.count, 0);
        const totalB = b.cooccurrences.reduce((sum, co) => sum + co.count, 0);
        return totalB - totalA;
      });
    }

    setMatrixData(matrixArray);
  };

  const getIntensityColor = (count, maxCount) => {
    if (maxCount === 0) return 'bg-gray-100';
    const intensity = count / maxCount;
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.3) return 'bg-blue-200';
    if (intensity < 0.6) return 'bg-blue-400';
    if (intensity < 0.8) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  const maxCount = Math.max(
    ...matrixData.flatMap(row => row.cooccurrences?.map(co => co.count) || [])
  );

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" />
          Code Co-occurrence Matrix
        </h3>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="alphabetical">Alphabetisch</option>
          <option value="frequency">Nach Häufigkeit</option>
        </select>
      </div>

      {matrixData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Kategorie</th>
                {matrixData.map(row => (
                  <th key={row.category} className="p-2 border-b text-center transform -rotate-45 min-w-[40px]">
                    <div className="w-full h-20 flex items-end justify-center">
                      <span className="writing-mode-vertical text-xs">
                        {row.category.length > 10 ? row.category.substring(0, 10) + '...' : row.category}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixData.map(row => (
                <tr key={row.category}>
                  <td className="p-2 border-b font-medium text-gray-900 max-w-[150px] truncate">
                    {row.category}
                  </td>
                  {row.cooccurrences?.map(co => (
                    <td 
                      key={co.with} 
                      className={`p-2 border-b text-center ${getIntensityColor(co.count, maxCount)} ${
                        co.count > 0 ? 'text-white' : 'text-gray-600'
                      }`}
                      title={`${row.category} ↔ ${co.with}: ${co.count} Co-occurrences`}
                    >
                      {co.count > 0 ? co.count : ''}
                    </td>
                  )) || []}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
            <span>Intensität:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-100 border"></div>
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-200 border"></div>
              <span>Niedrig</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-600 border"></div>
              <span>Hoch</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-800 border"></div>
              <span>Sehr hoch</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Layers className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Keine Daten für Co-occurrence Matrix verfügbar</p>
        </div>
      )}
    </div>
  );
};

/**
 * 🌳 Hierarchical Category Tree
 */
export const HierarchicalCategoryTree = ({ project, onCategoryClick }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    generateTreeData();
  }, [project]);

  const generateTreeData = () => {
    if (!project.categories.length) return;

    // Simple hierarchical grouping by category properties
    const tree = project.categories.map(category => {
      const codingCount = project.codings?.filter(c => c.categoryId === category.id).length || 0;
      const relatedCodings = project.codings?.filter(c => c.categoryId === category.id) || [];
      
      // Group related text passages
      const subcategories = relatedCodings.reduce((acc, coding) => {
        // Simple grouping by first few words of coding explanation
        const key = coding.explanation?.split(' ').slice(0, 3).join(' ') || 'Andere';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(coding);
        return acc;
      }, {});

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        codingCount,
        type: category.isManual ? 'manual' : 'ai',
        children: Object.entries(subcategories).map(([key, codings]) => ({
          id: `${category.id}-${key}`,
          name: key,
          count: codings.length,
          codings
        }))
      };
    });

    setTreeData(tree);
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div className="mb-2">
        <div 
          className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer ${
            level > 0 ? 'ml-6' : ''
          }`}
          onClick={() => {
            if (hasChildren) toggleNode(node.id);
            if (level === 0) onCategoryClick?.(node);
          }}
        >
          {hasChildren && (
            <button className="p-1">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600 transform -rotate-90" />
              )}
            </button>
          )}
          
          {level === 0 && (
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: node.color }}
            />
          )}
          
          <span className={`flex-1 ${level === 0 ? 'font-medium' : 'text-sm text-gray-600'}`}>
            {node.name}
          </span>
          
          <span className={`text-xs px-2 py-1 rounded-full ${
            level === 0 
              ? node.type === 'manual' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {level === 0 ? node.codingCount : node.count}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-green-600" />
          Hierarchische Kategorien-Struktur
        </h3>
        <button
          onClick={() => setExpandedNodes(new Set(treeData.map(node => node.id)))}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Alle ausklappen
        </button>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {treeData.length > 0 ? (
          treeData.map(node => (
            <TreeNode key={node.id} node={node} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <GitBranch className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Keine Kategorien für Hierarchie-Darstellung verfügbar</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 📊 Visualization Dashboard Container
 */
export const VisualizationDashboard = ({ project, onCategorySelect }) => {
  const [activeVisualization, setActiveVisualization] = useState('network');

  const visualizations = [
    { id: 'network', name: 'Kategorie-Netzwerk', icon: Network },
    { id: 'temporal', name: 'Zeitverlauf', icon: Clock },
    { id: 'cooccurrence', name: 'Co-occurrence Matrix', icon: Layers },
    { id: 'hierarchy', name: 'Hierarchie-Baum', icon: GitBranch }
  ];

  return (
    <div className="space-y-6">
      {/* Visualization Selector */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {visualizations.map(viz => {
            const Icon = viz.icon;
            return (
              <button
                key={viz.id}
                onClick={() => setActiveVisualization(viz.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeVisualization === viz.id
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {viz.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Visualization */}
      <div>
        {activeVisualization === 'network' && (
          <CategoryNetworkVisualization 
            project={project} 
            onCategorySelect={onCategorySelect} 
          />
        )}
        {activeVisualization === 'temporal' && (
          <TemporalCodingVisualization project={project} />
        )}
        {activeVisualization === 'cooccurrence' && (
          <CodeCooccurrenceMatrix project={project} />
        )}
        {activeVisualization === 'hierarchy' && (
          <HierarchicalCategoryTree 
            project={project} 
            onCategoryClick={onCategorySelect} 
          />
        )}
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Visualisierungen exportieren</h4>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              SVG
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationDashboard;