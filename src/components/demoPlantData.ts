// Demo images and disease data for Plant Disease Detection
export const demoImages = [
  {
    id: 'tomato_late_blight',
    src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMjJjNTVlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiI+VG9tYXRvIExlYWYgKExhdGUgQmxpZ2h0KTwvdGV4dD4KPHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj4KICA8cGF0aCBkPSJNNTAgMTAwUTEwMCA1MCAyMDAgMTAwVDM1MCA3NUwzMDAgMTUwUTI1MCAyMDAgMTUwIDE1MFQwIDEyNVoiIGZpbGw9IiMxNmEzNGEiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjE1IiBmaWxsPSIjNzQxYjQ3Ii8+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzc0MWI0NyIvPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjkwIiByPSIxMiIgZmlsbD0iIzc0MWI0NyIvPgo8L3N2Zz4KPC9zdmc+',
    name: 'Tomato Late Blight',
    description: 'Dark lesions on tomato leaves indicating late blight infection'
  },
  {
    id: 'potato_early_blight',
    src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNDBkNmZmIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiI+UG90YXRvIExlYWYgKEVhcmx5IEJsaWdodCk8L3RleHQ+CjxzdmcgeD0iNTAiIHk9IjUwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCI+CiAgPHBhdGggZD0iTTUwIDEwMFExMDAgNTAgMjAwIDEwMFQzNTAgNzVMMzAwIDE1MFEyNTAgMjAwIDE1MCAxNTBUMCAxMjVaIiBmaWxsPSIjMTZhMzRhIi8+CiAgPGVsbGlwc2UgY3g9IjEyMCIgY3k9IjExMCIgcng9IjMwIiByeT0iMjAiIGZpbGw9IiNmNTk3MzEiLz4KICA8ZWxsaXBzZSBjeD0iMjMwIiBjeT0iMTAwIiByeD0iMjUiIHJ5PSIxNSIgZmlsbD0iI2Y1OTczMSIvPgogIDxlbGxpcHNlIGN4PSIxODAiIGN5PSIxMzAiIHJ4PSIyMCIgcnk9IjEwIiBmaWxsPSIjZjU5NzMxIi8+Cjwvc3ZnPgo8L3N2Zz4=',
    name: 'Potato Early Blight',
    description: 'Concentric ring spots characteristic of early blight disease'
  },
  {
    id: 'apple_scab',
    src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZmI3MTg1Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiI+QXBwbGUgTGVhZiAoU2NhYik8L3RleHQ+CjxzdmcgeD0iNTAiIHk9IjUwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCI+CiAgPHBhdGggZD0iTTUwIDEwMFExMDAgNTAgMjAwIDEwMFQzNTAgNzVMMzAwIDE1MFEyNTAgMjAwIDE1MCAxNTBUMCAxMjVaIiBmaWxsPSIjMTZhMzRhIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyNSIgZmlsbD0iIzQzNDAzZiIgb3BhY2l0eT0iMC43Ii8+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTIwIiByPSIzMCIgZmlsbD0iIzQzNDAzZiIgb3BhY2l0eT0iMC43Ii8+CiAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iOTAiIHI9IjE4IiBmaWxsPSIjNDM0MDNmIiBvcGFjaXR5PSIwLjciLz4KPC9zdmc+Cjwvc3ZnPg==',
    name: 'Apple Scab',
    description: 'Dark, scabby lesions on apple leaves and fruits'
  }
];

export const mockDiseaseResults = {
  'tomato_late_blight': {
    disease: {
      id: "late_blight_001",
      name: "Late Blight",
      scientificName: "Phytophthora infestans",
      confidence: 94.7,
      severity: "high" as const,
      description: "A destructive disease that affects tomatoes and potatoes, causing dark lesions on leaves, stems, and fruits.",
      symptoms: [
        "Dark brown to black lesions on leaves",
        "White fuzzy growth on leaf undersides",
        "Brown rot on fruits/tubers",
        "Yellowing and wilting of affected areas"
      ],
      causes: [
        "High humidity (>90%)",
        "Cool temperatures (15-20°C)",
        "Poor air circulation",
        "Wet leaf surfaces"
      ],
      affectedParts: ["Leaves", "Stems", "Fruits", "Tubers"],
      stage: "Advanced",
      spreadRate: "very_fast" as const,
      seasonality: ["Monsoon", "Late Summer", "Early Autumn"],
      economicImpact: {
        yieldLoss: "30-80%",
        marketValue: "Severely reduced"
      }
    },
    treatments: [
      {
        id: "copper_fungicide",
        type: "chemical" as const,
        name: "Copper-based Fungicide",
        activeIngredient: "Copper sulfate",
        application: "Foliar spray",
        dosage: "2-3 grams per liter",
        frequency: "Every 7-10 days",
        timing: "Early morning or evening",
        effectiveness: 85,
        cost: "medium" as const,
        availability: "common" as const,
        safePeriod: "14 days before harvest",
        precautions: ["Wear protective gear", "Avoid during flowering"]
      }
    ],
    prevention: [
      {
        category: "cultural" as const,
        practice: "Crop Rotation",
        description: "Rotate with non-host crops for 2-3 years",
        effectiveness: 80,
        implementation: "Plant legumes or cereals in affected areas",
        cost: "low" as const
      }
    ],
    environmentalFactors: {
      humidity: 85,
      temperature: 18,
      rainfall: 120,
      soilPh: 6.2
    },
    prognosis: {
      withTreatment: "Good recovery expected in 2-3 weeks with proper treatment",
      withoutTreatment: "Complete crop loss likely within 10-14 days",
      recoveryTime: "14-21 days"
    },
    similarCases: 1247,
    expertRecommendation: "Immediate chemical treatment recommended due to advanced stage. Combine with cultural practices for long-term management."
  },
  'potato_early_blight': {
    disease: {
      id: "early_blight_001",
      name: "Early Blight",
      scientificName: "Alternaria solani",
      confidence: 91.3,
      severity: "medium" as const,
      description: "A common disease of potatoes and tomatoes causing distinctive concentric ring spots on leaves.",
      symptoms: [
        "Concentric ring spots on leaves",
        "Yellowing around lesions",
        "Premature leaf drop",
        "Brown lesions on stems"
      ],
      causes: [
        "Warm, humid conditions",
        "Plant stress",
        "Poor nutrition",
        "Overhead irrigation"
      ],
      affectedParts: ["Leaves", "Stems", "Tubers"],
      stage: "Moderate",
      spreadRate: "moderate" as const,
      seasonality: ["Summer", "Early Autumn"],
      economicImpact: {
        yieldLoss: "10-25%",
        marketValue: "Moderately reduced"
      }
    },
    treatments: [
      {
        id: "neem_treatment",
        type: "organic" as const,
        name: "Neem Oil Treatment",
        application: "Foliar spray",
        dosage: "5ml per liter water",
        frequency: "Every 5-7 days",
        timing: "Evening application",
        effectiveness: 70,
        cost: "low" as const,
        availability: "common" as const,
        safePeriod: "Safe until harvest",
        precautions: ["Test on small area first"]
      }
    ],
    prevention: [
      {
        category: "cultural" as const,
        practice: "Proper Spacing",
        description: "Ensure adequate plant spacing for air circulation",
        effectiveness: 70,
        implementation: "Maintain 60-90cm spacing between plants",
        cost: "low" as const
      }
    ],
    environmentalFactors: {
      humidity: 70,
      temperature: 25,
      rainfall: 60,
      soilPh: 6.0
    },
    prognosis: {
      withTreatment: "Good recovery expected with consistent treatment",
      withoutTreatment: "Progressive leaf loss and yield reduction",
      recoveryTime: "2-3 weeks"
    },
    similarCases: 890,
    expertRecommendation: "Apply organic treatment and improve cultural practices for sustainable management."
  },
  'apple_scab': {
    disease: {
      id: "apple_scab_001",
      name: "Apple Scab",
      scientificName: "Venturia inaequalis",
      confidence: 88.9,
      severity: "medium" as const,
      description: "A fungal disease that causes dark, scabby lesions on apple leaves and fruits.",
      symptoms: [
        "Dark olive-green spots on leaves",
        "Scabby lesions on fruits",
        "Premature leaf yellowing",
        "Reduced fruit quality"
      ],
      causes: [
        "Cool, moist spring weather",
        "Poor air circulation",
        "Dense canopy",
        "Overhead irrigation"
      ],
      affectedParts: ["Leaves", "Fruits", "Twigs"],
      stage: "Early to Moderate",
      spreadRate: "moderate" as const,
      seasonality: ["Spring", "Early Summer"],
      economicImpact: {
        yieldLoss: "5-15%",
        marketValue: "Significantly reduced"
      }
    },
    treatments: [
      {
        id: "sulfur_spray",
        type: "chemical" as const,
        name: "Sulfur Fungicide",
        application: "Foliar spray",
        dosage: "2g per liter",
        frequency: "Bi-weekly",
        timing: "Early morning",
        effectiveness: 80,
        cost: "medium" as const,
        availability: "common" as const,
        safePeriod: "7 days before harvest",
        precautions: ["Avoid during hot weather", "Use protective equipment"]
      }
    ],
    prevention: [
      {
        category: "resistance" as const,
        practice: "Resistant Varieties",
        description: "Use scab-resistant apple cultivars",
        effectiveness: 90,
        implementation: "Choose varieties with scab resistance genes",
        cost: "medium" as const
      }
    ],
    environmentalFactors: {
      humidity: 80,
      temperature: 15,
      rainfall: 100,
      soilPh: 6.8
    },
    prognosis: {
      withTreatment: "Excellent recovery with proper fungicide program",
      withoutTreatment: "Continued fruit damage and quality loss",
      recoveryTime: "1-2 weeks"
    },
    similarCases: 654,
    expertRecommendation: "Implement preventive spray program and consider resistant varieties for future plantings."
  }
};
