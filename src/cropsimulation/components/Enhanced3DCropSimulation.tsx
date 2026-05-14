import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Eye, 
  EyeOff, 
  Maximize,
  BarChart3,
  Activity,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Seedling,
  TreePine
} from 'lucide-react';

interface Enhanced3DCropSimulationProps {
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

interface PlantPhysiology {
  biomass: number;
  leafAreaIndex: number;
  photosynthesisRate: number;
  respirationRate: number;
  transpiration: number;
  rootMass: number;
  stemMass: number;
  leafMass: number;
  fruitMass: number;
  waterUptake: number;
  nutrientUptake: number;
  stressFactors: {
    water: number;
    nitrogen: number;
    temperature: number;
    light: number;
    disease: number;
  };
}

interface PlantMorphology {
  height: number;
  leafCount: number;
  stemDiameter: number;
  rootDepth: number;
  rootSpread: number;
  branchCount: number;
  flowerCount: number;
  fruitCount: number;
  leafSize: number;
  internodeLength: number;
}

interface EnvironmentalFactors {
  temperature: number;
  humidity: number;
  windSpeed: number;
  lightIntensity: number;
  soilMoisture: number;
  soilTemperature: number;
  co2Concentration: number;
  vaporPressureDeficit: number;
}

const Enhanced3DCropSimulation: React.FC<Enhanced3DCropSimulationProps> = ({
  cropType,
  parameters,
  currentDay,
  isRunning,
  weatherData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Advanced simulation state
  const [plantPhysiology, setPlantPhysiology] = useState<PlantPhysiology>({
    biomass: 0.1,
    leafAreaIndex: 0,
    photosynthesisRate: 0,
    respirationRate: 0,
    transpiration: 0,
    rootMass: 0.05,
    stemMass: 0.03,
    leafMass: 0.02,
    fruitMass: 0,
    waterUptake: 0,
    nutrientUptake: 0,
    stressFactors: {
      water: 1.0,
      nitrogen: 1.0,
      temperature: 1.0,
      light: 1.0,
      disease: 1.0
    }
  });
  
  const [plantMorphology, setPlantMorphology] = useState<PlantMorphology>({
    height: 1,
    leafCount: 0,
    stemDiameter: 0.5,
    rootDepth: 0.5,
    rootSpread: 0.3,
    branchCount: 0,
    flowerCount: 0,
    fruitCount: 0,
    leafSize: 0,
    internodeLength: 0.5
  });
  
  const [viewSettings, setViewSettings] = useState({
    showRoots: true,
    showPhysiology: true,
    show3D: true,
    showParticles: true,
    cameraAngle: 0,
    zoom: 1,
    lighting: 0.8
  });
  
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [particleSystem, setParticleSystem] = useState<any[]>([]);

  // Advanced crop growth models based on real agricultural science
  const cropGrowthModels = {
    wheat: {
      maxHeight: 120,
      maxBiomass: 15000,
      growthStages: [
        { name: 'Germination', duration: 7, characteristics: { height: 0.5, leaves: 0, roots: 0.3 } },
        { name: 'Emergence', duration: 10, characteristics: { height: 5, leaves: 1, roots: 2 } },
        { name: 'Tillering', duration: 30, characteristics: { height: 25, leaves: 4, roots: 8 } },
        { name: 'Stem Extension', duration: 35, characteristics: { height: 60, leaves: 8, roots: 15 } },
        { name: 'Heading', duration: 15, characteristics: { height: 90, leaves: 10, roots: 20 } },
        { name: 'Flowering', duration: 10, characteristics: { height: 110, leaves: 12, roots: 25 } },
        { name: 'Grain Filling', duration: 30, characteristics: { height: 120, leaves: 12, roots: 30 } },
        { name: 'Maturity', duration: 15, characteristics: { height: 120, leaves: 10, roots: 30 } }
      ],
      temperatureResponse: { min: 3, opt: 22, max: 35 },
      waterResponse: { min: 300, opt: 450, max: 700 },
      lightResponse: { min: 15, opt: 25, max: 40 }
    },
    rice: {
      maxHeight: 150,
      maxBiomass: 20000,
      growthStages: [
        { name: 'Germination', duration: 5, characteristics: { height: 0.3, leaves: 0, roots: 0.2 } },
        { name: 'Seedling', duration: 15, characteristics: { height: 8, leaves: 3, roots: 3 } },
        { name: 'Tillering', duration: 40, characteristics: { height: 35, leaves: 8, roots: 12 } },
        { name: 'Panicle Formation', duration: 20, characteristics: { height: 80, leaves: 12, roots: 20 } },
        { name: 'Heading', duration: 10, characteristics: { height: 120, leaves: 15, roots: 25 } },
        { name: 'Flowering', duration: 8, characteristics: { height: 140, leaves: 16, roots: 28 } },
        { name: 'Grain Filling', duration: 25, characteristics: { height: 150, leaves: 16, roots: 30 } },
        { name: 'Maturity', duration: 12, characteristics: { height: 150, leaves: 14, roots: 30 } }
      ],
      temperatureResponse: { min: 16, opt: 30, max: 42 },
      waterResponse: { min: 500, opt: 800, max: 1200 },
      lightResponse: { min: 18, opt: 28, max: 35 }
    },
    tomato: {
      maxHeight: 200,
      maxBiomass: 25000,
      growthStages: [
        { name: 'Germination', duration: 6, characteristics: { height: 0.4, leaves: 0, roots: 0.2 } },
        { name: 'Cotyledon', duration: 8, characteristics: { height: 2, leaves: 2, roots: 1 } },
        { name: 'True Leaves', duration: 15, characteristics: { height: 12, leaves: 6, roots: 4 } },
        { name: 'Vegetative Growth', duration: 35, characteristics: { height: 45, leaves: 15, roots: 15 } },
        { name: 'Flowering', duration: 20, characteristics: { height: 80, leaves: 25, roots: 25 } },
        { name: 'Fruit Set', duration: 15, characteristics: { height: 120, leaves: 35, roots: 35 } },
        { name: 'Fruit Development', duration: 40, characteristics: { height: 160, leaves: 45, roots: 40 } },
        { name: 'Harvest', duration: 60, characteristics: { height: 200, leaves: 50, roots: 45 } }
      ],
      temperatureResponse: { min: 10, opt: 25, max: 35 },
      waterResponse: { min: 400, opt: 600, max: 900 },
      lightResponse: { min: 20, opt: 35, max: 50 }
    }
  };

  // Calculate environmental stress factors
  const calculateStressFactors = (env: EnvironmentalFactors, crop: any) => {
    const tempStress = calculateTemperatureStress(env.temperature, crop.temperatureResponse);
    const waterStress = calculateWaterStress(parameters.water, crop.waterResponse);
    const lightStress = calculateLightStress(env.lightIntensity, crop.lightResponse);
    const nitrogenStress = calculateNitrogenStress(parameters.fertilizer);
    
    return {
      water: waterStress,
      nitrogen: nitrogenStress,
      temperature: tempStress,
      light: lightStress,
      disease: calculateDiseaseStress(env, plantPhysiology)
    };
  };

  const calculateTemperatureStress = (temp: number, response: any) => {
    if (temp < response.min || temp > response.max) return 0.1;
    if (temp >= response.opt - 5 && temp <= response.opt + 5) return 1.0;
    
    const distanceFromOptimal = Math.min(
      Math.abs(temp - response.opt),
      Math.abs(temp - response.min),
      Math.abs(temp - response.max)
    );
    
    return Math.max(0.1, 1.0 - (distanceFromOptimal / 10));
  };

  const calculateWaterStress = (water: number, response: any) => {
    if (water < response.min * 0.5) return 0.1;
    if (water >= response.opt * 0.8 && water <= response.opt * 1.2) return 1.0;
    
    if (water < response.opt) {
      return Math.max(0.1, water / response.opt);
    } else {
      const excess = water - response.opt;
      return Math.max(0.3, 1.0 - (excess / response.max));
    }
  };

  const calculateLightStress = (light: number, response: any) => {
    if (light < response.min) return Math.max(0.1, light / response.min);
    if (light > response.max) return Math.max(0.3, response.max / light);
    return 1.0;
  };

  const calculateNitrogenStress = (nitrogen: number) => {
    return Math.min(1.0, Math.max(0.1, nitrogen / 100));
  };

  const calculateDiseaseStress = (env: EnvironmentalFactors, physiology: PlantPhysiology) => {
    // Disease pressure increases with high humidity and moderate temperatures
    let diseasePressure = 1.0;
    
    if (env.humidity > 80 && env.temperature > 20 && env.temperature < 30) {
      diseasePressure = 0.7;
    }
    
    if (physiology.stressFactors.water < 0.5) {
      diseasePressure *= 0.8; // Water stress makes plants more susceptible
    }
    
    return diseasePressure;
  };

  // Advanced photosynthesis model
  const calculatePhotosynthesis = (env: EnvironmentalFactors, morphology: PlantMorphology) => {
    const lightSaturation = Math.min(1.0, env.lightIntensity / 25);
    const co2Effect = Math.min(1.5, env.co2Concentration / 380);
    const temperatureEffect = calculateTemperatureStress(env.temperature, { min: 5, opt: 25, max: 40 });
    
    const maxPhotosynthesis = morphology.leafCount * morphology.leafSize * 0.1;
    
    return maxPhotosynthesis * lightSaturation * co2Effect * temperatureEffect *
           plantPhysiology.stressFactors.water * plantPhysiology.stressFactors.nitrogen;
  };

  // Update plant physiology based on environmental conditions
  const updatePlantPhysiology = () => {
    const currentCrop = cropGrowthModels[cropType as keyof typeof cropGrowthModels];
    if (!currentCrop) return;

    const env: EnvironmentalFactors = {
      temperature: parameters.temperature,
      humidity: parameters.humidity,
      windSpeed: parameters.windSpeed,
      lightIntensity: parameters.lightIntensity || 25,
      soilMoisture: parameters.water,
      soilTemperature: parameters.temperature - 2,
      co2Concentration: parameters.co2Level || 400,
      vaporPressureDeficit: calculateVPD(parameters.temperature, parameters.humidity)
    };

    const stressFactors = calculateStressFactors(env, currentCrop);
    const photosynthesisRate = calculatePhotosynthesis(env, plantMorphology);
    const respirationRate = calculateRespiration(parameters.temperature, plantPhysiology.biomass);
    const transpiration = calculateTranspiration(env, plantMorphology);

    // Update biomass allocation
    const netPhotosynthesis = Math.max(0, photosynthesisRate - respirationRate);
    const growthRate = netPhotosynthesis * Object.values(stressFactors).reduce((a, b) => a * b, 1);

    setPlantPhysiology(prev => ({
      ...prev,
      photosynthesisRate,
      respirationRate,
      transpiration,
      stressFactors,
      biomass: prev.biomass + growthRate * 0.01,
      leafAreaIndex: (plantMorphology.leafCount * plantMorphology.leafSize) / 10000,
      waterUptake: transpiration * 1.2,
      nutrientUptake: growthRate * 0.1
    }));
  };

  const calculateVPD = (temp: number, humidity: number) => {
    const saturationVP = 0.6108 * Math.exp(17.27 * temp / (temp + 237.3));
    const actualVP = saturationVP * (humidity / 100);
    return saturationVP - actualVP;
  };

  const calculateRespiration = (temperature: number, biomass: number) => {
    const q10 = 2.0; // Q10 coefficient for respiration
    const baseTemp = 20;
    const tempFactor = Math.pow(q10, (temperature - baseTemp) / 10);
    return biomass * 0.02 * tempFactor;
  };

  const calculateTranspiration = (env: EnvironmentalFactors, morphology: PlantMorphology) => {
    const leafArea = morphology.leafCount * morphology.leafSize;
    const conductance = leafArea * 0.01 * plantPhysiology.stressFactors.water;
    return conductance * env.vaporPressureDeficit * (1 + env.windSpeed * 0.1);
  };

  // Update plant morphology based on growth stage and conditions
  const updatePlantMorphology = () => {
    const currentCrop = cropGrowthModels[cropType as keyof typeof cropGrowthModels];
    if (!currentCrop) return;

    const totalDuration = currentCrop.growthStages.reduce((sum, stage) => sum + stage.duration, 0);
    const progressRatio = Math.min(1, currentDay / totalDuration);
    
    let cumulativeDays = 0;
    let currentStageIndex = 0;
    
    for (let i = 0; i < currentCrop.growthStages.length; i++) {
      cumulativeDays += currentCrop.growthStages[i].duration;
      if (currentDay <= cumulativeDays) {
        currentStageIndex = i;
        break;
      }
    }

    const currentStage = currentCrop.growthStages[currentStageIndex];
    const stageProgress = Math.min(1, (currentDay - (cumulativeDays - currentStage.duration)) / currentStage.duration);
    
    // Apply stress effects to growth
    const overallStress = Object.values(plantPhysiology.stressFactors).reduce((a, b) => a * b, 1);
    const growthMultiplier = 0.5 + (overallStress * 0.5);

    setPlantMorphology(prev => ({
      height: currentStage.characteristics.height * stageProgress * growthMultiplier,
      leafCount: Math.floor(currentStage.characteristics.leaves * stageProgress),
      stemDiameter: (currentStage.characteristics.height / 100) * growthMultiplier,
      rootDepth: currentStage.characteristics.roots * stageProgress * growthMultiplier,
      rootSpread: currentStage.characteristics.roots * 0.7 * stageProgress * growthMultiplier,
      branchCount: Math.floor(Math.max(0, currentStage.characteristics.leaves - 4) * stageProgress),
      flowerCount: currentStageIndex >= 4 ? Math.floor((currentStageIndex - 3) * 5 * stageProgress) : 0,
      fruitCount: currentStageIndex >= 6 ? Math.floor((currentStageIndex - 5) * 3 * stageProgress) : 0,
      leafSize: 5 + (currentStageIndex * 2) * growthMultiplier,
      internodeLength: 2 + (currentStageIndex * 0.5) * growthMultiplier
    }));
  };

  // Advanced 3D rendering with realistic plant structures
  const render3DPlant = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Set up 3D projection
    const centerX = width / 2;
    const centerY = height * 0.8;
    const scale = viewSettings.zoom;
    const angle = (viewSettings.cameraAngle * Math.PI) / 180;
    
    // Draw soil and root system
    if (viewSettings.showRoots) {
      drawRootSystem(ctx, centerX, centerY, scale, angle);
    }
    
    // Draw main plant structure
    drawPlantStructure(ctx, centerX, centerY, scale, angle);
    
    // Draw particle effects
    if (viewSettings.showParticles) {
      drawParticleEffects(ctx, width, height);
    }
    
    // Draw environmental effects
    drawEnvironmentalEffects(ctx, width, height);
  };

  const drawRootSystem = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, angle: number) => {
    const rootDepth = plantMorphology.rootDepth * scale;
    const rootSpread = plantMorphology.rootSpread * scale;
    
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    
    // Main taproot
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + rootDepth);
    ctx.stroke();
    
    // Lateral roots
    const lateralRoots = Math.floor(plantMorphology.rootDepth / 5);
    for (let i = 0; i < lateralRoots; i++) {
      const y = centerY + (i * rootDepth) / lateralRoots;
      const spread = rootSpread * (0.5 + Math.random() * 0.5);
      
      // Left lateral root
      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.quadraticCurveTo(
        centerX - spread / 2,
        y + spread / 4,
        centerX - spread,
        y + spread / 2
      );
      ctx.stroke();
      
      // Right lateral root
      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.quadraticCurveTo(
        centerX + spread / 2,
        y + spread / 4,
        centerX + spread,
        y + spread / 2
      );
      ctx.stroke();
    }
    
    // Root hairs (fine detail)
    ctx.strokeStyle = '#A0522D';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < lateralRoots * 10; i++) {
      const x = centerX + (Math.random() - 0.5) * rootSpread * 2;
      const y = centerY + Math.random() * rootDepth;
      const hairLength = 5 + Math.random() * 10;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * hairLength, y + hairLength);
      ctx.stroke();
    }
  };

  const drawPlantStructure = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, angle: number) => {
    const height = plantMorphology.height * scale;
    const stemDiameter = plantMorphology.stemDiameter * scale;
    
    // Draw main stem
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = Math.max(2, stemDiameter);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - height);
    ctx.stroke();
    
    // Draw leaves
    drawLeaves(ctx, centerX, centerY, height, scale, angle);
    
    // Draw flowers if present
    if (plantMorphology.flowerCount > 0) {
      drawFlowers(ctx, centerX, centerY, height, scale);
    }
    
    // Draw fruits if present
    if (plantMorphology.fruitCount > 0) {
      drawFruits(ctx, centerX, centerY, height, scale);
    }
  };

  const drawLeaves = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, height: number, scale: number, angle: number) => {
    const leafCount = plantMorphology.leafCount;
    const leafSize = plantMorphology.leafSize * scale;
    
    for (let i = 0; i < leafCount; i++) {
      const leafY = centerY - (i * height) / leafCount;
      const leafAngle = (i * 137.5 * Math.PI) / 180; // Golden angle for natural phyllotaxis
      const leafX = centerX + Math.cos(leafAngle + angle) * (leafSize / 2);
      
      // Leaf shape (ellipse)
      ctx.fillStyle = `hsl(${120 + Math.random() * 20}, ${60 + plantPhysiology.stressFactors.nitrogen * 40}%, ${30 + plantPhysiology.stressFactors.water * 20}%)`;
      ctx.beginPath();
      ctx.ellipse(leafX, leafY, leafSize / 2, leafSize / 4, leafAngle, 0, 2 * Math.PI);
      ctx.fill();
      
      // Leaf veins
      ctx.strokeStyle = 'rgba(0, 100, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, leafY);
      ctx.lineTo(leafX, leafY);
      ctx.stroke();
    }
  };

  const drawFlowers = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, height: number, scale: number) => {
    const flowerCount = plantMorphology.flowerCount;
    
    for (let i = 0; i < flowerCount; i++) {
      const flowerY = centerY - height + (i * 20);
      const flowerX = centerX + (Math.random() - 0.5) * 30;
      
      // Flower petals
      ctx.fillStyle = '#FFB6C1';
      for (let petal = 0; petal < 5; petal++) {
        const petalAngle = (petal * 2 * Math.PI) / 5;
        const petalX = flowerX + Math.cos(petalAngle) * 8;
        const petalY = flowerY + Math.sin(petalAngle) * 8;
        
        ctx.beginPath();
        ctx.arc(petalX, petalY, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Flower center
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(flowerX, flowerY, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawFruits = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, height: number, scale: number) => {
    const fruitCount = plantMorphology.fruitCount;
    
    for (let i = 0; i < fruitCount; i++) {
      const fruitY = centerY - height + (i * 25);
      const fruitX = centerX + (Math.random() - 0.5) * 40;
      const fruitSize = 6 + Math.random() * 8;
      
      // Fruit shape varies by crop type
      if (cropType === 'tomato') {
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.arc(fruitX, fruitY, fruitSize, 0, 2 * Math.PI);
        ctx.fill();
      } else if (cropType === 'wheat' || cropType === 'rice') {
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(fruitX - 2, fruitY - fruitSize, 4, fruitSize * 2);
      }
    }
  };

  const drawParticleEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Photosynthesis particles (rising green dots)
    if (plantPhysiology.photosynthesisRate > 0) {
      const particleCount = Math.floor(plantPhysiology.photosynthesisRate * 10);
      
      for (let i = 0; i < particleCount; i++) {
        const x = width / 2 + (Math.random() - 0.5) * plantMorphology.height;
        const y = height * 0.8 - Math.random() * plantMorphology.height;
        const alpha = 0.3 + Math.random() * 0.4;
        
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Transpiration particles (water vapor)
    if (plantPhysiology.transpiration > 0) {
      const vaporCount = Math.floor(plantPhysiology.transpiration * 5);
      
      for (let i = 0; i < vaporCount; i++) {
        const x = width / 2 + (Math.random() - 0.5) * 100;
        const y = height * 0.3 + Math.random() * 100;
        const alpha = 0.2 + Math.random() * 0.3;
        
        ctx.fillStyle = `rgba(173, 216, 230, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const drawEnvironmentalEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Wind effect (swaying)
    if (parameters.windSpeed > 5) {
      const sway = Math.sin(Date.now() * 0.005) * parameters.windSpeed * 0.5;
      ctx.translate(sway, 0);
    }
    
    // Rain effect
    if (parameters.water > 80) {
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.5)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y + 10);
        ctx.stroke();
      }
    }
    
    // Sun rays
    if (parameters.lightIntensity > 25) {
      const sunX = width * 0.8;
      const sunY = height * 0.2;
      
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const endX = sunX + Math.cos(angle) * 50;
        const endY = sunY + Math.sin(angle) * 50;
        
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
  };

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        updatePlantPhysiology();
        updatePlantMorphology();
        
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
  }, [isRunning, parameters, currentDay, viewSettings]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TreePine className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Enhanced 3D Crop Simulation</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewSettings(prev => ({ ...prev, showRoots: !prev.showRoots }))}
            className={`px-3 py-1 rounded-md text-sm ${viewSettings.showRoots ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            {viewSettings.showRoots ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Roots
          </button>
          
          <button
            onClick={() => setViewSettings(prev => ({ ...prev, showParticles: !prev.showParticles }))}
            className={`px-3 py-1 rounded-md text-sm ${viewSettings.showParticles ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Particles
          </button>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded-lg bg-gradient-to-b from-sky-200 to-green-100"
        />
        
        {/* View controls overlay */}
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
        </div>
      </div>
      
      {/* Real-time physiological data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Photosynthesis</span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {plantPhysiology.photosynthesisRate.toFixed(1)} μmol/m²/s
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">Transpiration</span>
          </div>
          <div className="text-lg font-bold text-blue-700">
            {plantPhysiology.transpiration.toFixed(1)} mmol/m²/s
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Biomass</span>
          </div>
          <div className="text-lg font-bold text-yellow-700">
            {plantPhysiology.biomass.toFixed(1)} g
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Seedling className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">LAI</span>
          </div>
          <div className="text-lg font-bold text-purple-700">
            {plantPhysiology.leafAreaIndex.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Stress indicators */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Plant Stress Factors</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(plantPhysiology.stressFactors).map(([factor, value]) => (
            <div key={factor} className="text-center">
              <div className="text-xs text-gray-600 mb-1 capitalize">{factor}</div>
              <div className={`w-full h-2 rounded-full ${
                value > 0.8 ? 'bg-green-400' :
                value > 0.6 ? 'bg-yellow-400' :
                value > 0.3 ? 'bg-orange-400' : 'bg-red-400'
              }`}>
                <div 
                  className="h-full bg-white rounded-full"
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
    </div>
  );
};

export default Enhanced3DCropSimulation;
