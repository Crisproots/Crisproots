"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Satellite, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Cloud, 
  CloudRain,
  Zap,
  Shield,
  Bug,
  Sprout,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Target,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Map,
  Camera,
  Drone,
  Radio,
  Wifi,
  Database,
  Brain,
  Eye,
  Microscope,
  Globe,
  Layers,
  Settings,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Share2,
  Filter,
  Search,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Navigation,
  Crosshair,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Signal,
  Battery,
  Power,
  Refresh,
  Save,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  File,
  Code,
  Terminal,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Euro,
  PoundSterling,
  Coins,
  CreditCard,
  Banknote,
  Receipt,
  Calculator,
  Scale,
  Ruler,
  Gauge,
  Speedometer,
  Timer,
  Stopwatch,
  Alarm,
  Coffee,
  Home,
  Building,
  Factory,
  Warehouse,
  Store,
  ShoppingCart,
  Package,
  Truck,
  Car,
  Plane,
  Ship,
  Train,
  Bicycle,
  Tractor,
  Wrench,
  Hammer,
  Screwdriver,
  Scissors,
  Paintbrush,
  Pen,
  Pencil,
  Eraser,
  Book,
  BookOpen,
  Bookmark,
  Library,
  GraduationCap,
  Award,
  Trophy,
  Medal,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Crown,
  Flag,
  Mountain,
  Tree,
  Flower,
  Leaf,
  Seedling,
  Fish,
  Bird,
  Butterfly,
  Rabbit,
  Dog,
  Cat,
  Cow,
  Pig,
  Sheep,
  Horse,
  Chicken,
  Egg,
  Beaker,
  Circle
} from 'lucide-react';
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Bubble } from 'react-chartjs-2';
// import DroneMonitoringSystem from './DroneMonitoringSystem';
import DigitalFencingSystem from './DigitalFencingSystem';
import HeatMapSystem from './HeatMapSystem';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Advanced Interfaces
interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  cloudCover: number;
  dewPoint: number;
  forecast: {
    hourly: Array<{
      time: string;
      temp: number;
      humidity: number;
      precipitation: number;
      windSpeed: number;
    }>;
    daily: Array<{
      date: string;
      maxTemp: number;
      minTemp: number;
      precipitation: number;
      condition: string;
    }>;
  };
}

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
  temperature: number;
  salinity: number;
  cec: number; // Cation Exchange Capacity
  bulkDensity: number;
  porosity: number;
  infiltrationRate: number;
  micronutrients: {
    zinc: number;
    iron: number;
    manganese: number;
    copper: number;
    boron: number;
    sulfur: number;
  };
}

interface CropHealth {
  ndvi: number; // Normalized Difference Vegetation Index
  lai: number; // Leaf Area Index
  chlorophyll: number;
  waterStress: number;
  diseaseRisk: number;
  pestPressure: number;
  growthStage: string;
  yieldPrediction: number;
  biomass: number;
  canopyTemperature: number;
}

interface DroneData {
  flightId: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  altitude: number;
  battery: number;
  images: Array<{
    id: string;
    timestamp: string;
    coordinates: { lat: number; lng: number };
    type: 'rgb' | 'multispectral' | 'thermal' | 'lidar';
    analysis: {
      cropHealth: number;
      diseaseDetected: boolean;
      pestActivity: boolean;
      irrigationNeeded: boolean;
      maturityLevel: number;
    };
  }>;
  sensors: {
    temperature: number;
    humidity: number;
    co2: number;
    lightIntensity: number;
  };
}

interface DigitalFence {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  area: number; // in hectares
  cropType: string;
  plantingDate: string;
  expectedHarvest: string;
  alerts: Array<{
    type: 'intrusion' | 'weather' | 'disease' | 'harvest';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>;
  sensors: Array<{
    id: string;
    type: 'motion' | 'camera' | 'weather' | 'soil';
    status: 'active' | 'inactive' | 'maintenance';
    lastReading: string;
  }>;
}

interface DisasterPrediction {
  type: 'flood' | 'drought' | 'cyclone' | 'hailstorm' | 'frost' | 'pest_outbreak' | 'disease_epidemic';
  probability: number;
  expectedDate: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  affectedArea: number;
  precautions: string[];
  emergencyContacts: string[];
  insuranceClaim: boolean;
}

const CrispRootCropManagement: React.FC = () => {
  // Core State Management
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedField, setSelectedField] = useState<string>('field-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRealTime, setIsRealTime] = useState<boolean>(true);
  
  // Data States
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28.5,
    humidity: 72,
    pressure: 1013.2,
    windSpeed: 12.5,
    windDirection: 'NE',
    precipitation: 2.3,
    uvIndex: 7.2,
    visibility: 8.5,
    cloudCover: 35,
    dewPoint: 21.8,
    forecast: {
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        temp: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        precipitation: Math.random() * 5,
        windSpeed: 8 + Math.random() * 10
      })),
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        maxTemp: 30 + Math.random() * 8,
        minTemp: 18 + Math.random() * 8,
        precipitation: Math.random() * 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
      }))
    }
  });

  const [soilData, setSoilData] = useState<SoilData>({
    ph: 6.8,
    nitrogen: 45.2,
    phosphorus: 23.8,
    potassium: 187.5,
    organicMatter: 3.2,
    moisture: 28.7,
    temperature: 24.3,
    salinity: 0.45,
    cec: 18.5,
    bulkDensity: 1.35,
    porosity: 48.2,
    infiltrationRate: 2.8,
    micronutrients: {
      zinc: 1.2,
      iron: 4.8,
      manganese: 2.1,
      copper: 0.8,
      boron: 0.5,
      sulfur: 12.3
    }
  });

  const [cropHealth, setCropHealth] = useState<CropHealth>({
    ndvi: 0.78,
    lai: 4.2,
    chlorophyll: 48.5,
    waterStress: 0.23,
    diseaseRisk: 0.15,
    pestPressure: 0.08,
    growthStage: 'Flowering',
    yieldPrediction: 8.5,
    biomass: 12.8,
    canopyTemperature: 26.8
  });

  const [digitalFences, setDigitalFences] = useState<DigitalFence[]>([
    {
      id: 'fence-1',
      name: 'North Field - Rice',
      coordinates: [
        { lat: 28.7041, lng: 77.1025 },
        { lat: 28.7051, lng: 77.1035 },
        { lat: 28.7031, lng: 77.1045 },
        { lat: 28.7021, lng: 77.1015 }
      ],
      area: 2.5,
      cropType: 'Rice (Basmati)',
      plantingDate: '2024-06-15',
      expectedHarvest: '2024-10-20',
      alerts: [
        {
          type: 'weather',
          severity: 'medium',
          message: 'Heavy rainfall predicted in next 48 hours',
          timestamp: '2024-07-20T10:30:00Z'
        }
      ],
      sensors: [
        { id: 'sensor-1', type: 'weather', status: 'active', lastReading: '2024-07-20T12:00:00Z' },
        { id: 'sensor-2', type: 'soil', status: 'active', lastReading: '2024-07-20T12:00:00Z' }
      ]
    }
  ]);

  const [droneData, setDroneData] = useState<DroneData[]>([
    {
      flightId: 'flight-001',
      timestamp: '2024-07-20T08:00:00Z',
      coordinates: { lat: 28.7041, lng: 77.1025 },
      altitude: 50,
      battery: 85,
      images: [
        {
          id: 'img-001',
          timestamp: '2024-07-20T08:05:00Z',
          coordinates: { lat: 28.7041, lng: 77.1025 },
          type: 'multispectral',
          analysis: {
            cropHealth: 0.85,
            diseaseDetected: false,
            pestActivity: false,
            irrigationNeeded: false,
            maturityLevel: 0.65
          }
        }
      ],
      sensors: {
        temperature: 26.5,
        humidity: 68,
        co2: 420,
        lightIntensity: 850
      }
    }
  ]);

  const [disasterPredictions, setDisasterPredictions] = useState<DisasterPrediction[]>([
    {
      type: 'flood',
      probability: 0.25,
      expectedDate: '2024-07-25',
      severity: 'medium',
      affectedArea: 15.5,
      precautions: [
        'Prepare drainage channels',
        'Harvest early if possible',
        'Move equipment to higher ground'
      ],
      emergencyContacts: ['+91-1234567890', '+91-9876543210'],
      insuranceClaim: true
    }
  ]);

  // Real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setWeatherData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 5)
      }));

      setCropHealth(prev => ({
        ...prev,
        ndvi: Math.max(0.3, Math.min(0.9, prev.ndvi + (Math.random() - 0.5) * 0.05)),
        waterStress: Math.max(0, Math.min(1, prev.waterStress + (Math.random() - 0.5) * 0.1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Chart configurations
  const weatherChartData = {
    labels: weatherData.forecast.hourly.slice(0, 12).map(h => h.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.forecast.hourly.slice(0, 12).map(h => h.temp),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: weatherData.forecast.hourly.slice(0, 12).map(h => h.humidity),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const soilHealthData = {
    labels: ['N', 'P', 'K', 'pH', 'OM', 'Moisture'],
    datasets: [{
      label: 'Soil Parameters',
      data: [
        soilData.nitrogen / 100 * 100,
        soilData.phosphorus / 50 * 100,
        soilData.potassium / 200 * 100,
        soilData.ph / 8 * 100,
        soilData.organicMatter / 5 * 100,
        soilData.moisture
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(20, 184, 166, 0.8)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(168, 85, 247)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(20, 184, 166)'
      ],
      borderWidth: 2
    }]
  };

  const cropHealthRadarData = {
    labels: ['NDVI', 'LAI', 'Chlorophyll', 'Water Status', 'Disease Resistance', 'Growth Rate'],
    datasets: [{
      label: 'Crop Health Index',
      data: [
        cropHealth.ndvi * 100,
        (cropHealth.lai / 6) * 100,
        (cropHealth.chlorophyll / 60) * 100,
        (1 - cropHealth.waterStress) * 100,
        (1 - cropHealth.diseaseRisk) * 100,
        75 // Growth rate placeholder
      ],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgb(34, 197, 94)',
      pointBackgroundColor: 'rgb(34, 197, 94)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(34, 197, 94)'
    }]
  };

  const yieldPredictionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Predicted Yield (tons/ha)',
        data: [7.2, 7.5, 7.8, 8.1, 8.3, 8.5],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Historical Average',
        data: [6.8, 7.0, 7.2, 7.4, 7.6, 7.8],
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };

  // Utility functions
  const getHealthColor = (value: number): string => {
    if (value >= 0.8) return 'text-green-600';
    if (value >= 0.6) return 'text-yellow-600';
    if (value >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthIcon = (value: number) => {
    if (value >= 0.8) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (value >= 0.6) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <X className="w-5 h-5 text-red-600" />;
  };

  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toFixed(decimals);
  };

  // Component render
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CrispRoot</h1>
                  <p className="text-sm text-gray-600">Advanced Crop Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium text-green-700">
                  {isRealTime ? 'Live' : 'Offline'}
                </span>
              </div>
              
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`p-2 rounded-lg ${isRealTime ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'} hover:opacity-80 transition-all`}
              >
                {isRealTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'weather', label: 'Weather AI', icon: CloudRain },
              { id: 'soil', label: 'Soil Grid', icon: Layers },
              { id: 'crop-health', label: 'Crop Health', icon: Sprout },
              { id: 'drone', label: 'Drone Monitor', icon: Drone },
              { id: 'digital-fence', label: 'Digital Fencing', icon: Shield },
              { id: 'heatmap', label: 'Heat Maps', icon: Map },
              { id: 'disaster', label: 'Disaster Control', icon: AlertTriangle },
              { id: 'analytics', label: 'AI Analytics', icon: Brain },
              { id: 'marketplace', label: 'Market Intel', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Crop Health Score</p>
                    <p className="text-3xl font-bold text-green-600">{formatNumber(cropHealth.ndvi * 100, 0)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5% from last week</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Yield Prediction</p>
                    <p className="text-3xl font-bold text-blue-600">{formatNumber(cropHealth.yieldPrediction)} t/ha</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">+12% above average</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Water Efficiency</p>
                    <p className="text-3xl font-bold text-cyan-600">{formatNumber((1 - cropHealth.waterStress) * 100, 0)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 text-cyan-500 mr-1" />
                    <span className="text-sm text-cyan-600">-8% water usage</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Disease Risk</p>
                    <p className="text-3xl font-bold text-green-600">{formatNumber((1 - cropHealth.diseaseRisk) * 100, 0)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Low risk detected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weather Forecast */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
                  <CloudRain className="w-5 h-5 text-blue-500" />
                </div>
                <div className="h-64">
                  <Line 
                    data={weatherChartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        }
                      }
                    }} 
                  />
                </div>
              </div>

              {/* Crop Health Radar */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Crop Health Analysis</h3>
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <div className="h-64">
                  <Radar 
                    data={cropHealthRadarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          angleLines: {
                            display: false
                          },
                          suggestedMin: 0,
                          suggestedMax: 100
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Real-time Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Real-time Alerts & Recommendations</h3>
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Weather Alert</h4>
                    <p className="text-sm text-yellow-700">Heavy rainfall predicted in next 48 hours. Consider drainage preparation.</p>
                    <p className="text-xs text-yellow-600 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Irrigation Recommendation</h4>
                    <p className="text-sm text-blue-700">Soil moisture at 28%. Optimal irrigation window in 6 hours.</p>
                    <p className="text-xs text-blue-600 mt-1">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Growth Milestone</h4>
                    <p className="text-sm text-green-700">Crop has entered flowering stage. Yield prediction updated to 8.5 t/ha.</p>
                    <p className="text-xs text-green-600 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather AI Tab */}
        {activeTab === 'weather' && (
          <div className="space-y-8">
            {/* Current Weather */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Current Weather</h2>
                  <p className="text-blue-100 mt-2">Real-time conditions for your farm</p>
                </div>
                <CloudRain className="w-16 h-16 text-blue-200" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Thermometer className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(weatherData.temperature)}°C</p>
                  <p className="text-blue-100 text-sm">Temperature</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(weatherData.humidity)}%</p>
                  <p className="text-blue-100 text-sm">Humidity</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Wind className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(weatherData.windSpeed)} km/h</p>
                  <p className="text-blue-100 text-sm">Wind Speed</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(weatherData.precipitation)} mm</p>
                  <p className="text-blue-100 text-sm">Precipitation</p>
                </div>
              </div>
            </div>

            {/* Detailed Weather Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Conditions</h3>
                <div className="space-y-4">
                  {[
                    { label: 'UV Index', value: weatherData.uvIndex, unit: '', icon: Sun, color: 'yellow' },
                    { label: 'Visibility', value: weatherData.visibility, unit: 'km', icon: Eye, color: 'blue' },
                    { label: 'Cloud Cover', value: weatherData.cloudCover, unit: '%', icon: Cloud, color: 'gray' },
                    { label: 'Dew Point', value: weatherData.dewPoint, unit: '°C', icon: Droplets, color: 'cyan' },
                    { label: 'Pressure', value: weatherData.pressure, unit: 'hPa', icon: Gauge, color: 'purple' }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 text-${item.color}-500`} />
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatNumber(item.value)}{item.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Forecast</h3>
                <div className="space-y-3">
                  {weatherData.forecast.daily.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">{day.date}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{day.condition}</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatNumber(day.maxTemp)}° / {formatNumber(day.minTemp)}°
                          </div>
                          <div className="text-xs text-blue-600">
                            {formatNumber(day.precipitation)}mm
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Impact Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Weather Impact Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Favorable Conditions</h4>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Optimal temperature for flowering stage</li>
                    <li>• Adequate humidity levels</li>
                    <li>• Good wind circulation</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">Caution Areas</h4>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• High UV index - protect young plants</li>
                    <li>• Variable wind patterns</li>
                    <li>• Monitor for heat stress</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Recommendations</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Schedule irrigation for evening</li>
                    <li>• Apply mulch to retain moisture</li>
                    <li>• Monitor disease development</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Soil Grid Tab */}
        {activeTab === 'soil' && (
          <div className="space-y-8">
            {/* Soil Health Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Soil Health Analysis</h2>
                <Layers className="w-8 h-8 text-brown-500" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Nutrient Profile</h3>
                  <div className="h-64">
                    <Doughnut 
                      data={soilHealthData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right' as const,
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Parameters</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'pH Level', value: soilData.ph, optimal: '6.0-7.0', unit: '', status: soilData.ph >= 6.0 && soilData.ph <= 7.0 ? 'good' : 'warning' },
                      { label: 'Nitrogen', value: soilData.nitrogen, optimal: '40-60', unit: 'kg/ha', status: soilData.nitrogen >= 40 && soilData.nitrogen <= 60 ? 'good' : 'warning' },
                      { label: 'Phosphorus', value: soilData.phosphorus, optimal: '20-30', unit: 'kg/ha', status: soilData.phosphorus >= 20 && soilData.phosphorus <= 30 ? 'good' : 'warning' },
                      { label: 'Potassium', value: soilData.potassium, optimal: '150-200', unit: 'kg/ha', status: soilData.potassium >= 150 && soilData.potassium <= 200 ? 'good' : 'warning' },
                      { label: 'Organic Matter', value: soilData.organicMatter, optimal: '2.5-4.0', unit: '%', status: soilData.organicMatter >= 2.5 && soilData.organicMatter <= 4.0 ? 'good' : 'warning' }
                    ].map((param, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-700">{param.label}</span>
                          <p className="text-xs text-gray-500">Optimal: {param.optimal}{param.unit}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatNumber(param.value)}{param.unit}
                          </span>
                          {param.status === 'good' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Micronutrients */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Micronutrient Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(soilData.micronutrients).map(([nutrient, value]) => (
                  <div key={nutrient} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Beaker className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-700 capitalize">{nutrient}</h4>
                    <p className="text-lg font-bold text-gray-900">{formatNumber(value)}</p>
                    <p className="text-xs text-gray-500">ppm</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Soil Physical Properties */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Physical Properties</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Bulk Density', value: soilData.bulkDensity, unit: 'g/cm³', icon: Scale },
                    { label: 'Porosity', value: soilData.porosity, unit: '%', icon: Circle },
                    { label: 'Infiltration Rate', value: soilData.infiltrationRate, unit: 'cm/hr', icon: ArrowDown },
                    { label: 'Soil Temperature', value: soilData.temperature, unit: '°C', icon: Thermometer }
                  ].map((prop, index) => {
                    const Icon = prop.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-700">{prop.label}</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatNumber(prop.value)}{prop.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Soil Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Immediate Actions</h4>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Apply 2 tons/ha organic compost</li>
                      <li>• Supplement with 15 kg/ha phosphorus</li>
                      <li>• Monitor soil moisture levels</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Long-term Plan</h4>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Implement crop rotation with legumes</li>
                      <li>• Install drainage system</li>
                      <li>• Regular soil testing (quarterly)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Watch Points</h4>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Salinity levels approaching threshold</li>
                      <li>• Low zinc content needs attention</li>
                      <li>• Compact soil in field corners</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional tabs would continue here... */}
        {/* For brevity, I'll add placeholders for the remaining tabs */}
        
        {activeTab === 'crop-health' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <Sprout className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Crop Health Monitoring</h2>
              <p className="text-gray-600">Advanced NDVI analysis, disease detection, and growth tracking coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'drone' && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Drone Monitoring System</h3>
            <p className="text-gray-600">Advanced drone monitoring features coming soon...</p>
          </div>
        )}

        {activeTab === 'digital-fence' && <DigitalFencingSystem />}

        {activeTab === 'heatmap' && <HeatMapSystem />}

        {activeTab === 'disaster' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Disaster Prediction & Control</h2>
              <p className="text-gray-600">Early warning systems, risk assessment, and emergency protocols...</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <Brain className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analytics Engine</h2>
              <p className="text-gray-600">Machine learning insights, predictive modeling, and optimization algorithms...</p>
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Intelligence</h2>
              <p className="text-gray-600">Price predictions, demand forecasting, and supply chain optimization...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrispRootCropManagement;
