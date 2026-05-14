import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye, 
  EyeOff, 
  BarChart3,
  Activity,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Seedling,
  TreePine,
  Zap,
  Leaf,
  Globe,
  TrendingUp
} from 'lucide-react';
import { SimulationEngine, PlantPhysiology, PlantMorphology, EnvironmentalFactors, SoilProfile } from '../services/SimulationEngine';

interface AdvancedCropSimulationProps {
  cropType: string;
  parameters: {
    temperature: number;
    fertilizer: number;
    water: number;
    humidity: number;
    windSpeed: number;
    soilPh: number;
    soilNitrogen: number;
    soilOrganicMatter: number;
    lightIntensity: number;
    co2Level: number;
  };
  currentDay: number;
  isRunning: boolean;
  weatherData?: any;
}

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'photosynthesis' | 'transpiration' | 'nutrient' | 'co2';
  color: string;
}

const AdvancedCropSimulation: React.FC<AdvancedCropSimulationProps> = ({
  cropType,
  parameters,
  currentDay,
  isRunning,
  weatherData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Advanced simulation engine
  const [simulationEngine, setSimulationEngine] = useState<SimulationEngine | null>(null);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  
  // View settings
  const [viewSettings, setViewSettings] = useState({
    showRoots: true,
    showPhysiology: true,
    show3D: true,
    showParticles: true,
    showEnvironment: true,
    showStressIndicators: true,
    cameraAngle: 0,
    zoom: 1,
    lighting: 0.8,
    showCellularLevel: false,
    showNutrientFlow: true
  });
  
  // Historical data for graphs
  const [historicalData, setHistoricalData] = useState<{
    days: number[];
    biomass: number[];
    photosynthesis: number[];
    transpiration: number[];
    stressFactors: { [key: string]: number[] };
  }>({
    days: [],
    biomass: [],
    photosynthesis: [],
    transpiration: [],
    stressFactors: {}
  });

  // Initialize simulation engine
  useEffect(() => {
    const soilProfile: SoilProfile = {
      ph: parameters.soilPh,
      nitrogen: parameters.soilNitrogen,
      phosphorus: parameters.fertilizer * 0.3,
      potassium: parameters.fertilizer * 0.5,
      organicMatter: parameters.soilOrganicMatter,
      salinity: 0.5
    };

    const engine = new SimulationEngine({
      cropType,
      soilProfile,
      weatherEvents: {
        frost: parameters.temperature < 5,
        heatwave: parameters.temperature > 35,
        drought: parameters.water < 30,
        heavyRain: parameters.water > 80
      },
      pestPressure: Math.random() * 0.3,
      diseasePressure: Math.random() * 0.2
    }, currentDay);

    setSimulationEngine(engine);
  }, [cropType, parameters]);

  // Update simulation
  useEffect(() => {
    if (!simulationEngine) return;

    const env: EnvironmentalFactors = {
      temperature: parameters.temperature,
      humidity: parameters.humidity,
      windSpeed: parameters.windSpeed,
      lightIntensity: parameters.lightIntensity,
      soilMoisture: parameters.water,
      soilTemperature: parameters.temperature - 2,
      co2Concentration: parameters.co2Level,
      vaporPressureDeficit: calculateVPD(parameters.temperature, parameters.humidity)
    };

    simulationEngine.update(currentDay, env);

    // Update historical data
    setHistoricalData(prev => {
      const newData = { ...prev };
      newData.days.push(currentDay);
      newData.biomass.push(simulationEngine.physiology.biomass);
      newData.photosynthesis.push(simulationEngine.physiology.photosynthesisRate);
      newData.transpiration.push(simulationEngine.physiology.transpiration);
      
      // Keep only last 50 data points
      if (newData.days.length > 50) {
        newData.days.shift();
        newData.biomass.shift();
        newData.photosynthesis.shift();
        newData.transpiration.shift();
      }
      
      return newData;
    });

    // Generate particle effects
    if (viewSettings.showParticles) {
      generateParticleEffects(simulationEngine.physiology, simulationEngine.morphology);
    }
  }, [currentDay, parameters, simulationEngine]);

  const calculateVPD = (temp: number, humidity: number) => {
    const saturationVP = 0.6108 * Math.exp(17.27 * temp / (temp + 237.3));
    const actualVP = saturationVP * (humidity / 100);
    return saturationVP - actualVP;
  };

  const generateParticleEffects = (physiology: PlantPhysiology, morphology: PlantMorphology) => {
    const newParticles: ParticleEffect[] = [];
    
    // Photosynthesis particles
    for (let i = 0; i < physiology.photosynthesisRate * 2; i++) {
      newParticles.push({
        x: 400 + (Math.random() - 0.5) * morphology.height,
        y: 500 - Math.random() * morphology.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3,
        life: 0,
        maxLife: 60,
        type: 'photosynthesis',
        color: `rgba(0, 255, 0, ${0.5 + Math.random() * 0.5})`
      });
    }
    
    // Transpiration particles
    for (let i = 0; i < physiology.transpiration * 3; i++) {
      newParticles.push({
        x: 400 + (Math.random() - 0.5) * 100,
        y: 500 - morphology.height + Math.random() * 50,
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2,
        life: 0,
        maxLife: 80,
        type: 'transpiration',
        color: `rgba(173, 216, 230, ${0.3 + Math.random() * 0.4})`
      });
    }
    
    setParticleEffects(prev => [...prev.filter(p => p.life < p.maxLife), ...newParticles]);
  };

  // Enhanced 3D rendering with realistic plant structures
  const render3DPlant = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!simulationEngine) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#8B4513');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height * 0.8;
    const scale = viewSettings.zoom;
    const angle = (viewSettings.cameraAngle * Math.PI) / 180;
    
    // Draw environmental effects
    if (viewSettings.showEnvironment) {
      drawEnvironmentalEffects(ctx, width, height);
    }
    
    // Draw soil layers
    drawSoilProfile(ctx, centerX, centerY, scale);
    
    // Draw root system
    if (viewSettings.showRoots) {
      drawAdvancedRootSystem(ctx, centerX, centerY, scale, angle);
    }
    
    // Draw main plant structure
    drawAdvancedPlantStructure(ctx, centerX, centerY, scale, angle);
    
    // Draw cellular level detail
    if (viewSettings.showCellularLevel) {
      drawCellularDetail(ctx, centerX, centerY, scale);
    }
    
    // Draw nutrient flow
    if (viewSettings.showNutrientFlow) {
      drawNutrientFlow(ctx, centerX, centerY, scale);
    }
    
    // Draw particle effects
    if (viewSettings.showParticles) {
      drawAdvancedParticleEffects(ctx);
    }
    
    // Draw stress indicators
    if (viewSettings.showStressIndicators) {
      drawStressIndicators(ctx, width, height);
    }
  };

  const drawSoilProfile = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    if (!simulationEngine) return;
    
    const soilDepth = 200 * scale;
    const layers = [
      { depth: 0.3, color: '#8B4513', name: 'Topsoil' },
      { depth: 0.4, color: '#A0522D', name: 'Subsoil' },
      { depth: 0.3, color: '#CD853F', name: 'Parent Material' }
    ];
    
    let currentY = centerY;
    layers.forEach(layer => {
      const layerHeight = soilDepth * layer.depth;
      ctx.fillStyle = layer.color;
      ctx.fillRect(centerX - 200, currentY, 400, layerHeight);
      
      // Add texture
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < 50; i++) {
        const x = centerX - 200 + Math.random() * 400;
        const y = currentY + Math.random() * layerHeight;
        ctx.fillRect(x, y, 2, 2);
      }
      
      currentY += layerHeight;
    });
  };

  const drawAdvancedRootSystem = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, angle: number) => {
    if (!simulationEngine) return;
    
    const morphology = simulationEngine.morphology;
    const rootDepth = morphology.rootDepth * scale;
    const rootSpread = morphology.rootSpread * scale;
    
    // Main taproot with realistic branching
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = Math.max(2, morphology.stemDiameter);
    
    // Fractal root system
    drawFractalRoot(ctx, centerX, centerY, centerX, centerY + rootDepth, 5, rootSpread);
    
    // Mycorrhizal network
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 20; i++) {
      const x1 = centerX + (Math.random() - 0.5) * rootSpread * 2;
      const y1 = centerY + Math.random() * rootDepth;
      const x2 = centerX + (Math.random() - 0.5) * rootSpread * 2;
      const y2 = centerY + Math.random() * rootDepth;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawFractalRoot = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, depth: number, spread: number) => {
    if (depth === 0) return;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    if (depth > 1) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      // Left branch
      const leftX = midX - spread / depth;
      const leftY = y2 + (y2 - y1) * 0.3;
      drawFractalRoot(ctx, midX, midY, leftX, leftY, depth - 1, spread * 0.7);
      
      // Right branch
      const rightX = midX + spread / depth;
      const rightY = y2 + (y2 - y1) * 0.3;
      drawFractalRoot(ctx, midX, midY, rightX, rightY, depth - 1, spread * 0.7);
    }
  };

  const drawAdvancedPlantStructure = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, angle: number) => {
    if (!simulationEngine) return;
    
    const morphology = simulationEngine.morphology;
    const physiology = simulationEngine.physiology;
    const height = morphology.height * scale;
    const stemDiameter = morphology.stemDiameter * scale;
    
    // Draw main stem with realistic texture
    const stemGradient = ctx.createLinearGradient(centerX - stemDiameter, centerY, centerX + stemDiameter, centerY);
    stemGradient.addColorStop(0, '#228B22');
    stemGradient.addColorStop(0.5, '#32CD32');
    stemGradient.addColorStop(1, '#228B22');
    
    ctx.fillStyle = stemGradient;
    ctx.fillRect(centerX - stemDiameter / 2, centerY - height, stemDiameter, height);
    
    // Draw advanced leaves with realistic phyllotaxis
    drawAdvancedLeaves(ctx, centerX, centerY, height, scale, angle, physiology);
    
    // Draw flowers and fruits
    if (morphology.flowerCount > 0) {
      drawAdvancedFlowers(ctx, centerX, centerY, height, scale, morphology);
    }
    
    if (morphology.fruitCount > 0) {
      drawAdvancedFruits(ctx, centerX, centerY, height, scale, morphology);
    }
  };

  const drawAdvancedLeaves = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, height: number, scale: number, angle: number, physiology: PlantPhysiology) => {
    if (!simulationEngine) return;
    
    const morphology = simulationEngine.morphology;
    const leafCount = morphology.leafCount;
    const leafSize = morphology.leafSize * scale;
    
    for (let i = 0; i < leafCount; i++) {
      const leafY = centerY - (i * height) / leafCount;
      const leafAngle = (i * 137.5 * Math.PI) / 180; // Golden angle
      const leafX = centerX + Math.cos(leafAngle + angle) * (leafSize / 2);
      
      // Leaf color based on health
      const healthColor = Math.floor(120 + physiology.stressFactors.nitrogen * 40);
      const saturation = Math.floor(60 + physiology.stressFactors.water * 40);
      const lightness = Math.floor(30 + physiology.stressFactors.light * 20);
      
      // Leaf gradient
      const leafGradient = ctx.createRadialGradient(leafX, leafY, 0, leafX, leafY, leafSize / 2);
      leafGradient.addColorStop(0, `hsl(${healthColor}, ${saturation}%, ${lightness + 10}%)`);
      leafGradient.addColorStop(1, `hsl(${healthColor}, ${saturation}%, ${lightness}%)`);
      
      ctx.fillStyle = leafGradient;
      ctx.beginPath();
      ctx.ellipse(leafX, leafY, leafSize / 2, leafSize / 4, leafAngle, 0, 2 * Math.PI);
      ctx.fill();
      
      // Leaf veins
      ctx.strokeStyle = `hsl(${healthColor - 20}, ${saturation}%, ${lightness - 10}%)`;
      ctx.lineWidth = 1;
      drawLeafVeins(ctx, leafX, leafY, leafSize, leafAngle);
      
      // Stomata (microscopic detail)
      if (viewSettings.showCellularLevel) {
        drawStomata(ctx, leafX, leafY, leafSize / 4, physiology.transpiration);
      }
    }
  };

  const drawLeafVeins = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Main vein
    ctx.beginPath();
    ctx.moveTo(-size / 4, 0);
    ctx.lineTo(size / 4, 0);
    ctx.stroke();
    
    // Secondary veins
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      ctx.beginPath();
      ctx.moveTo(i * size / 8, 0);
      ctx.lineTo(i * size / 6, (i > 0 ? 1 : -1) * size / 8);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const drawStomata = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, transpiration: number) => {
    const stomataCount = Math.floor(transpiration * 5);
    
    for (let i = 0; i < stomataCount; i++) {
      const sx = x + (Math.random() - 0.5) * radius * 2;
      const sy = y + (Math.random() - 0.5) * radius * 2;
      
      ctx.fillStyle = 'rgba(0, 100, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(sx, sy, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawAdvancedFlowers = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, height: number, scale: number, morphology: PlantMorphology) => {
    // Implementation of detailed flower rendering
    // ... (similar to existing but more detailed)
  };

  const drawAdvancedFruits = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, height: number, scale: number, morphology: PlantMorphology) => {
    // Implementation of detailed fruit rendering
    // ... (similar to existing but more detailed)
  };

  const drawCellularDetail = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    // Draw chloroplasts in leaves
    ctx.fillStyle = 'rgba(0, 150, 0, 0.5)';
    for (let i = 0; i < 50; i++) {
      const x = centerX + (Math.random() - 0.5) * 100;
      const y = centerY - Math.random() * 200;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawNutrientFlow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    if (!simulationEngine) return;
    
    const uptake = simulationEngine.physiology.nutrientUptake;
    
    // Nitrogen flow (blue)
    ctx.strokeStyle = `rgba(0, 0, 255, ${uptake.nitrogen * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 50);
    ctx.lineTo(centerX, centerY - 100);
    ctx.stroke();
    
    // Phosphorus flow (red)
    ctx.strokeStyle = `rgba(255, 0, 0, ${uptake.phosphorus * 0.5})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY + 50);
    ctx.lineTo(centerX - 10, centerY - 100);
    ctx.stroke();
    
    // Potassium flow (yellow)
    ctx.strokeStyle = `rgba(255, 255, 0, ${uptake.potassium * 0.5})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX + 10, centerY + 50);
    ctx.lineTo(centerX + 10, centerY - 100);
    ctx.stroke();
  };

  const drawAdvancedParticleEffects = (ctx: CanvasRenderingContext2D) => {
    setParticleEffects(prev => prev.map(particle => {
      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 1;
      
      // Draw particle
      const alpha = 1 - (particle.life / particle.maxLife);
      ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${alpha})`);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
      ctx.fill();
      
      return particle;
    }).filter(particle => particle.life < particle.maxLife));
  };

  const drawEnvironmentalEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Sun
    if (parameters.lightIntensity > 20) {
      const sunSize = Math.min(50, parameters.lightIntensity);
      const sunGradient = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, sunSize);
      sunGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
      sunGradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
      
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.2, sunSize, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Wind effect
    if (parameters.windSpeed > 5) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + parameters.windSpeed * 5, y);
        ctx.stroke();
      }
    }
    
    // Rain
    if (parameters.water > 70) {
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.6)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y + 10);
        ctx.stroke();
      }
    }
  };

  const drawStressIndicators = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!simulationEngine) return;
    
    const stressFactors = simulationEngine.physiology.stressFactors;
    
    // Draw stress heat map overlay
    Object.entries(stressFactors).forEach(([factor, value], index) => {
      if (value < 0.5) {
        const intensity = (0.5 - value) * 2;
        ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.2})`;
        
        const sectorAngle = (2 * Math.PI) / Object.keys(stressFactors).length;
        const startAngle = index * sectorAngle;
        const endAngle = (index + 1) * sectorAngle;
        
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.arc(width / 2, height / 2, 100, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
      }
    });
  };

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            render3DPlant(ctx, canvasRef.current.width, canvasRef.current.height);
          }
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, simulationEngine, viewSettings, particleEffects]);

  if (!simulationEngine) {
    return <div className="flex items-center justify-center h-64">Loading simulation engine...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TreePine className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Advanced 3D Crop Simulation</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {Object.entries(viewSettings).filter(([key]) => key.startsWith('show')).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setViewSettings(prev => ({ ...prev, [key]: !value }))}
              className={`px-3 py-1 rounded-md text-sm ${value ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              {key.replace('show', '')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Enhanced 3D Canvas */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded-lg"
        />
        
        {/* Advanced view controls */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs">Angle:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={viewSettings.cameraAngle}
              onChange={(e) => setViewSettings(prev => ({ ...prev, cameraAngle: parseInt(e.target.value) }))}
              className="w-16"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs">Zoom:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={viewSettings.zoom}
              onChange={(e) => setViewSettings(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
              className="w-16"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs">Light:</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={viewSettings.lighting}
              onChange={(e) => setViewSettings(prev => ({ ...prev, lighting: parseFloat(e.target.value) }))}
              className="w-16"
            />
          </div>
        </div>
      </div>
      
      {/* Enhanced physiological data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Photosynthesis</span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {simulationEngine.physiology.photosynthesisRate.toFixed(1)} μmol/m²/s
          </div>
          <div className="text-xs text-gray-600">
            LAI: {simulationEngine.physiology.leafAreaIndex.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Transpiration</span>
          </div>
          <div className="text-lg font-bold text-blue-700">
            {simulationEngine.physiology.transpiration.toFixed(1)} mmol/m²/s
          </div>
          <div className="text-xs text-gray-600">
            Water Uptake: {simulationEngine.physiology.waterUptake.toFixed(1)} L/day
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Total Biomass</span>
          </div>
          <div className="text-lg font-bold text-yellow-700">
            {simulationEngine.physiology.biomass.toFixed(1)} g
          </div>
          <div className="text-xs text-gray-600">
            Height: {simulationEngine.morphology.height.toFixed(1)} cm
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Respiration</span>
          </div>
          <div className="text-lg font-bold text-purple-700">
            {simulationEngine.physiology.respirationRate.toFixed(1)} μmol/m²/s
          </div>
          <div className="text-xs text-gray-600">
            Net Growth: {(simulationEngine.physiology.photosynthesisRate - simulationEngine.physiology.respirationRate).toFixed(1)}
          </div>
        </div>
      </div>
      
      {/* Nutrient uptake monitoring */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Nitrogen Uptake</span>
          </div>
          <div className="text-lg font-bold text-blue-700">
            {simulationEngine.physiology.nutrientUptake.nitrogen.toFixed(2)} kg/ha
          </div>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium">Phosphorus Uptake</span>
          </div>
          <div className="text-lg font-bold text-red-700">
            {simulationEngine.physiology.nutrientUptake.phosphorus.toFixed(3)} kg/ha
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Potassium Uptake</span>
          </div>
          <div className="text-lg font-bold text-yellow-700">
            {simulationEngine.physiology.nutrientUptake.potassium.toFixed(2)} kg/ha
          </div>
        </div>
      </div>
      
      {/* Enhanced stress indicators */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Plant Stress Analysis</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(simulationEngine.physiology.stressFactors).map(([factor, value]) => (
            <div key={factor} className="text-center">
              <div className="text-xs text-gray-600 mb-1 capitalize">{factor}</div>
              <div className={`w-full h-3 rounded-full ${
                value > 0.8 ? 'bg-green-400' :
                value > 0.6 ? 'bg-yellow-400' :
                value > 0.3 ? 'bg-orange-400' : 'bg-red-400'
              }`}>
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${(1 - value) * 100}%` }}
                />
              </div>
              <div className="text-xs font-bold mt-1">
                {(value * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Historical data graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-3">Biomass Accumulation</h3>
          <div className="h-32 flex items-end space-x-1">
            {historicalData.biomass.slice(-20).map((value, index) => (
              <div 
                key={index}
                className="bg-green-500 rounded-t"
                style={{ 
                  height: `${(value / Math.max(...historicalData.biomass)) * 100}%`,
                  width: '4px'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-3">Photosynthesis Rate</h3>
          <div className="h-32 flex items-end space-x-1">
            {historicalData.photosynthesis.slice(-20).map((value, index) => (
              <div 
                key={index}
                className="bg-blue-500 rounded-t"
                style={{ 
                  height: `${(value / Math.max(...historicalData.photosynthesis)) * 100}%`,
                  width: '4px'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCropSimulation;
