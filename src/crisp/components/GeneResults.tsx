"use client";
import React from 'react';
import { Download, ArrowLeft, Database, Hash, Dna as Dna2, Star } from 'lucide-react';
import { GeneData } from '../types/GeneData';
import { generatePDF } from '../utils/pdfGenerator';
import ReactMarkdown from 'react-markdown';
import dynamic from "next/dynamic";
import type { FC } from "react";
import { DetailedGeneSection } from './DetailedGeneSection';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: () => <div className="text-center py-8">Loading chart...</div> }) as FC<any>;
import { FaSeedling, FaTint, FaMoneyBillWave } from 'react-icons/fa';



interface GeneResultsProps {
  data: GeneData;
  onNewSearch: () => void;
}

export const GeneResults: React.FC<GeneResultsProps> = ({ data, onNewSearch }) => {
  const handleDownloadPDF = () => {
    generatePDF(data);
  };

  // Visualization data
  const grnas = data.top_grnas;

  // Compute min/max for zooming in on gRNA region
  const minStart = Math.min(...grnas.map(g => g.start));
  const maxStart = Math.max(...grnas.map(g => g.start));
  const xPadding = Math.max(100, Math.round((maxStart - minStart) * 0.2));
  const xMin = Math.max(0, minStart - xPadding);
  const xMax = maxStart + xPadding;

  // Check if all gRNAs are at the same position (likely a backend/data issue)
  const allSamePosition = grnas.every(g => g.start === grnas[0].start);

  // Infographic summary points (customize as needed)
  const summaryPoints = [
    {
      icon: <FaSeedling className="text-green-600 w-6 h-6" />,
      label: 'Increased Yield Stability',
      desc: 'Consistent yields even under drought conditions.'
    },
    {
      icon: <FaTint className="text-blue-500 w-6 h-6" />,
      label: 'Reduced Water Usage',
      desc: 'Plants may require less irrigation.'
    },
    {
      icon: <FaMoneyBillWave className="text-yellow-600 w-6 h-6" />,
      label: 'Improved Resource Efficiency',
      desc: 'Lower costs for irrigation and inputs.'
    }
  ];

  // Compute quality from score
  const getScoreBadge = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Good';
    return 'Fair';
  };
  const qualityColor = (quality: string) => {
    if (quality === 'Excellent') return 'green';
    if (quality === 'Good') return 'orange';
    return 'red';
  };

  let plotError = null;
  let plotContent = null;
  try {
    plotContent = (
      <Plot
        data={[
          {
            x: grnas.map(g => g.start),
            y: grnas.map((g, i) => i + 1),
            text: grnas.map((g, i) => `Rank: ${i+1}<br>Score: ${g.score}<br>Quality: ${getScoreBadge(g.score)}`),
            mode: 'markers+text',
            marker: { size: 16, color: grnas.map(g => qualityColor(getScoreBadge(g.score))) },
            type: 'scatter',
            textposition: 'right',
            name: 'gRNAs',
          },
          {
            x: [xMin, xMax],
            y: [0, 0],
            mode: 'lines',
            line: { color: 'black', width: 8 },
            type: 'scatter',
            hoverinfo: 'skip',
            showlegend: false,
            name: 'Gene',
          }
        ]}
        layout={{
          title: '',
          xaxis: { title: 'Gene Position (bp)', range: [xMin, xMax] },
          yaxis: { title: 'gRNA Rank', tickvals: grnas.map((g, i) => i + 1), showgrid: false, zeroline: false },
          height: 350,
          margin: { t: 10, b: 40, l: 40, r: 10 },
        }}
        config={{ displayModeBar: false }}
      />
    );
  } catch (e) {
    plotError = e;
  }



  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewSearch}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          aria-label="New Search"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>New Search</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          aria-label="Download Report"
        >
          <Download className="h-4 w-4" />
          <span>Download Report</span>
        </button>
      </div>

      {/* Gene Overview */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Dna2 className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gene Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-blue-800 mb-1">Crop</p>
            <p className="text-xl font-bold text-blue-900">{data.crop}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-green-800 mb-1">Trait</p>
            <p className="text-xl font-bold text-green-900">{data.trait}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-purple-800 mb-1">Gene ID</p>
            <p className="text-xl font-bold text-purple-900">{data.gene.ensembl_id}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
            <p className="text-sm font-medium text-orange-800 mb-1">Sequence Length</p>
            <p className="text-xl font-bold text-orange-900">{data.sequence_length.toLocaleString()} bp</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Source: {data.source}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Gene Symbol: {data.gene.symbol}</span>
          </div>
        </div>
      </div>

      {/* gRNA Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Star className="h-6 w-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Top CRISPR gRNAs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Sequence (5' → 3')</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">PAM</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Start Position</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Strand</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Score</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Quality</th>
              </tr>
            </thead>
            <tbody>
              {data.top_grnas.map((grna, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {grna.sequence}
                    </code>
                  </td>
                  <td className="py-4 px-4">
                    <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono" title="Protospacer Adjacent Motif (PAM) sequence required for Cas9 binding">
                      {grna.pam}
                    </code>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{grna.start}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      grna.strand === '+' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {grna.strand}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm" title="gRNA efficiency score (0-1)">{grna.score.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${qualityColor(getScoreBadge(grna.score))}`}>
                      {getScoreBadge(grna.score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allSamePosition && (
          <div className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4 text-center">
            <strong>Note:</strong> All gRNAs are at the same position. This may indicate a backend or data issue.
          </div>
        )}
      </div>

      {/* Gene Function & Analysis (Markdown) */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gene Function & Analysis</h3>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-lg mb-6">
          <ReactMarkdown>
            {data.explanation}
          </ReactMarkdown>
        </div>
      </div>

      {/* --- Visualizations --- */}
      {/* 1. Improved 2D Gene Map with gRNA Binding Sites */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">gRNA Binding Sites on Gene</h3>
        {plotError ? <div className="text-red-600">Failed to load chart.</div> : plotContent}
        <div className="mt-2 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> Excellent
          <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mx-2"></span> Good
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-2"></span> Fair
        </div>
      </div>

      {/* 2. Bar Chart of gRNA Scores */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">gRNA Scores</h3>
        <Plot
          data={[
            {
              x: grnas.map((g, i) => `#${i+1}`),
              y: grnas.map(g => g.score),
              type: 'bar',
              marker: { color: grnas.map(g => qualityColor(getScoreBadge(g.score))) },
              text: grnas.map(g => getScoreBadge(g.score)),
              textposition: 'auto',
            }
          ]}
          layout={{
            xaxis: { title: 'gRNA Rank' },
            yaxis: { title: 'Score', range: [0, 1] },
            height: 250,
            margin: { t: 10, b: 40, l: 40, r: 10 },
          }}
          config={{ displayModeBar: false }}
        />
      </div>

      {/* 3. Infographic Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agronomic Impact Summary</h3>
        <div className="flex flex-wrap gap-8">
          {summaryPoints.map((point, idx) => (
            <div key={idx} className="flex flex-col items-center w-48 text-center">
              {point.icon}
              <div className="font-semibold mt-2 mb-1">{point.label}</div>
              <div className="text-gray-600 text-sm">{point.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Detailed Gene Analysis Section */}
      <DetailedGeneSection data={data} />
     
    </div>
  );
};