"use client";

import React, { useState } from 'react';
import { 
  Beaker, 
  Bug, 
  TrendingUp,
  Calendar,
  CheckCircle2,
  Zap,
  Fish,
  Sprout
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

interface FertilizerRecommendation {
  type: string;
  amount: string;
  timing: string;
  cost: number;
  benefits: string[];
}

interface PestManagement {
  pest: string;
  severity: 'low' | 'medium' | 'high';
  treatment: string;
  organicAlternative: string;
  preventiveMeasures: string[];
}

interface BiosphereIntegration {
  name: string;
  description: string;
  compatibility: string[];
  implementation: string[];
  expectedBenefits: string[];
  roiIncrease: number;
  investmentRequired: number;
}

interface ROIAnalysis {
  baseRevenue: number;
  additionalRevenue: number;
  additionalCosts: number;
  netIncome: number;
  roiPercentage: number;
}

const CropManagementSystem: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [currentStage, setCurrentStage] = useState('tillering');
  const [soilType, setSoilType] = useState('clay-loam');
  const [farmSize, setFarmSize] = useState(1); // in hectares
  
  // Advanced integration systems
  const biosphereIntegrations: Record<string, BiosphereIntegration> = {
    riceFishIntegration: {
      name: 'Rice-Fish Integration (मछली-धान एकीकरण)',
      description: 'Combine rice cultivation with fish farming in the same field',
      compatibility: ['rice', 'paddy'],
      implementation: [
        'Maintain water depth of 15-20cm',
        'Stock fingerlings after 15 days of transplanting',
        'Use fish-friendly varieties like IR64, Swarna',
        'Avoid chemical pesticides',
        'Harvest fish before rice maturity'
      ],
      expectedBenefits: [
        'Fish consume pests and weeds naturally',
        'Fish waste acts as organic fertilizer',
        'Additional income from fish sales',
        'Reduced chemical inputs by 30-40%',
        'Improved soil health and water quality'
      ],
      roiIncrease: 35,
      investmentRequired: 15000 // per hectare
    },
    duckRiceSystem: {
      name: 'Duck-Rice System (बत्तख-धान प्रणाली)',
      description: 'Integration of ducks in rice fields for natural pest control',
      compatibility: ['rice', 'paddy'],
      implementation: [
        'Release ducklings 10 days after transplanting',
        'Maintain 5-8 ducks per hectare',
        'Provide shelter and feeding areas',
        'Remove ducks before flowering stage',
        'Use integrated feeding system'
      ],
      expectedBenefits: [
        'Natural weed and pest control',
        'Duck manure enriches soil',
        'Additional income from duck meat/eggs',
        'Reduced labor for weeding',
        'Improved grain quality'
      ],
      roiIncrease: 28,
      investmentRequired: 12000
    },
    agroforestry: {
      name: 'Agroforestry System (कृषि वानिकी)',
      description: 'Integrate trees with crops for sustainable farming',
      compatibility: ['wheat', 'sugarcane', 'cotton', 'maize'],
      implementation: [
        'Plant boundary trees (Neem, Eucalyptus)',
        'Maintain 10% area under trees',
        'Use nitrogen-fixing trees (Acacia, Gliricidia)',
        'Implement alley cropping system',
        'Ensure proper spacing for sunlight'
      ],
      expectedBenefits: [
        'Carbon sequestration and climate resilience',
        'Windbreak protection for crops',
        'Additional timber/fruit income',
        'Soil conservation and fertility',
        'Biodiversity enhancement'
      ],
      roiIncrease: 40,
      investmentRequired: 25000
    },
    aquaponics: {
      name: 'Aquaponics System (जलीय कृषि)',
      description: 'Soilless farming with fish and plant integration',
      compatibility: ['leafy vegetables', 'herbs', 'tomatoes'],
      implementation: [
        'Set up fish tanks and grow beds',
        'Install water circulation system',
        'Stock fish (Tilapia, Catfish)',
        'Plant vegetables in grow beds',
        'Monitor water quality parameters'
      ],
      expectedBenefits: [
        '90% less water usage',
        'No soil-borne diseases',
        'Year-round production',
        'Premium organic produce',
        'Dual income from fish and vegetables'
      ],
      roiIncrease: 60,
      investmentRequired: 80000
    }
  };

  // Smart fertilizer recommendations
  const getFertilizerRecommendations = (crop: string, stage: string): FertilizerRecommendation[] => {
    const recommendations: FertilizerRecommendation[] = [];
    
    if (crop === 'rice') {
      if (stage === 'tillering') {
        recommendations.push({
          type: 'Urea (यूरिया)',
          amount: '87 kg/hectare',
          timing: '21 days after transplanting',
          cost: 1200,
          benefits: ['Promotes tillering', 'Increases leaf greenness', 'Boosts vegetative growth']
        });
        recommendations.push({
          type: 'DAP (डी.ए.पी)',
          amount: '50 kg/hectare', 
          timing: 'At transplanting',
          cost: 1500,
          benefits: ['Root development', 'Strong plant establishment', 'Phosphorus for energy']
        });
      }
    }
    
    return recommendations;
  };

  // Pest and disease management
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getPestManagement = (crop: string, stage: string): PestManagement[] => {
    const pests: PestManagement[] = [];
    
    if (crop === 'rice') {
      pests.push({
        pest: 'Brown Plant Hopper (भूरा पत्ता हॉपर)',
        severity: 'high',
        treatment: 'Imidacloprid 17.8% SL @ 100ml/hectare',
        organicAlternative: 'Neem oil spray + Yellow sticky traps',
        preventiveMeasures: [
          'Avoid excessive nitrogen fertilizer',
          'Maintain proper plant spacing',
          'Remove grassy weeds',
          'Use resistant varieties like TN1'
        ]
      });
      
      pests.push({
        pest: 'Blast Disease (ब्लास्ट रोग)',
        severity: 'medium',
        treatment: 'Tricyclazole 75% WP @ 300g/hectare',
        organicAlternative: 'Pseudomonas fluorescens spray',
        preventiveMeasures: [
          'Avoid late evening irrigation',
          'Proper field drainage',
          'Balanced fertilization',
          'Use certified disease-free seeds'
        ]
      });
    }
    
    return pests;
  };

  // Calculate ROI with biosphere integration
  const calculateROI = (baseYield: number, integration: string): ROIAnalysis => {
    const baseRevenue = baseYield * 25 * farmSize; // ₹25/kg rice
    let additionalRevenue = 0;
    let additionalCosts = 0;
    
    if (integration && biosphereIntegrations[integration]) {
      const system = biosphereIntegrations[integration];
      const yieldIncrease = (system.roiIncrease / 100) * baseRevenue;
      additionalRevenue = yieldIncrease;
      additionalCosts = system.investmentRequired * farmSize;
      
      // Additional income from integrated products
      if (integration === 'riceFishIntegration') {
        additionalRevenue += 200 * farmSize * 150; // 200kg fish @ ₹150/kg
      }
      if (integration === 'duckRiceSystem') {
        additionalRevenue += 50 * farmSize * 200; // 50 ducks @ ₹200 each
      }
    }
    
    const netIncome = baseRevenue + additionalRevenue - additionalCosts;
    const roiPercentage = ((additionalRevenue - additionalCosts) / additionalCosts) * 100;
    
    return {
      baseRevenue,
      additionalRevenue,
      additionalCosts,
      netIncome,
      roiPercentage
    };
  };

  const fertilizerRecs = getFertilizerRecommendations(selectedCrop, currentStage);
  const pestManagement = getPestManagement(selectedCrop, currentStage);
  const [selectedIntegration, setSelectedIntegration] = useState('');
  const roiAnalysis = calculateROI(4500, selectedIntegration); // 4500 kg/ha base yield

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌾 Advanced Crop Management & Biosphere Integration
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Comprehensive farming solutions with advanced biosphere systems, smart fertilizer management, 
            and integrated pest control for maximum ROI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Farm Configuration */}
          <div className="space-y-6">
            {/* Basic Farm Setup */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-green-600" />
                Farm Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="rice">Rice (धान)</option>
                    <option value="wheat">Wheat (गेहूं)</option>
                    <option value="sugarcane">Sugarcane (गन्ना)</option>
                    <option value="cotton">Cotton (कपास)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Growth Stage</label>
                  <select
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="germination">Germination (अंकुरण)</option>
                    <option value="tillering">Tillering (कल्ले फूटना)</option>
                    <option value="flowering">Flowering (फूल आना)</option>
                    <option value="grain-filling">Grain Filling (दाना भरना)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="clay-loam">Clay Loam (चिकनी दोमट)</option>
                    <option value="sandy-loam">Sandy Loam (बलुई दोमट)</option>
                    <option value="black-soil">Black Soil (काली मिट्टी)</option>
                    <option value="red-soil">Red Soil (लाल मिट्टी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Farm Size: {farmSize} hectare(s)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Biosphere Integration Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Fish className="w-5 h-5 mr-2 text-blue-600" />
                Biosphere Integration Systems
              </h3>
              
              <div className="space-y-3">
                {Object.entries(biosphereIntegrations).map(([key, system]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="integration"
                        value={key}
                        checked={selectedIntegration === key}
                        onChange={(e) => setSelectedIntegration(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{system.name}</div>
                        <div className="text-sm text-gray-600">{system.description}</div>
                        <div className="text-xs text-green-600 mt-1">
                          ROI: +{system.roiIncrease}% | Investment: ₹{formatCurrency(system.investmentRequired)}/ha
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
                
                <label className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    name="integration"
                    value=""
                    checked={selectedIntegration === ''}
                    onChange={(e) => setSelectedIntegration(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">Traditional Farming (No Integration)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Center Panel - Smart Recommendations */}
          <div className="space-y-6">
            {/* Fertilizer Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Beaker className="w-5 h-5 mr-2 text-purple-600" />
                Smart Fertilizer Recommendations
              </h3>
              
              <div className="space-y-4">
                {fertilizerRecs.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{rec.type}</h4>
                      <span className="text-lg font-bold text-green-600">₹{rec.cost}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div><strong>Amount:</strong> {rec.amount}</div>
                      <div><strong>Timing:</strong> {rec.timing}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">Benefits:</div>
                      {rec.benefits.map((benefit, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pest Management */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bug className="w-5 h-5 mr-2 text-red-600" />
                Integrated Pest Management
              </h3>
              
              <div className="space-y-4">
                {pestManagement.map((pest, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">{pest.pest}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        pest.severity === 'high' ? 'bg-red-100 text-red-800' :
                        pest.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {pest.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-gray-700">Chemical Treatment:</strong>
                        <div className="text-gray-600">{pest.treatment}</div>
                      </div>
                      
                      <div>
                        <strong className="text-green-700">Organic Alternative:</strong>
                        <div className="text-green-600">{pest.organicAlternative}</div>
                      </div>
                      
                      <div>
                        <strong className="text-blue-700">Prevention:</strong>
                        <ul className="text-blue-600 ml-4">
                          {pest.preventiveMeasures.map((measure, i) => (
                            <li key={i} className="text-xs">• {measure}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - ROI Analysis & Implementation */}
          <div className="space-y-6">
            {/* ROI Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                ROI Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{formatCurrency(roiAnalysis.netIncome)}
                  </div>
                  <div className="text-sm text-green-800">Net Income ({farmSize} ha)</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      ₹{formatCurrency(roiAnalysis.baseRevenue)}
                    </div>
                    <div className="text-xs text-blue-800">Base Revenue</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      ₹{formatCurrency(roiAnalysis.additionalRevenue)}
                    </div>
                    <div className="text-xs text-purple-800">Additional Revenue</div>
                  </div>
                </div>

                {selectedIntegration && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-center mb-2">
                      <div className="text-xl font-bold text-yellow-600">
                        +{roiAnalysis.roiPercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-yellow-800">ROI Increase</div>
                    </div>
                    <div className="text-xs text-yellow-700 text-center">
                      Investment: ₹{formatCurrency(roiAnalysis.additionalCosts)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Implementation Guide */}
            {selectedIntegration && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Implementation Guide
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {biosphereIntegrations[selectedIntegration].name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {biosphereIntegrations[selectedIntegration].description}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Implementation Steps:</h5>
                    <ol className="space-y-1">
                      {biosphereIntegrations[selectedIntegration].implementation.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h5 className="font-medium text-green-700 mb-2">Expected Benefits:</h5>
                    <ul className="space-y-1">
                      {biosphereIntegrations[selectedIntegration].expectedBenefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-green-600 flex items-start">
                          <CheckCircle2 className="w-3 h-3 mr-2 mt-1 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Generate Detailed Farm Plan
                </button>
                
                <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Schedule Expert Consultation
                </button>
                
                <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Connect with Local Suppliers
                </button>
                
                <button className="w-full p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Get Government Scheme Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropManagementSystem;
