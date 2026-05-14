"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Activity, 
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Wheat,
  Leaf,
  BarChart3
} from 'lucide-react';

// Enhanced Indian crop data
const indianCrops = [
  {
    id: 'rice-basmati',
    name: 'Rice (Basmati)',
    hindiName: 'चावल (बासमती)',
    category: 'Kharif',
    duration: '120-150 days',
    optimalTemp: '20-35°C',
    waterRequirement: 'High',
    soilType: 'Clay loam',
    marketPrice: '₹2,500-3,500/quintal',
    regions: ['Punjab', 'Haryana', 'UP', 'Uttarakhand']
  },
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं',
    category: 'Rabi',
    duration: '110-130 days',
    optimalTemp: '15-25°C',
    waterRequirement: 'Medium',
    soilType: 'Well-drained loam',
    marketPrice: '₹2,000-2,500/quintal',
    regions: ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan']
  },
  {
    id: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास',
    category: 'Kharif',
    duration: '160-200 days',
    optimalTemp: '21-27°C',
    waterRequirement: 'Medium-High',
    soilType: 'Black cotton soil',
    marketPrice: '₹5,500-7,000/quintal',
    regions: ['Gujarat', 'Maharashtra', 'Telangana', 'Karnataka']
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    hindiName: 'गन्ना',
    category: 'Year-round',
    duration: '300-365 days',
    optimalTemp: '20-26°C',
    waterRequirement: 'Very High',
    soilType: 'Rich, well-drained',
    marketPrice: '₹280-350/quintal',
    regions: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu']
  },
  {
    id: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    category: 'Kharif',
    duration: '90-120 days',
    optimalTemp: '20-30°C',
    waterRequirement: 'Medium',
    soilType: 'Well-drained',
    marketPrice: '₹3,500-4,500/quintal',
    regions: ['MP', 'Maharashtra', 'Rajasthan', 'Karnataka']
  },
  {
    id: 'mustard',
    name: 'Mustard',
    hindiName: 'सरसों',
    category: 'Rabi',
    duration: '90-110 days',
    optimalTemp: '10-25°C',
    waterRequirement: 'Low-Medium',
    soilType: 'Sandy loam',
    marketPrice: '₹4,000-5,000/quintal',
    regions: ['Rajasthan', 'Haryana', 'UP', 'MP']
  }
];

// Indian states with weather data
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const EnhancedCropSimulation: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('Punjab');
  const [currentDay, setCurrentDay] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Environmental parameters
  const [parameters, setParameters] = useState({
    temperature: 25,
    humidity: 65,
    rainfall: 50,
    soilMoisture: 70,
    soilPh: 7.0,
    nitrogen: 50,
    phosphorus: 30,
    potassium: 40,
    organicMatter: 2.5
  });

  // Simulation data
  const [cropData, setCropData] = useState({
    growthStage: 'Germination',
    healthScore: 85,
    expectedYield: 0,
    waterRequirement: 0,
    fertilizerNeeds: {},
    diseases: [],
    pests: [],
    marketPrediction: 0
  });

  // Weather forecast (simulated)
  const [weatherForecast, setWeatherForecast] = useState([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && selectedCrop) {
      interval = setInterval(() => {
        setCurrentDay(prev => {
          const selectedCropData = indianCrops.find(c => c.id === selectedCrop);
          const maxDays = selectedCropData ? parseInt(selectedCropData.duration.split('-')[1]) : 120;
          
          if (prev >= maxDays) {
            setIsRunning(false);
            return maxDays;
          }
          return prev + simulationSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedCrop, simulationSpeed]);

  // Update crop data based on simulation day and parameters
  useEffect(() => {
    if (selectedCrop && currentDay > 0) {
      updateCropData();
    }
  }, [currentDay, parameters, selectedCrop]);

  const updateCropData = () => {
    const selectedCropData = indianCrops.find(c => c.id === selectedCrop);
    if (!selectedCropData) return;

    const maxDays = parseInt(selectedCropData.duration.split('-')[1]);
    const progress = currentDay / maxDays;

    // Determine growth stage
    let stage = 'Germination';
    if (progress > 0.7) stage = 'Maturity';
    else if (progress > 0.5) stage = 'Reproductive';
    else if (progress > 0.3) stage = 'Vegetative Growth';
    else if (progress > 0.1) stage = 'Seedling';

    // Calculate health score based on parameters
    let healthScore = 100;
    const optimalTemp = 25; // Simplified
    const tempDeviation = Math.abs(parameters.temperature - optimalTemp);
    healthScore -= tempDeviation * 2;
    
    if (parameters.soilMoisture < 30 || parameters.soilMoisture > 90) {
      healthScore -= 20;
    }
    
    if (parameters.soilPh < 6.0 || parameters.soilPh > 8.0) {
      healthScore -= 15;
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    // Calculate expected yield
    const baseYield = {
      'rice-basmati': 4.5,
      'wheat': 3.5,
      'cotton': 2.0,
      'sugarcane': 80,
      'soybean': 1.5,
      'mustard': 1.2
    };

    const yieldMultiplier = healthScore / 100;
    const expectedYield = (baseYield[selectedCrop] || 2) * yieldMultiplier;

    setCropData({
      growthStage: stage,
      healthScore: Math.round(healthScore),
      expectedYield: Number(expectedYield.toFixed(2)),
      waterRequirement: Math.round((100 - progress * 30) * (parameters.temperature / 25)),
      fertilizerNeeds: {
        nitrogen: Math.round(60 - (progress * 40)),
        phosphorus: Math.round(40 - (progress * 25)),
        potassium: Math.round(50 - (progress * 30))
      },
      diseases: healthScore < 70 ? ['Leaf Spot', 'Root Rot'] : [],
      pests: healthScore < 60 ? ['Aphids', 'Stem Borer'] : [],
      marketPrediction: Math.round(3000 + (Math.random() * 1000) - 500)
    });
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentDay(0);
    setCropData({
      growthStage: 'Germination',
      healthScore: 85,
      expectedYield: 0,
      waterRequirement: 0,
      fertilizerNeeds: {},
      diseases: [],
      pests: [],
      marketPrediction: 0
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const selectedCropData = indianCrops.find(c => c.id === selectedCrop);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Advanced Crop Simulation
                </h1>
                <p className="text-gray-600">भारतीय कृषि सिमुलेशन प्लेटफॉर्म</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              
              <button
                onClick={handlePlayPause}
                disabled={!selectedCrop}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCrop
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {currentDay === 0 ? 'Start' : 'Resume'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Setup & Controls */}
          <div className="space-y-6">
            {/* Crop Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Wheat className="w-5 h-5 mr-2 text-green-600" />
                Select Crop
              </h3>
              
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a crop...</option>
                {indianCrops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.hindiName})
                  </option>
                ))}
              </select>
              
              {selectedCropData && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-2 font-medium">{selectedCropData.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2 font-medium">{selectedCropData.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Water Need:</span>
                      <span className="ml-2 font-medium">{selectedCropData.waterRequirement}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Market Price:</span>
                      <span className="ml-2 font-medium text-green-600">{selectedCropData.marketPrice}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-gray-500 text-sm">Suitable Regions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCropData.regions.map((region) => (
                        <span
                          key={region}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Location
              </h3>
              
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Environmental Parameters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-600" />
                Environmental Parameters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                    Temperature: {parameters.temperature}°C
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={parameters.temperature}
                    onChange={(e) => setParameters(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                    className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                    Humidity: {parameters.humidity}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={parameters.humidity}
                    onChange={(e) => setParameters(prev => ({ ...prev, humidity: Number(e.target.value) }))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CloudRain className="w-4 h-4 mr-2 text-gray-500" />
                    Rainfall: {parameters.rainfall}mm
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={parameters.rainfall}
                    onChange={(e) => setParameters(prev => ({ ...prev, rainfall: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Leaf className="w-4 h-4 mr-2 text-green-500" />
                    Soil Moisture: {parameters.soilMoisture}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameters.soilMoisture}
                    onChange={(e) => setParameters(prev => ({ ...prev, soilMoisture: Number(e.target.value) }))}
                    className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Panel - Simulation Display */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Current Status
              </h3>
              
              {selectedCrop ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">Day {currentDay}</div>
                    <div className="text-lg font-medium text-gray-900">{cropData.growthStage}</div>
                    <div className="text-sm text-gray-600">
                      {selectedCropData?.name} in {selectedState}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getHealthColor(cropData.healthScore)}`}>
                        {cropData.healthScore}%
                      </div>
                      <div className="text-xs text-gray-600">Health Score</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {cropData.expectedYield}
                      </div>
                      <div className="text-xs text-gray-600">Expected Yield (tons/ha)</div>
                    </div>
                  </div>

                  {/* Growth Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Progress</span>
                      <span>{selectedCropData && Math.round((currentDay / parseInt(selectedCropData.duration.split('-')[1])) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: selectedCropData 
                            ? `${Math.min(100, (currentDay / parseInt(selectedCropData.duration.split('-')[1])) * 100)}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sprout className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a crop to start simulation</p>
                </div>
              )}
            </div>

            {/* Alerts & Recommendations */}
            {selectedCrop && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  Alerts & Recommendations
                </h3>
                
                <div className="space-y-3">
                  {cropData.healthScore < 70 && (
                    <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-red-800">Health Alert</div>
                        <div className="text-sm text-red-700">
                          Crop health is below optimal. Check environmental conditions.
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {parameters.soilMoisture < 30 && (
                    <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Droplets className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-blue-800">Irrigation Needed</div>
                        <div className="text-sm text-blue-700">
                          Soil moisture is low. Consider irrigation.
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {cropData.diseases.length > 0 && (
                    <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-yellow-800">Disease Risk</div>
                        <div className="text-sm text-yellow-700">
                          Potential diseases: {cropData.diseases.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {cropData.healthScore >= 80 && (
                    <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-green-800">Excellent Condition</div>
                        <div className="text-sm text-green-700">
                          Your crop is in excellent health. Keep up the good work!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Analytics & Data */}
          <div className="space-y-6">
            {/* Market Information */}
            {selectedCrop && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Market Intelligence
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">Current Price</span>
                    <span className="text-green-800 font-bold">{selectedCropData?.marketPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">Predicted Price</span>
                    <span className="text-blue-800 font-bold">₹{cropData.marketPrediction}/quintal</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600 mb-2">Price Trend</div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 text-sm font-medium">+8.5% this month</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Soil Analysis */}
            {selectedCrop && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Soil Analysis</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">pH Level</span>
                    <span className="font-medium">{parameters.soilPh}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nitrogen (N)</span>
                      <span className="font-medium">{parameters.nitrogen}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${parameters.nitrogen}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phosphorus (P)</span>
                      <span className="font-medium">{parameters.phosphorus}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${parameters.phosphorus}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Potassium (K)</span>
                      <span className="font-medium">{parameters.potassium}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${parameters.potassium}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Forecast */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                7-Day Forecast
              </h3>
              
              <div className="space-y-3">
                {[...Array(7)].map((_, index) => {
                  const temp = 25 + Math.round(Math.random() * 10 - 5);
                  const humidity = 60 + Math.round(Math.random() * 20);
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <span>{temp}°C</span>
                        <span className="text-gray-500">{humidity}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCropSimulation;
