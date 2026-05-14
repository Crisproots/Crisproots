// SoilGrids API service for real soil data
export interface SoilData {
  pH: number;
  organicCarbon: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilTexture: {
    sand: number;
    silt: number;
    clay: number;
    textureClass: string;
  };
  bulkDensity: number;
  cationExchangeCapacity: number;
  waterContent: number;
}

export interface SoilGridsResponse {
  properties: {
    layers: Array<{
      name: string;
      unit_measure: {
        d_factor: number;
        mapped_units: string;
        target_units: string;
      };
      depths: Array<{
        range: string;
        label: string;
        values: {
          Q0_05: number;
          Q0_5: number;
          Q0_95: number;
          mean: number;
        };
      }>;
    }>;
  };
}

class SoilGridsService {
  private baseUrl = 'https://rest.isric.org/soilgrids/v2.0';

  async getSoilData(lat: number, lon: number, depth: string = '0-5cm'): Promise<SoilData | null> {
    try {
      // Properties to fetch from SoilGrids
      const properties = [
        'phh2o',      // pH in H2O
        'soc',        // Soil Organic Carbon
        'nitrogen',   // Total Nitrogen
        'sand',       // Sand content
        'silt',       // Silt content
        'clay',       // Clay content
        'bdod',       // Bulk density
        'cec',        // Cation exchange capacity
        'wv0010'      // Water content at 10 kPa (field capacity)
      ];

      const propertyQuery = properties.join('%7C'); // URL encoded pipe separator
      const url = `${this.baseUrl}/properties/query?lon=${lon}&lat=${lat}&property=${propertyQuery}&depth=${depth}&value=mean`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`SoilGrids API error: ${response.status}`);
      }

      const data: SoilGridsResponse = await response.json();
      return this.parseSoilData(data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
      return null;
    }
  }

  private parseSoilData(data: SoilGridsResponse): SoilData {
    const layers = data.properties.layers;
    
    // Helper function to get property value
    const getPropertyValue = (propertyName: string): number => {
      const layer = layers.find(l => l.name === propertyName);
      if (!layer || !layer.depths[0]) return 0;
      
      const value = layer.depths[0].values.mean;
      const factor = layer.unit_measure.d_factor;
      return value / factor;
    };

    // Get sand, silt, clay percentages
    const sand = getPropertyValue('sand');
    const silt = getPropertyValue('silt');
    const clay = getPropertyValue('clay');

    // Determine texture class based on sand/silt/clay percentages
    const textureClass = this.determineTextureClass(sand, silt, clay);

    return {
      pH: getPropertyValue('phh2o'),
      organicCarbon: getPropertyValue('soc'),
      nitrogen: getPropertyValue('nitrogen'),
      phosphorus: 15, // Default value as SoilGrids doesn't provide P
      potassium: 120, // Default value as SoilGrids doesn't provide K
      soilTexture: {
        sand,
        silt,
        clay,
        textureClass
      },
      bulkDensity: getPropertyValue('bdod'),
      cationExchangeCapacity: getPropertyValue('cec'),
      waterContent: getPropertyValue('wv0010')
    };
  }

  private determineTextureClass(sand: number, silt: number, clay: number): string {
    // Simplified soil texture classification
    if (clay >= 40) return 'Clay';
    if (clay >= 27 && clay < 40) {
      if (sand <= 20) return 'Clay Loam';
      return 'Clay Loam';
    }
    if (clay >= 20 && clay < 27) {
      if (sand <= 45) return 'Loam';
      return 'Sandy Clay Loam';
    }
    if (clay >= 7 && clay < 20) {
      if (sand <= 52) return 'Silt Loam';
      return 'Sandy Loam';
    }
    if (sand >= 85) return 'Sand';
    if (sand >= 70) return 'Loamy Sand';
    return 'Silt';
  }

  // Get soil data for multiple coordinates (for area analysis)
  async getSoilDataForArea(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }, gridSize: number = 5): Promise<SoilData[]> {
    const results: SoilData[] = [];
    const latStep = (bounds.north - bounds.south) / gridSize;
    const lonStep = (bounds.east - bounds.west) / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const lat = bounds.south + (i * latStep);
        const lon = bounds.west + (j * lonStep);
        
        const soilData = await this.getSoilData(lat, lon);
        if (soilData) {
          results.push(soilData);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  // Get soil suitability score for a specific crop
  getSoilSuitabilityScore(soilData: SoilData, cropType: string): {
    score: number;
    factors: {
      pH: { score: number; optimal: string; current: number };
      nitrogen: { score: number; optimal: string; current: number };
      texture: { score: number; optimal: string; current: string };
      organicMatter: { score: number; optimal: string; current: number };
    };
  } {
    const cropRequirements = this.getCropSoilRequirements(cropType);
    
    // Calculate pH score
    const pHScore = this.calculateScoreInRange(
      soilData.pH,
      cropRequirements.pH.min,
      cropRequirements.pH.max
    );

    // Calculate nitrogen score  
    const nitrogenScore = soilData.nitrogen >= cropRequirements.nitrogen.min ? 100 : 
      (soilData.nitrogen / cropRequirements.nitrogen.min) * 100;

    // Calculate texture score
    const textureScore = cropRequirements.preferredTextures.includes(soilData.soilTexture.textureClass) ? 100 : 50;

    // Calculate organic matter score
    const organicMatterScore = this.calculateScoreInRange(
      soilData.organicCarbon,
      cropRequirements.organicMatter.min,
      cropRequirements.organicMatter.max
    );

    const overallScore = (pHScore + nitrogenScore + textureScore + organicMatterScore) / 4;

    return {
      score: Math.round(overallScore),
      factors: {
        pH: {
          score: Math.round(pHScore),
          optimal: `${cropRequirements.pH.min}-${cropRequirements.pH.max}`,
          current: Math.round(soilData.pH * 10) / 10
        },
        nitrogen: {
          score: Math.round(nitrogenScore),
          optimal: `>${cropRequirements.nitrogen.min} mg/kg`,
          current: Math.round(soilData.nitrogen)
        },
        texture: {
          score: Math.round(textureScore),
          optimal: cropRequirements.preferredTextures.join(', '),
          current: soilData.soilTexture.textureClass
        },
        organicMatter: {
          score: Math.round(organicMatterScore),
          optimal: `${cropRequirements.organicMatter.min}-${cropRequirements.organicMatter.max}%`,
          current: Math.round(soilData.organicCarbon * 10) / 10
        }
      }
    };
  }

  private calculateScoreInRange(value: number, min: number, max: number): number {
    if (value >= min && value <= max) return 100;
    if (value < min) return (value / min) * 100;
    return Math.max(0, 100 - ((value - max) / max) * 100);
  }

  private getCropSoilRequirements(cropType: string) {
    interface CropRequirement {
      pH: { min: number; max: number };
      nitrogen: { min: number };
      preferredTextures: string[];
      organicMatter: { min: number; max: number };
    }

    const requirements: Record<string, CropRequirement> = {
      'wheat': {
        pH: { min: 6.0, max: 7.5 },
        nitrogen: { min: 40 },
        preferredTextures: ['Loam', 'Clay Loam', 'Silt Loam'],
        organicMatter: { min: 2.0, max: 4.0 }
      },
      'rice': {
        pH: { min: 5.5, max: 7.0 },
        nitrogen: { min: 60 },
        preferredTextures: ['Clay', 'Clay Loam'],
        organicMatter: { min: 1.5, max: 3.5 }
      },
      'corn': {
        pH: { min: 6.0, max: 7.0 },
        nitrogen: { min: 50 },
        preferredTextures: ['Loam', 'Silt Loam', 'Sandy Loam'],
        organicMatter: { min: 2.5, max: 4.5 }
      },
      'soybean': {
        pH: { min: 6.0, max: 7.5 },
        nitrogen: { min: 30 },
        preferredTextures: ['Loam', 'Silt Loam', 'Clay Loam'],
        organicMatter: { min: 2.0, max: 4.0 }
      },
      'potato': {
        pH: { min: 5.0, max: 6.5 },
        nitrogen: { min: 45 },
        preferredTextures: ['Sandy Loam', 'Loam'],
        organicMatter: { min: 3.0, max: 5.0 }
      },
      'tomato': {
        pH: { min: 6.0, max: 7.0 },
        nitrogen: { min: 40 },
        preferredTextures: ['Loam', 'Sandy Loam', 'Silt Loam'],
        organicMatter: { min: 2.5, max: 4.5 }
      }
    };

    return requirements[cropType.toLowerCase()] || requirements['wheat']; // Default to wheat
  }
}

const soilGridsService = new SoilGridsService();
export default soilGridsService;
