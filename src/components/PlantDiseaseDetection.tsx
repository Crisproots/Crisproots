"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import './PlantDiseaseDetection.module.css';
import { demoImages, mockDiseaseResults } from './demoPlantData';
import { 
  Camera, 
  Upload, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Zap,
  Eye,
  Brain,
  Activity,
  Microscope,
  Droplets,
  Wind,
  ThermometerSun,
  Star,
  TrendingUp,
  Download,
  Share2,
  RefreshCw,
  Info,
  Clock,
  Shield,
  Bug,
  Beaker,
  Sparkles,
  Bot,
  Cpu
} from 'lucide-react';
import Image from 'next/image';

// Types
interface DiseaseAnalysis {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  symptoms: string[];
  causes: string[];
  affectedParts: string[];
  stage: string;
  spreadRate: 'slow' | 'moderate' | 'fast' | 'very_fast';
  seasonality: string[];
  economicImpact: {
    yieldLoss: string;
    marketValue: string;
  };
}

interface Treatment {
  id: string;
  type: 'organic' | 'chemical' | 'biological' | 'cultural';
  name: string;
  activeIngredient?: string;
  application: string;
  dosage: string;
  frequency: string;
  timing: string;
  effectiveness: number;
  cost: 'low' | 'medium' | 'high';
  availability: 'common' | 'moderate' | 'rare';
  safePeriod: string;
  precautions: string[];
}

interface Prevention {
  category: 'cultural' | 'biological' | 'chemical' | 'resistance';
  practice: string;
  description: string;
  effectiveness: number;
  implementation: string;
  cost: 'low' | 'medium' | 'high';
}

interface AnalysisResult {
  disease: DiseaseAnalysis;
  treatments: Treatment[];
  prevention: Prevention[];
  environmentalFactors: {
    humidity: number;
    temperature: number;
    rainfall: number;
    soilPh: number;
  };
  prognosis: {
    withTreatment: string;
    withoutTreatment: string;
    recoveryTime: string;
  };
  similarCases: number;
  expertRecommendation: string;
}

const PlantDiseaseDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'detection' | 'analysis' | 'treatment' | 'prevention'>('detection');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [imageAnalysisStage, setImageAnalysisStage] = useState<string>('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 24,
    humidity: 68,
    rainfall: 'Low',
    windSpeed: '12 km/h'
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [treatmentCalendar, setTreatmentCalendar] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate real-time weather data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeather(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 5)),
        rainfall: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
        windSpeed: `${Math.floor(Math.random() * 20 + 5)} km/h`
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced analysis function with more detailed stages
  const analyzeImage = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // More realistic analysis stages
    const progressSteps = [
      { step: 15, message: "Initializing AI models...", stage: "initialization" },
      { step: 30, message: "Preprocessing and enhancing image...", stage: "preprocessing" },
      { step: 45, message: "Extracting visual features...", stage: "feature_extraction" },
      { step: 60, message: "Analyzing leaf patterns and textures...", stage: "pattern_analysis" },
      { step: 75, message: "Detecting disease markers and symptoms...", stage: "disease_detection" },
      { step: 90, message: "Cross-referencing with disease database...", stage: "database_matching" },
      { step: 100, message: "Generating treatment recommendations...", stage: "recommendations" }
    ];

    for (const { step, message, stage } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step);
      setImageAnalysisStage(message);
    }

    // Add to analysis history
    const newResult = analysisResult || mockDiseaseResults['tomato_late_blight'];
    setAnalysisHistory(prev => [newResult, ...prev.slice(0, 4)]); // Keep last 5 analyses
    
    setIsAnalyzing(false);
    setActiveTab('analysis');
  }, [analysisResult]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowImagePreview(true);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  }, [analyzeImage]);



  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Start analysis
      analyzeImage();
    }
  }, [analyzeImage]);

  const handleCameraCapture = useCallback(() => {
    // In a real app, this would open camera
    fileInputRef.current?.click();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'organic': return 'bg-green-500';
      case 'chemical': return 'bg-blue-500';
      case 'biological': return 'bg-purple-500';
      case 'cultural': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8 animate-slideInLeft">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full animate-pulse-gentle">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 animate-bounce-gentle">
            🔬 AI Plant Disease Detection
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto animate-slideInRight">
          Advanced AI-powered plant disease diagnosis with comprehensive treatment recommendations. 
          Upload an image of your affected plant for instant analysis.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center mb-8 animate-fadeIn">
        <div className="flex bg-gray-100 rounded-xl p-1 hover-lift">
          {[
            { id: 'detection', label: 'Detection', icon: Camera },
            { id: 'analysis', label: 'Analysis', icon: Brain },
            { id: 'treatment', label: 'Treatment', icon: Beaker },
            { id: 'prevention', label: 'Prevention', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'detection' | 'analysis' | 'treatment' | 'prevention')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 hover-scale ${
                activeTab === id
                  ? 'bg-white text-green-600 shadow-md scale-105 animate-glow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detection Tab */}
      {activeTab === 'detection' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Image Upload Area */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {!selectedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-green-400 transition-colors hover-lift card-enter card-enter-active">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors hover-scale animate-bounce-gentle"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Image</span>
                    </button>
                    <button
                      onClick={handleCameraCapture}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover-scale"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                  <p className="text-gray-500 animate-pulse-gentle">
                    Upload a clear image of the affected plant leaves, stems, or fruits
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                    <span className="animate-bounce-gentle">📱 Phone Camera</span>
                    <span className="animate-bounce-gentle" style={{animationDelay: '0.2s'}}>💻 Computer Files</span>
                    <span className="animate-bounce-gentle" style={{animationDelay: '0.4s'}}>☁️ Cloud Storage</span>
                  </div>
                  
                  {/* Demo Samples */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">Try Demo Samples</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {demoImages.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setSelectedImage(demo.src);
                            // Use specific disease data for demo
                            const demoResult = mockDiseaseResults[demo.id as keyof typeof mockDiseaseResults];
                            setTimeout(() => {
                              setAnalysisResult(demoResult);
                              setActiveTab('analysis');
                            }, 100);
                          }}
                          className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover-scale"
                          style={{animationDelay: `${index * 0.1}s`}}
                        >
                          <Image
                            src={demo.src}
                            alt={demo.name}
                            width={120}
                            height={90}
                            className="w-full h-20 object-cover"
                          />
                          <div className="p-2">
                            <div className="text-xs font-medium text-gray-800 truncate">{demo.name}</div>
                            <div className="text-xs text-gray-500 truncate">{demo.description}</div>
                          </div>
                          <div className="absolute inset-0 bg-green-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Analyze
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Plant for analysis"
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Scan className="w-6 h-6 text-green-400 animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-lg font-semibold animate-pulse">Analyzing Plant...</div>
                          <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
                            <div
                              className="progress-bar h-2 rounded-full transition-all duration-500"
                              style={{ width: `${analysisProgress}%` }}
                            />
                          </div>
                          <div className="text-sm opacity-80 animate-bounce-gentle">{analysisProgress}% Complete</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto animate-bounce-gentle" />
                        <div className="text-lg font-semibold animate-pulse-gentle">Analysis Complete!</div>
                        <button
                          onClick={() => setActiveTab('analysis')}
                          className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors hover-scale animate-glow"
                        >
                          View Results
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="grid md:grid-cols-3 gap-4 animate-slideInLeft">
            {[
              {
                icon: Eye,
                title: "Clear Images",
                tip: "Ensure good lighting and focus on affected areas"
              },
              {
                icon: Zap,
                title: "Multiple Angles",
                tip: "Take photos from different angles for better analysis"
              },
              {
                icon: Activity,
                title: "Fresh Samples",
                tip: "Use recent images for most accurate diagnosis"
              }
            ].map(({ icon: Icon, title, tip }, index) => (
              <div 
                key={index} 
                className="p-4 bg-gray-50 rounded-xl hover-lift card-enter card-enter-active" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className="w-5 h-5 text-green-600 animate-pulse-gentle" />
                  <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Disease Identification */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200 hover-lift card-enter card-enter-active">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-600 animate-bounce-gentle" />
                <div>
                  <h2 className="text-2xl font-bold text-red-800 animate-slideInLeft">{analysisResult.disease.name}</h2>
                  <p className="text-red-600 italic animate-slideInLeft" style={{animationDelay: '0.1s'}}>{analysisResult.disease.scientificName}</p>
                </div>
              </div>
              <div className="text-right animate-slideInRight">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysisResult.disease.severity)} severity-${analysisResult.disease.severity}`}>
                  {analysisResult.disease.severity.toUpperCase()} SEVERITY
                </div>
                <div className="mt-2 text-sm text-gray-600 animate-pulse-gentle">
                  Confidence: {analysisResult.disease.confidence}%
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>{analysisResult.disease.description}</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Stage', value: analysisResult.disease.stage },
                { label: 'Spread Rate', value: analysisResult.disease.spreadRate.replace('_', ' ') },
                { label: 'Yield Loss', value: analysisResult.disease.economicImpact.yieldLoss },
                { label: 'Similar Cases', value: `${analysisResult.similarCases} in database` }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 hover-scale card-enter card-enter-active" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{item.label}</h4>
                  <p className="text-sm text-gray-600 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms and Causes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Bug className="w-5 h-5 text-orange-600 mr-2" />
                Symptoms
              </h3>
              <ul className="space-y-2">
                {analysisResult.disease.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                Causes
              </h3>
              <ul className="space-y-2">
                {analysisResult.disease.causes.map((cause, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <ThermometerSun className="w-5 h-5 mr-2" />
              Environmental Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Humidity', value: `${analysisResult.environmentalFactors.humidity}%`, icon: Droplets, color: 'text-blue-600' },
                { label: 'Temperature', value: `${analysisResult.environmentalFactors.temperature}°C`, icon: ThermometerSun, color: 'text-orange-600' },
                { label: 'Rainfall', value: `${analysisResult.environmentalFactors.rainfall}mm`, icon: Wind, color: 'text-gray-600' },
                { label: 'Soil pH', value: analysisResult.environmentalFactors.soilPh.toString(), icon: Beaker, color: 'text-green-600' }
              ].map(({ label, value, icon: Icon, color }, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                  <div className="text-sm text-gray-600">{label}</div>
                  <div className="text-lg font-bold text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Recommendation */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 animate-fadeIn">
            <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Expert Recommendation
            </h3>
            <p className="text-green-700">{analysisResult.expertRecommendation}</p>
          </div>

          {/* AI Analysis Statistics */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-slideInLeft">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Analysis Insights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analysisResult.similarCases.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Similar Cases</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analysisResult.disease.confidence}%</div>
                <div className="text-sm text-gray-600">AI Confidence</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{analysisResult.treatments.length}</div>
                <div className="text-sm text-gray-600">Treatment Options</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{analysisResult.prevention.length}</div>
                <div className="text-sm text-gray-600">Prevention Methods</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Treatment Tab */}
      {activeTab === 'treatment' && analysisResult && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Treatment Options</h2>
            <p className="text-gray-600">Choose the most suitable treatment based on your preferences and resources</p>
          </div>

          <div className="grid gap-6">
            {analysisResult.treatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTreatment(selectedTreatment?.id === treatment.id ? null : treatment)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(treatment.type)}`}>
                      <Beaker className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{treatment.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">{treatment.type}</span>
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {treatment.effectiveness}% effective
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Cost</div>
                    <div className="capitalize font-medium">{treatment.cost}</div>
                  </div>
                </div>

                {selectedTreatment?.id === treatment.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Application Details</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Method:</span> {treatment.application}</div>
                          <div><span className="font-medium">Dosage:</span> {treatment.dosage}</div>
                          <div><span className="font-medium">Frequency:</span> {treatment.frequency}</div>
                          <div><span className="font-medium">Timing:</span> {treatment.timing}</div>
                          <div><span className="font-medium">Safe Period:</span> {treatment.safePeriod}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Precautions</h4>
                        <ul className="space-y-1 text-sm">
                          {treatment.precautions.map((precaution, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{precaution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prognosis */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 text-green-600 mr-2" />
              Treatment Prognosis
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  With Treatment
                </h4>
                <p className="text-sm text-gray-700">{analysisResult.prognosis.withTreatment}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  Without Treatment
                </h4>
                <p className="text-sm text-gray-700">{analysisResult.prognosis.withoutTreatment}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">Expected Recovery Time</div>
              <div className="text-lg font-bold text-gray-800 flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2" />
                {analysisResult.prognosis.recoveryTime}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prevention Tab */}
      {activeTab === 'prevention' && analysisResult && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Prevention Strategies</h2>
            <p className="text-gray-600">Long-term practices to prevent future disease outbreaks</p>
          </div>

          <div className="grid gap-4">
            {analysisResult.prevention.map((prevention, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(prevention.category)}`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{prevention.practice}</h3>
                      <span className="text-sm text-gray-500 capitalize">{prevention.category} Practice</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Effectiveness</div>
                    <div className="text-lg font-bold text-green-600">{prevention.effectiveness}%</div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{prevention.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-800">Implementation: </span>
                    <span className="text-gray-600">{prevention.implementation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Cost:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      prevention.cost === 'low' ? 'bg-green-100 text-green-800' :
                      prevention.cost === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {prevention.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Tips */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 animate-slideInRight">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              General Prevention Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Regular monitoring and early detection",
                "Maintain proper plant nutrition",
                "Ensure adequate drainage systems",
                "Use certified disease-free seeds",
                "Practice crop hygiene and sanitation",
                "Monitor weather conditions closely"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-2 animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Content */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 animate-fadeIn">
            <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Understanding Plant Diseases
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 hover-lift">
                <h4 className="font-semibold text-indigo-700 mb-2">🦠 Fungal Diseases</h4>
                <p className="text-sm text-gray-600">Most common plant diseases, spread through spores. Thrive in humid conditions.</p>
              </div>
              <div className="bg-white rounded-lg p-4 hover-lift">
                <h4 className="font-semibold text-indigo-700 mb-2">🦠 Bacterial Diseases</h4>
                <p className="text-sm text-gray-600">Spread through water, wounds, and insects. Often cause wilting and rot.</p>
              </div>
              <div className="bg-white rounded-lg p-4 hover-lift">
                <h4 className="font-semibold text-indigo-700 mb-2">🦠 Viral Diseases</h4>
                <p className="text-sm text-gray-600">Transmitted by insects or through plant material. Cause mosaic patterns and stunting.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {analysisResult && (
        <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share Results</span>
          </button>
          <button 
            onClick={() => {
              setSelectedImage(null);
              setAnalysisResult(null);
              setActiveTab('detection');
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantDiseaseDetection;
