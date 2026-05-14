'use client';
import React from 'react';
import { Dna, Target, TrendingUp, ShieldCheck, Info } from 'lucide-react';
import { GeneData } from '../types/GeneData';

interface DetailedGeneSectionProps {
  data: GeneData;
}

export const DetailedGeneSection: React.FC<DetailedGeneSectionProps> = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Dna className="h-7 w-7 text-blue-600 mr-3" />
        Detailed Gene Analysis & Recommendations
      </h2>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Gene Identity Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Gene Identity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <span className="text-sm text-blue-700 font-medium">Gene ID</span>
                <p className="font-mono text-blue-900">{data.gene.ensembl_id}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <span className="text-sm text-purple-700 font-medium">Symbol</span>
                <p className="font-mono text-purple-900">{data.gene.symbol}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <span className="text-sm text-green-700 font-medium">Length</span>
                <p className="font-mono text-green-900">{data.sequence_length} bp</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <span className="text-sm text-orange-700 font-medium">Source</span>
                <p className="font-mono text-orange-900">{data.source}</p>
              </div>
            </div>
          </div>

          {/* Target Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              CRISPR Target Sites
            </h3>
            <div className="space-y-3">
              {data.top_grnas.map((grna, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="font-mono text-sm text-gray-700">{grna.sequence}</div>
                    <div className="text-xs text-gray-500">Position: {grna.start}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Score: {grna.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Expected Outcomes */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Expected Outcomes
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-green-800 font-medium mb-2">ROI Projection</h4>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-green-700">10-25%</div>
                  <div className="ml-3 text-sm text-green-600">Expected Increase</div>
                </div>
                <p className="text-sm text-green-700 mt-2">Based on published studies and field trials</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-blue-800 font-medium mb-2">Trait Enhancement</h4>
                  <p className="text-sm text-blue-700">{data.trait} improvement in {data.crop}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="text-purple-800 font-medium mb-2">Resource Efficiency</h4>
                  <p className="text-sm text-purple-700">Improved stability and resource usage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Guide */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
              <ShieldCheck className="h-5 w-5 text-indigo-600 mr-2" />
              Implementation Guidelines
            </h3>
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                <Info className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-indigo-900 font-medium">Regulatory Compliance</h4>
                  <p className="text-sm text-indigo-700 mt-1">Ensure compliance with local regulations and validate all edits via sequencing</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-gray-900 font-medium mb-2">Validation</h4>
                  <p className="text-sm text-gray-700">Sequence verification recommended post-modification</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-gray-900 font-medium mb-2">Documentation</h4>
                  <p className="text-sm text-gray-700">Maintain detailed records of all modifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
