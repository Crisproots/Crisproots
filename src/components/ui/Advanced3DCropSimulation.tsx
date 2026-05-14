"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye,
  Sun,
  Droplets,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Layers,
  BarChart3,
  Zap
} from 'lucide-react';

// 3D Farm Environment Types (for future use)
interface CropParameters {
  variety: string;
  plantingDensity: number;
  rowSpacing: number;
  plantSpacing: number;
  depth: number;
  orientation: string;
}

interface EnvironmentalFactors {
  sunlight: number; // hours per day
  water: number; // mm per week
  temperature: number; // celsius
  humidity: number; // percentage
  windSpeed: number; // km/h
  soilPH: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic: number;
  };
}

interface CropGrowthStage {
  stage: string;
  day: number;
  height: number;
  health: number;
  yield: number;
  waterNeeds: number;
  nutrientNeeds: number;
  commonIssues: string[];
  careInstructions: string[];
}

interface BiosphereSystem {
  type: string;
  description: string;
  benefits: string[];
  compatibility: string[];
  requirements: string[];
  expectedROI: number;
}

const Advanced3DCropSimulation: React.FC = () => {
  // Core simulation state
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [secondaryCrop, setSecondaryCrop] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [viewMode, setViewMode] = useState<'3D' | 'top' | 'side'>('3D');

  // Environmental parameters
  const [environment, setEnvironment] = useState<EnvironmentalFactors>({
    sunlight: 8,
    water: 25,
    temperature: 28,
    humidity: 70,
    windSpeed: 5,
    soilPH: 6.5,
    nutrients: {
      nitrogen: 120,
      phosphorus: 40,
      potassium: 80,
      organic: 3.5
    }
  });

  // Crop parameters
  const [cropParams, setCropParams] = useState<CropParameters>({
    variety: 'IR64',
    plantingDensity: 25,
    rowSpacing: 20,
    plantSpacing: 15,
    depth: 3,
    orientation: 'north-south'
  });

  // Advanced systems
  const [biosphereSystem, setBiosphereSystem] = useState<string>('');
  const [mixedCropping, setMixedCropping] = useState<boolean>(false);
  const [aquaponics, setAquaponics] = useState<boolean>(false);
  
  // Simulation results
  const [currentStage, setCurrentStage] = useState<CropGrowthStage | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [expectedYield, setExpectedYield] = useState<number>(0);

  // 3D Canvas reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Crop database with Indian varieties
  const cropDatabase = React.useMemo(() => ({
    rice: {
      varieties: ['IR64', 'Basmati 370', 'Swarna', 'PR 106', 'Pusa 44'],
      growthStages: [
        { stage: 'Germination', days: '1-7', height: '0-5cm', care: ['Keep soil moist', 'Temperature 25-30°C'] },
        { stage: 'Seedling', days: '7-21', height: '5-15cm', care: ['Transplant at 21 days', 'Maintain water level'] },
        { stage: 'Tillering', days: '21-45', height: '15-40cm', care: ['Apply nitrogen fertilizer', 'Control weeds'] },
        { stage: 'Stem elongation', days: '45-65', height: '40-80cm', care: ['Deep water management', 'Monitor for pests'] },
        { stage: 'Heading', days: '65-85', height: '80-120cm', care: ['Reduce water gradually', 'Apply potash'] },
        { stage: 'Grain filling', days: '85-105', height: '120cm', care: ['Alternate wetting and drying', 'Bird protection'] },
        { stage: 'Maturity', days: '105-130', height: '120cm', care: ['Harvest when 80% grains are golden', 'Dry properly'] }
      ],
      baseYield: 4500, // kg/hectare
      waterNeeds: 1200, // mm total
      duration: 130 // days
    },
    wheat: {
      varieties: ['HD 2967', 'PBW 343', 'WH 147', 'DBW 88', 'HD 3086'],
      growthStages: [
        { stage: 'Germination', days: '1-10', height: '0-3cm', care: ['Optimal soil moisture', 'Temperature 15-20°C'] },
        { stage: 'Tillering', days: '10-30', height: '3-20cm', care: ['First irrigation', 'Apply nitrogen'] },
        { stage: 'Jointing', days: '30-60', height: '20-50cm', care: ['Second irrigation', 'Weed control'] },
        { stage: 'Booting', days: '60-80', height: '50-80cm', care: ['Third irrigation', 'Monitor diseases'] },
        { stage: 'Heading', days: '80-100', height: '80-100cm', care: ['Fourth irrigation', 'Apply micronutrients'] },
        { stage: 'Grain filling', days: '100-120', height: '100cm', care: ['Final irrigation', 'Bird protection'] },
        { stage: 'Maturity', days: '120-140', height: '100cm', care: ['Harvest when grains are hard', 'Store properly'] }
      ],
      baseYield: 3500,
      waterNeeds: 450,
      duration: 140
    },
    sugarcane: {
      varieties: ['CoM 0265', 'Co 86032', 'CoS 767', 'Co 0238', 'CoS 8432'],
      growthStages: [
        { stage: 'Planting', days: '1-30', height: '0-50cm', care: ['Plant setts at 45cm spacing', 'Ensure soil moisture'] },
        { stage: 'Tillering', days: '30-90', height: '50-150cm', care: ['Apply organic manure', 'Earthing up'] },
        { stage: 'Grand growth', days: '90-240', height: '150-300cm', care: ['Regular irrigation', 'Fertilizer application'] },
        { stage: 'Maturation', days: '240-360', height: '300-400cm', care: ['Reduce irrigation', 'Monitor sugar content'] }
      ],
      baseYield: 80000,
      waterNeeds: 1500,
      duration: 360
    }
  }), []);

  // Biosphere systems
  const biosphereSystems: Record<string, BiosphereSystem> = {
    riceFish: {
      type: 'Rice-Fish Integration',
      description: 'Fish farming in rice fields increases yield and provides additional protein source',
      benefits: [
        'Fish consume pests and weeds',
        'Fish waste provides natural fertilizer',
        'Additional income from fish',
        'Reduced pesticide need',
        'Better water quality'
      ],
      compatibility: ['rice'],
      requirements: ['Water depth 15-20cm', 'Fish-friendly varieties', 'Proper water management'],
      expectedROI: 35
    },
    intercropping: {
      type: 'Mixed Intercropping',
      description: 'Growing two or more crops together to maximize land use and yield',
      benefits: [
        'Better land utilization',
        'Risk distribution',
        'Improved soil health',
        'Natural pest control',
        'Higher total yield'
      ],
      compatibility: ['wheat', 'sugarcane', 'rice'],
      requirements: ['Compatible crop heights', 'Different root depths', 'Complementary nutrient needs'],
      expectedROI: 25
    },
    agroforestry: {
      type: 'Agroforestry System',
      description: 'Integration of trees with crops for sustainable farming',
      benefits: [
        'Carbon sequestration',
        'Windbreak protection',
        'Additional timber income',
        'Soil conservation',
        'Microclimate improvement'
      ],
      compatibility: ['wheat', 'rice', 'sugarcane'],
      requirements: ['Proper tree spacing', 'Compatible tree species', 'Long-term planning'],
      expectedROI: 40
    }
  };

  // Simulation engine
  const calculateCropGrowth = React.useCallback((day: number, crop: string): CropGrowthStage => {
    const cropData = cropDatabase[crop as keyof typeof cropDatabase];
    if (!cropData) {
      return {
        stage: 'Unknown',
        day,
        height: 0,
        health: 100,
        yield: 0,
        waterNeeds: 0,
        nutrientNeeds: 0,
        commonIssues: [],
        careInstructions: []
      };
    }

    const progress = Math.min(day / cropData.duration, 1);
    const stageIndex = Math.floor(progress * cropData.growthStages.length);
    const stage = cropData.growthStages[Math.min(stageIndex, cropData.growthStages.length - 1)];

    // Calculate health based on environmental factors
    let health = 100;
    const optimalTemp = crop === 'rice' ? 28 : crop === 'wheat' ? 18 : 25;
    const tempDiff = Math.abs(environment.temperature - optimalTemp);
    health -= tempDiff * 2;

    const optimalWater = crop === 'rice' ? 30 : crop === 'wheat' ? 20 : 25;
    const waterDiff = Math.abs(environment.water - optimalWater);
    health -= waterDiff * 1.5;

    health = Math.max(health, 20);

    // Calculate expected yield
    const baseYield = cropData.baseYield;
    let yieldMultiplier = health / 100;
    
    // Biosphere bonuses
    if (biosphereSystem === 'riceFish' && crop === 'rice') {
      yieldMultiplier += 0.15;
      health += 5;
    }
    if (mixedCropping) {
      yieldMultiplier += 0.10;
    }

    const expectedYield = baseYield * yieldMultiplier * progress;

    return {
      stage: stage.stage,
      day,
      height: parseFloat(stage.height.split('-')[1]?.replace('cm', '') || '0'),
      health: Math.min(health, 100),
      yield: expectedYield,
      waterNeeds: optimalWater * (1 - progress * 0.3),
      nutrientNeeds: 100 * (1 - progress * 0.5),
      commonIssues: getCommonIssues(crop, stage.stage, environment),
      careInstructions: stage.care
    };
  }, [environment, biosphereSystem, mixedCropping, cropDatabase]);

  const getCommonIssues = (crop: string, stage: string, env: EnvironmentalFactors): string[] => {
    const issues: string[] = [];
    
    if (env.humidity > 80) issues.push('High humidity - watch for fungal diseases');
    if (env.temperature > 35) issues.push('Heat stress - increase irrigation');
    if (env.water < 10) issues.push('Water stress - immediate irrigation needed');
    if (env.soilPH < 6.0) issues.push('Soil too acidic - add lime');
    if (env.soilPH > 8.0) issues.push('Soil too alkaline - add organic matter');
    
    return issues;
  };

  const generateSuggestions = React.useCallback((): string[] => {
    const suggestions: string[] = [];
    
    if (environment.sunlight < 6) {
      suggestions.push('Consider shade-tolerant varieties or remove obstructions');
    }
    
    if (environment.nutrients.nitrogen < 80) {
      suggestions.push('Apply nitrogen fertilizer for better growth');
    }
    
    if (!biosphereSystem && selectedCrop === 'rice') {
      suggestions.push('Consider rice-fish integration for 35% higher ROI');
    }
    
    if (!mixedCropping) {
      suggestions.push('Try intercropping for better land utilization');
    }
    
    return suggestions;
  }, [environment, biosphereSystem, mixedCropping, selectedCrop]);

  // 3D Rendering
  const render3DFarm = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up 3D-like perspective
    const centerX = canvas.width / 2;
    
    // Draw field background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
    
    // Draw sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    
    // Draw sun
    const sunIntensity = environment.sunlight / 12;
    ctx.fillStyle = `rgba(255, 255, 0, ${sunIntensity})`;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw crops in 3D perspective
    if (currentStage) {
      const rows = 8;
      const cols = 12;
      const cropHeight = (currentStage.height / 120) * 80; // Scale to canvas
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col / cols) * canvas.width * 0.8 + canvas.width * 0.1;
          const y = canvas.height * 0.6 + (row / rows) * canvas.height * 0.3;
          const scale = 1 - (row / rows) * 0.5; // Perspective scaling
          
          // Draw crop
          ctx.fillStyle = currentStage.health > 70 ? '#228B22' : currentStage.health > 40 ? '#9ACD32' : '#DAA520';
          ctx.fillRect(x - 2 * scale, y - cropHeight * scale, 4 * scale, cropHeight * scale);
          
          // Draw leaves
          if (cropHeight > 10) {
            ctx.fillStyle = currentStage.health > 70 ? '#32CD32' : '#9ACD32';
            ctx.beginPath();
            ctx.ellipse(x, y - cropHeight * scale + 5, 6 * scale, 3 * scale, 0, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    }
    
    // Draw water if rice-fish system
    if (biosphereSystem === 'riceFish' && selectedCrop === 'rice') {
      ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.1);
      
      // Draw fish
      for (let i = 0; i < 5; i++) {
        const fishX = (Math.sin(currentDay * 0.1 + i) * 100) + centerX;
        const fishY = canvas.height * 0.65;
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.ellipse(fishX, fishY, 8, 4, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, [currentStage, biosphereSystem, selectedCrop, environment.sunlight, currentDay]);

  // Effects
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentDay(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (currentDay > 0) {
      const stage = calculateCropGrowth(currentDay, selectedCrop);
      setCurrentStage(stage);
      setExpectedYield(stage.yield);
      setSuggestions(generateSuggestions());
    }
  }, [currentDay, selectedCrop, environment, biosphereSystem, mixedCropping, calculateCropGrowth, generateSuggestions]);

  useEffect(() => {
    render3DFarm();
  }, [render3DFarm]);

  const resetSimulation = () => {
    setCurrentDay(0);
    setIsRunning(false);
    setCurrentStage(null);
    setExpectedYield(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌾 Advanced 3D Crop Simulation
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience real-time 3D farming simulation with advanced biosphere systems, 
            mixed cropping, and comprehensive yield optimization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Farm Setup */}
          <div className="space-y-6">
            {/* Crop Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-green-600" />
                Crop Selection
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Crop</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="rice">Rice (धान)</option>
                    <option value="wheat">Wheat (गेहूं)</option>
                    <option value="sugarcane">Sugarcane (गन्ना)</option>
                  </select>
                </div>

                {mixedCropping && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Secondary Crop</label>
                    <select
                      value={secondaryCrop}
                      onChange={(e) => setSecondaryCrop(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select secondary crop</option>
                      <option value="legumes">Legumes (दलहन)</option>
                      <option value="vegetables">Vegetables (सब्जी)</option>
                      <option value="spices">Spices (मसाले)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Variety</label>
                  <select
                    value={cropParams.variety}
                    onChange={(e) => setCropParams(prev => ({ ...prev, variety: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {cropDatabase[selectedCrop as keyof typeof cropDatabase]?.varieties.map(variety => (
                      <option key={variety} value={variety}>{variety}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Environmental Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Environmental Parameters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Sun className="w-4 h-4 mr-1 text-yellow-500" />
                    Sunlight: {environment.sunlight} hours/day
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    value={environment.sunlight}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, sunlight: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                    Water: {environment.water} mm/week
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={environment.water}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, water: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Thermometer className="w-4 h-4 mr-1 text-red-500" />
                    Temperature: {environment.temperature}°C
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={environment.temperature}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Humidity: {environment.humidity}%
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={environment.humidity}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, humidity: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Soil pH: {environment.soilPH}
                  </label>
                  <input
                    type="range"
                    min="4.0"
                    max="9.0"
                    step="0.1"
                    value={environment.soilPH}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, soilPH: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Systems */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-purple-600" />
                Biosphere Systems
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Integration System</label>
                  <select
                    value={biosphereSystem}
                    onChange={(e) => setBiosphereSystem(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">No integration</option>
                    <option value="riceFish">Rice-Fish System</option>
                    <option value="intercropping">Mixed Intercropping</option>
                    <option value="agroforestry">Agroforestry</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={mixedCropping}
                      onChange={(e) => setMixedCropping(e.target.checked)}
                      className="mr-2"
                    />
                    Mixed Cropping
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aquaponics}
                      onChange={(e) => setAquaponics(e.target.checked)}
                      className="mr-2"
                    />
                    Aquaponics
                  </label>
                </div>

                {biosphereSystem && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">
                      {biosphereSystems[biosphereSystem]?.type}
                    </h4>
                    <p className="text-sm text-purple-700 mb-2">
                      {biosphereSystems[biosphereSystem]?.description}
                    </p>
                    <div className="text-xs text-purple-600">
                      Expected ROI: +{biosphereSystems[biosphereSystem]?.expectedROI}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Panel - 3D Visualization */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-600" />
                3D Farm View
              </h3>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('3D')}
                  className={`px-3 py-1 rounded-lg text-sm ${viewMode === '3D' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  3D
                </button>
                <button
                  onClick={() => setViewMode('top')}
                  className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'top' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Top
                </button>
                <button
                  onClick={() => setViewMode('side')}
                  className={`px-3 py-1 rounded-lg text-sm ${viewMode === 'side' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Side
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full border border-gray-200 rounded-lg bg-gradient-to-b from-blue-100 to-green-100"
            />

            {/* Simulation Controls */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Pause' : 'Start'} Simulation
              </button>
              
              <button
                onClick={resetSimulation}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>

            {/* Current Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentDay}</div>
                <div className="text-sm text-blue-800">Days</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {currentStage?.health.toFixed(1) || 0}%
                </div>
                <div className="text-sm text-green-800">Health</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Analytics & Suggestions */}
          <div className="space-y-6">
            {/* Current Stage Info */}
            {currentStage && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Current Stage: {currentStage.stage}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Height:</span>
                    <span className="font-semibold">{currentStage.height.toFixed(1)} cm</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Health:</span>
                    <div className="flex items-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            currentStage.health > 70 ? 'bg-green-500' : 
                            currentStage.health > 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${currentStage.health}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{currentStage.health.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected Yield:</span>
                    <span className="font-semibold">{expectedYield.toFixed(0)} kg/ha</span>
                  </div>
                </div>

                {/* Care Instructions */}
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Care Instructions:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {currentStage.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-500" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Issues */}
                {currentStage.commonIssues.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Potential Issues:
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {currentStage.commonIssues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* AI Suggestions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                AI Recommendations
              </h3>
              
              <div className="space-y-3">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg flex items-start">
                      <Zap className="w-4 h-4 mr-2 mt-0.5 text-blue-500" />
                      <span className="text-sm text-blue-800">{suggestion}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No suggestions at this time</p>
                )}
              </div>
            </div>

            {/* Yield Prediction */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Yield Prediction
              </h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {expectedYield.toFixed(0)}
                  </div>
                  <div className="text-sm text-purple-800">kg/hectare</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base yield:</span>
                    <span>{cropDatabase[selectedCrop as keyof typeof cropDatabase]?.baseYield || 0} kg/ha</span>
                  </div>
                  
                  {biosphereSystem && (
                    <div className="flex justify-between text-green-600">
                      <span>Biosphere bonus:</span>
                      <span>+{biosphereSystems[biosphereSystem]?.expectedROI}%</span>
                    </div>
                  )}
                  
                  {mixedCropping && (
                    <div className="flex justify-between text-blue-600">
                      <span>Mixed cropping:</span>
                      <span>+10%</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">
                      Estimated Revenue
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{(expectedYield * 25).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </div>
                    <div className="text-xs text-gray-500">
                      (@ ₹25/kg average market price)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advanced3DCropSimulation;
