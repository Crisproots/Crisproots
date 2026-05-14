// Agricultural Knowledge Base for AI Assistant
export const agriculturalKnowledge = {
  commonCrops: {
    rice: {
      name: "Rice (Oryza sativa)",
      season: "Kharif (June-November)",
      soilType: "Clay, Clay loam",
      waterRequirement: "High (1500-2000mm)",
      temperature: "20-35°C",
      diseases: ["Blast", "Brown spot", "Sheath blight"],
      pests: ["Stem borer", "Brown planthopper", "Gall midge"],
      varieties: ["Basmati", "IR64", "Swarna", "MTU-1010"]
    },
    wheat: {
      name: "Wheat (Triticum aestivum)",
      season: "Rabi (November-April)",
      soilType: "Loam, Clay loam",
      waterRequirement: "Medium (450-650mm)",
      temperature: "15-25°C",
      diseases: ["Rust", "Smut", "Bunt"],
      pests: ["Aphids", "Termites", "Cutworm"],
      varieties: ["HD-2967", "PBW-725", "DBW-187"]
    },
    cotton: {
      name: "Cotton (Gossypium spp.)",
      season: "Kharif (April-December)",
      soilType: "Black soil, Red soil",
      waterRequirement: "Medium (700-1300mm)",
      temperature: "21-32°C",
      diseases: ["Wilt", "Boll rot", "Leaf curl"],
      pests: ["Bollworm", "Whitefly", "Thrips"],
      varieties: ["Bt Cotton", "RCH-659", "Bunny-Bt"]
    }
  },

  commonDiseases: {
    blast: {
      crop: "Rice",
      symptoms: "Diamond-shaped lesions on leaves with gray centers",
      cause: "Fungus (Magnaporthe oryzae)",
      treatment: "Tricyclazole, Carbendazim fungicides",
      prevention: "Resistant varieties, balanced fertilization"
    },
    rust: {
      crop: "Wheat",
      symptoms: "Orange-red pustules on leaves and stems",
      cause: "Fungus (Puccinia spp.)",
      treatment: "Propiconazole, Tebuconazole",
      prevention: "Early sowing, resistant varieties"
    },
    wilt: {
      crop: "Cotton",
      symptoms: "Yellowing and wilting of leaves, vascular browning",
      cause: "Fungus (Fusarium oxysporum)",
      treatment: "Carbendazim soil treatment",
      prevention: "Crop rotation, resistant varieties"
    }
  },

  soilHealth: {
    testing: {
      parameters: ["pH", "Organic Carbon", "Nitrogen", "Phosphorus", "Potassium"],
      frequency: "Every 2-3 years",
      bestTime: "Before sowing season",
      cost: "₹100-500 per sample"
    },
    improvement: {
      organic: ["Compost", "Vermicompost", "Green manure", "Biofertilizers"],
      chemical: ["Urea", "DAP", "MOP", "Micronutrients"],
      practices: ["Crop rotation", "Cover cropping", "Mulching"]
    }
  },

  waterManagement: {
    irrigation: {
      methods: ["Drip", "Sprinkler", "Furrow", "Flood"],
      efficiency: { drip: "90-95%", sprinkler: "75-85%", furrow: "60-70%" },
      crops: {
        drip: ["Vegetables", "Fruits", "Flowers"],
        sprinkler: ["Cereals", "Pulses", "Fodder"]
      }
    },
    conservation: {
      techniques: ["Rainwater harvesting", "Mulching", "Drip irrigation"],
      benefits: ["Water saving", "Reduced erosion", "Better yields"]
    }
  },

  sustainablePractices: {
    organic: {
      principles: ["No synthetic chemicals", "Soil health focus", "Biodiversity"],
      certification: "NPOP (National Programme for Organic Production)",
      benefits: ["Premium prices", "Export opportunities", "Environmental safety"]
    },
    integrated: {
      ipm: "Integrated Pest Management",
      inm: "Integrated Nutrient Management",
      icm: "Integrated Crop Management"
    }
  },

  marketInformation: {
    platforms: ["eNAM", "Kisan Call Centre", "Agmarknet"],
    schemes: ["PM-KISAN", "PMFBY", "PKVY", "RKVY"],
    prices: "Check MSP (Minimum Support Price) rates"
  },

  weatherPatterns: {
    monsoon: {
      southwest: "June-September",
      northeast: "October-December",
      importance: "90% of India's rainfall"
    },
    seasons: {
      kharif: "June-November (Monsoon crops)",
      rabi: "November-April (Winter crops)",
      zaid: "April-June (Summer crops)"
    }
  }
};

// Quick tips and recommendations
export const quickTips = [
  "Test your soil every 2-3 years for optimal nutrient management",
  "Use drip irrigation to save 30-50% water compared to flood irrigation",
  "Rotate crops to break pest and disease cycles naturally",
  "Apply neem oil as organic pesticide for most common pests",
  "Plant marigold and basil around crops for natural pest control",
  "Harvest rainwater during monsoons for dry season irrigation",
  "Use yellow sticky traps to monitor and control flying pests",
  "Maintain farm records for better decision making",
  "Join farmer groups for knowledge sharing and bulk buying",
  "Keep emergency contact numbers for veterinary and agricultural services"
];

// Seasonal calendar for major crops
export const seasonalCalendar = {
  january: ["Wheat management", "Vegetable harvesting", "Orchard pruning"],
  february: ["Wheat flag leaf stage", "Summer crop preparation", "Irrigation scheduling"],
  march: ["Wheat harvesting", "Summer vegetable sowing", "Fodder cultivation"],
  april: ["Summer crop sowing", "Irrigation management", "Pest monitoring"],
  may: ["Summer crop management", "Monsoon preparation", "Equipment maintenance"],
  june: ["Kharif sowing", "Monsoon crops", "Drainage management"],
  july: ["Kharif management", "Pest control", "Nutrient management"],
  august: ["Crop monitoring", "Disease management", "Intercultural operations"],
  september: ["Kharif maturity", "Harvest preparation", "Post-harvest planning"],
  october: ["Kharif harvesting", "Rabi preparation", "Soil testing"],
  november: ["Rabi sowing", "Winter crop establishment", "Irrigation setup"],
  december: ["Rabi management", "Winter protection", "Marketing planning"]
};
