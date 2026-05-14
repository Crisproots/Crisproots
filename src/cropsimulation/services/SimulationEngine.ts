// src/cropsimulation/services/SimulationEngine.ts

export interface PlantPhysiology {
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
  nutrientUptake: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  stressFactors: {
    water: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    temperature: number;
    light: number;
    disease: number;
    pest: number;
  };
}

export interface PlantMorphology {
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
  senescentLeaves: number;
}

export interface EnvironmentalFactors {
  temperature: number;
  humidity: number;
  windSpeed: number;
  lightIntensity: number; // in PAR (μmol/m²/s)
  soilMoisture: number; // volumetric water content
  soilTemperature: number;
  co2Concentration: number; // ppm
  vaporPressureDeficit: number; // kPa
}

export interface SoilProfile {
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  organicMatter: number; // %
  salinity: number; // dS/m
}

export interface SimulationParameters {
  cropType: string;
  soilProfile: SoilProfile;
  weatherEvents: {
    frost: boolean;
    heatwave: boolean;
    drought: boolean;
    heavyRain: boolean;
  };
  pestPressure: number; // 0-1
  diseasePressure: number; // 0-1
}

const CROP_GROWTH_MODELS = {
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

export class SimulationEngine {
  public physiology: PlantPhysiology;
  public morphology: PlantMorphology;
  public parameters: SimulationParameters;
  private day: number;

  constructor(parameters: SimulationParameters, initialDay: number = 0) {
    this.parameters = parameters;
    this.day = initialDay;
    this.physiology = this.getInitialPhysiology();
    this.morphology = this.getInitialMorphology();
  }

  private getInitialPhysiology(): PlantPhysiology {
    return {
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
      nutrientUptake: { nitrogen: 0, phosphorus: 0, potassium: 0 },
      stressFactors: {
        water: 1.0, nitrogen: 1.0, phosphorus: 1.0, potassium: 1.0,
        temperature: 1.0, light: 1.0, disease: 1.0, pest: 1.0
      }
    };
  }

  private getInitialMorphology(): PlantMorphology {
    return {
      height: 1, leafCount: 0, stemDiameter: 0.5, rootDepth: 0.5,
      rootSpread: 0.3, branchCount: 0, flowerCount: 0, fruitCount: 0,
      leafSize: 0, internodeLength: 0.5, senescentLeaves: 0
    };
  }

  public update(day: number, env: EnvironmentalFactors) {
    this.day = day;
    const cropModel = CROP_GROWTH_MODELS[this.parameters.cropType as keyof typeof CROP_GROWTH_MODELS];
    if (!cropModel) return;

    // 1. Calculate Stress
    this.calculateStressFactors(env, cropModel);

    // 2. Update Physiology
    this.updatePhysiology(env);

    // 3. Update Morphology
    this.updateMorphology(cropModel);
  }

  private calculateStressFactors(env: EnvironmentalFactors, crop: typeof CROP_GROWTH_MODELS.wheat) {
    // Temperature stress
    const tempStress = this.calculateTemperatureStress(env.temperature, crop.temperatureResponse);
    
    // Water stress
    const waterStress = this.calculateWaterStress(env.soilMoisture, crop.waterResponse);
    
    // Light stress
    const lightStress = this.calculateLightStress(env.lightIntensity, crop.lightResponse);
    
    // Nutrient stress
    const nitrogenStress = this.calculateNitrogenStress();
    const phosphorusStress = this.calculatePhosphorusStress();
    const potassiumStress = this.calculatePotassiumStress();
    
    // Pest and disease stress
    const diseaseStress = this.calculateDiseaseStress(env);
    const pestStress = this.calculatePestStress();

    this.physiology.stressFactors = {
      water: waterStress,
      nitrogen: nitrogenStress,
      phosphorus: phosphorusStress,
      potassium: potassiumStress,
      temperature: tempStress,
      light: lightStress,
      disease: diseaseStress,
      pest: pestStress
    };
  }

  private calculateTemperatureStress(temp: number, response: { min: number; opt: number; max: number }) {
    if (temp < response.min || temp > response.max) return 0.1;
    if (temp >= response.opt - 5 && temp <= response.opt + 5) return 1.0;
    
    const distanceFromOptimal = Math.min(
      Math.abs(temp - response.opt),
      Math.abs(temp - response.min),
      Math.abs(temp - response.max)
    );
    
    return Math.max(0.1, 1.0 - (distanceFromOptimal / 10));
  }

  private calculateWaterStress(moisture: number, response: { min: number; opt: number; max: number }) {
    if (moisture < response.min * 0.5) return 0.1;
    if (moisture >= response.opt * 0.8 && moisture <= response.opt * 1.2) return 1.0;
    
    if (moisture < response.opt) {
      return Math.max(0.1, moisture / response.opt);
    } else {
      const excess = moisture - response.opt;
      return Math.max(0.3, 1.0 - (excess / response.max));
    }
  }

  private calculateLightStress(light: number, response: { min: number; opt: number; max: number }) {
    if (light < response.min) return Math.max(0.1, light / response.min);
    if (light > response.max) return Math.max(0.3, response.max / light);
    return 1.0;
  }

  private calculateNitrogenStress(): number {
    const availableN = this.parameters.soilProfile.nitrogen;
    const optimalN = 150; // kg/ha
    return Math.min(1.0, Math.max(0.1, availableN / optimalN));
  }

  private calculatePhosphorusStress(): number {
    const availableP = this.parameters.soilProfile.phosphorus;
    const optimalP = 30; // kg/ha
    return Math.min(1.0, Math.max(0.1, availableP / optimalP));
  }

  private calculatePotassiumStress(): number {
    const availableK = this.parameters.soilProfile.potassium;
    const optimalK = 80; // kg/ha
    return Math.min(1.0, Math.max(0.1, availableK / optimalK));
  }

  private calculateDiseaseStress(env: EnvironmentalFactors): number {
    let baseStress = 1.0 - this.parameters.diseasePressure;
    
    // High humidity and moderate temperatures increase disease pressure
    if (env.humidity > 80 && env.temperature > 20 && env.temperature < 30) {
      baseStress *= 0.7;
    }
    
    // Wet conditions increase fungal diseases
    if (env.soilMoisture > 80) {
      baseStress *= 0.8;
    }
    
    return Math.max(0.1, baseStress);
  }

  private calculatePestStress(): number {
    return Math.max(0.1, 1.0 - this.parameters.pestPressure);
  }

  private updatePhysiology(env: EnvironmentalFactors) {
    // Calculate photosynthesis
    const photosynthesis = this.calculatePhotosynthesis(env);
    
    // Calculate respiration
    const respiration = this.calculateRespiration(env.temperature);
    
    // Calculate transpiration
    const transpiration = this.calculateTranspiration(env);
    
    // Update physiology
    this.physiology.photosynthesisRate = photosynthesis;
    this.physiology.respirationRate = respiration;
    this.physiology.transpiration = transpiration;
    
    // Net growth
    const netPhotosynthesis = Math.max(0, photosynthesis - respiration);
    const overallStress = Object.values(this.physiology.stressFactors).reduce((a, b) => a * b, 1);
    const growthRate = netPhotosynthesis * overallStress;
    
    // Update biomass allocation
    this.physiology.biomass += growthRate * 0.01;
    this.physiology.leafAreaIndex = (this.morphology.leafCount * this.morphology.leafSize) / 10000;
    this.physiology.waterUptake = transpiration * 1.2;
    
    // Nutrient uptake
    this.physiology.nutrientUptake.nitrogen = growthRate * 0.03;
    this.physiology.nutrientUptake.phosphorus = growthRate * 0.005;
    this.physiology.nutrientUptake.potassium = growthRate * 0.02;
  }

  private calculatePhotosynthesis(env: EnvironmentalFactors): number {
    const lightSaturation = Math.min(1.0, env.lightIntensity / 25);
    const co2Effect = Math.min(1.5, env.co2Concentration / 380);
    const temperatureEffect = this.physiology.stressFactors.temperature;
    
    const maxPhotosynthesis = this.morphology.leafCount * this.morphology.leafSize * 0.1;
    
    return maxPhotosynthesis * lightSaturation * co2Effect * temperatureEffect *
           this.physiology.stressFactors.water * this.physiology.stressFactors.nitrogen;
  }

  private calculateRespiration(temperature: number): number {
    const q10 = 2.0; // Q10 coefficient for respiration
    const baseTemp = 20;
    const tempFactor = Math.pow(q10, (temperature - baseTemp) / 10);
    return this.physiology.biomass * 0.02 * tempFactor;
  }

  private calculateTranspiration(env: EnvironmentalFactors): number {
    const leafArea = this.morphology.leafCount * this.morphology.leafSize;
    const conductance = leafArea * 0.01 * this.physiology.stressFactors.water;
    return conductance * env.vaporPressureDeficit * (1 + env.windSpeed * 0.1);
  }

  private updateMorphology(crop: typeof CROP_GROWTH_MODELS.wheat) {
    const totalDuration = crop.growthStages.reduce((sum, stage) => sum + stage.duration, 0);
    const progressRatio = Math.min(1, this.day / totalDuration);
    
    let cumulativeDays = 0;
    let currentStageIndex = 0;
    
    for (let i = 0; i < crop.growthStages.length; i++) {
      cumulativeDays += crop.growthStages[i].duration;
      if (this.day <= cumulativeDays) {
        currentStageIndex = i;
        break;
      }
    }

    const currentStage = crop.growthStages[currentStageIndex];
    const stageProgress = Math.min(1, (this.day - (cumulativeDays - currentStage.duration)) / currentStage.duration);
    
    // Apply stress effects to growth
    const overallStress = Object.values(this.physiology.stressFactors).reduce((a, b) => a * b, 1);
    const growthMultiplier = 0.5 + (overallStress * 0.5);

    this.morphology = {
      height: currentStage.characteristics.height * stageProgress * growthMultiplier,
      leafCount: Math.floor(currentStage.characteristics.leaves * stageProgress),
      stemDiameter: (currentStage.characteristics.height / 100) * growthMultiplier,
      rootDepth: currentStage.characteristics.roots * stageProgress * growthMultiplier,
      rootSpread: currentStage.characteristics.roots * 0.7 * stageProgress * growthMultiplier,
      branchCount: Math.floor(Math.max(0, currentStage.characteristics.leaves - 4) * stageProgress),
      flowerCount: currentStageIndex >= 4 ? Math.floor((currentStageIndex - 3) * 5 * stageProgress) : 0,
      fruitCount: currentStageIndex >= 6 ? Math.floor((currentStageIndex - 5) * 3 * stageProgress) : 0,
      leafSize: 5 + (currentStageIndex * 2) * growthMultiplier,
      internodeLength: 2 + (currentStageIndex * 0.5) * growthMultiplier,
      senescentLeaves: Math.floor(this.morphology.leafCount * 0.1 * progressRatio)
    };
  }
}
