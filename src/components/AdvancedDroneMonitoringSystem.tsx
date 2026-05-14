"use client";

import React, { useState, useEffect, useRef } from 'react';
import Advanced3DVisualization from './Advanced3DVisualization';
import DroneModel3D from './DroneModel3D';
import AdvancedLiveDronePOV from './AdvancedLiveDronePOV';
import {
  Drone, Camera, Battery, Signal, MapPin, Play, Pause, Square, Navigation,
  Crosshair, Eye, Thermometer, Activity, Settings, Layers, Map, Satellite,
  Target, Clock, TrendingUp, Wifi, WifiOff, RefreshCw, Plus, Download,
  Sun, Wind, Compass, Shield, Zap, Database, Globe, Mountain, TreePine,
  Droplets, Search, Filter, BarChart3, AlertTriangle, CheckCircle,
  Radio, Gauge, Calendar, Users, FileText, Maximize, Minimize,
  RotateCcw, ZoomIn, ZoomOut, Move, Volume2, VolumeX, Mic, MicOff, Mouse
} from 'lucide-react';

// Advanced Types
interface DroneData {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'idle' | 'charging' | 'maintenance' | 'emergency';
  battery: number;
  signal: number;
  altitude: number;
  speed: number;
  temperature: number;
  humidity: number;
  coordinates: { lat: number; lng: number };
  flightTime: number;
  totalFlightHours: number;
  lastMaintenance: string;
  cameraStatus: 'recording' | 'streaming' | 'offline';
  gimbalPosition: { pitch: number; roll: number; yaw: number };
  sensors: {
    gps: boolean;
    compass: boolean;
    barometer: boolean;
    accelerometer: boolean;
    gyroscope: boolean;
    thermalCamera: boolean;
    multispectral: boolean;
  };
}

interface FlightPath {
  id: string;
  name: string;
  waypoints: Array<{ lat: number; lng: number; altitude: number; action: string }>;
  estimatedTime: number;
  distance: number;
  status: 'planned' | 'active' | 'completed' | 'paused';
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  conditions: string;
  uvIndex: number;
  precipitation: number;
}

interface CropAnalytics {
  fieldId: string;
  cropType: string;
  healthScore: number;
  growthStage: string;
  stressIndicators: string[];
  irrigationNeeded: boolean;
  pestActivity: boolean;
  weedDensity: number;
  yieldPrediction: number;
  lastInspection: string;
}

const AdvancedDroneMonitoringSystem: React.FC = () => {
  // State Management
  const [selectedDrone, setSelectedDrone] = useState<string>('drone-1');
  const [viewMode, setViewMode] = useState<'dashboard' | '3d-view' | 'analytics' | 'mission' | 'live-feed'>('dashboard');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain' | 'hybrid' | '3d'>('3d');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cropAnalytics, setCropAnalytics] = useState<CropAnalytics[]>([]);
  const [flightPaths, setFlightPaths] = useState<FlightPath[]>([]);
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample Drone Data
  const dronesData: DroneData[] = [
    {
      id: 'drone-1',
      name: 'AgriScout Pro X1',
      model: 'DJI Matrice 350 RTK',
      status: 'active',
      battery: 87,
      signal: 95,
      altitude: 120,
      speed: 15.5,
      temperature: 24,
      humidity: 65,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      flightTime: 1847,
      totalFlightHours: 245.5,
      lastMaintenance: '2025-07-15',
      cameraStatus: 'streaming',
      gimbalPosition: { pitch: -15, roll: 2, yaw: 45 },
      sensors: {
        gps: true,
        compass: true,
        barometer: true,
        accelerometer: true,
        gyroscope: true,
        thermalCamera: true,
        multispectral: true
      }
    },
    {
      id: 'drone-2',
      name: 'CropGuardian Elite',
      model: 'Yuneec H520E',
      status: 'idle',
      battery: 92,
      signal: 88,
      altitude: 0,
      speed: 0,
      temperature: 22,
      humidity: 58,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      flightTime: 0,
      totalFlightHours: 189.2,
      lastMaintenance: '2025-07-10',
      cameraStatus: 'offline',
      gimbalPosition: { pitch: 0, roll: 0, yaw: 0 },
      sensors: {
        gps: true,
        compass: true,
        barometer: true,
        accelerometer: true,
        gyroscope: true,
        thermalCamera: false,
        multispectral: true
      }
    },
    {
      id: 'drone-3',
      name: 'FieldMapper Pro',
      model: 'Parrot Anafi Ag',
      status: 'charging',
      battery: 45,
      signal: 0,
      altitude: 0,
      speed: 0,
      temperature: 25,
      humidity: 72,
      coordinates: { lat: 40.6892, lng: -74.0445 },
      flightTime: 0,
      totalFlightHours: 156.8,
      lastMaintenance: '2025-07-18',
      cameraStatus: 'offline',
      gimbalPosition: { pitch: 0, roll: 0, yaw: 0 },
      sensors: {
        gps: true,
        compass: true,
        barometer: true,
        accelerometer: true,
        gyroscope: true,
        thermalCamera: true,
        multispectral: false
      }
    }
  ];

  // Weather simulation
  useEffect(() => {
    const updateWeather = () => {
      setWeatherData({
        temperature: 24 + Math.sin(Date.now() / 10000) * 3,
        humidity: 65 + Math.sin(Date.now() / 8000) * 10,
        windSpeed: 8 + Math.sin(Date.now() / 12000) * 4,
        windDirection: 180 + Math.sin(Date.now() / 15000) * 60,
        pressure: 1013 + Math.sin(Date.now() / 20000) * 5,
        visibility: 10,
        conditions: 'Partly Cloudy',
        uvIndex: 6,
        precipitation: 0
      });
    };
    updateWeather();
    const interval = setInterval(updateWeather, 2000);
    return () => clearInterval(interval);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    const updateRealTimeData = () => {
      setRealTimeData({
        timestamp: Date.now(),
        activeFlights: Math.floor(Math.random() * 3) + 1,
        dataPointsCollected: Math.floor(Math.random() * 100) + 2450,
        areasCovered: Math.floor(Math.random() * 50) + 125,
        alertsToday: Math.floor(Math.random() * 5),
        batteryEfficiency: 94 + Math.sin(Date.now() / 10000) * 6,
        signalStrength: 88 + Math.sin(Date.now() / 8000) * 10
      });
    };
    updateRealTimeData();
    const interval = setInterval(updateRealTimeData, 1500);
    return () => clearInterval(interval);
  }, []);

  // Crop analytics simulation
  useEffect(() => {
    setCropAnalytics([
      {
        fieldId: 'field-1',
        cropType: 'Corn',
        healthScore: 92,
        growthStage: 'Flowering',
        stressIndicators: ['Low Nitrogen'],
        irrigationNeeded: false,
        pestActivity: false,
        weedDensity: 12,
        yieldPrediction: 185,
        lastInspection: '2025-07-20T08:30:00Z'
      },
      {
        fieldId: 'field-2',
        cropType: 'Soybeans',
        healthScore: 88,
        growthStage: 'Pod Development',
        stressIndicators: ['Water Stress', 'High Temperature'],
        irrigationNeeded: true,
        pestActivity: true,
        weedDensity: 8,
        yieldPrediction: 156,
        lastInspection: '2025-07-20T09:15:00Z'
      },
      {
        fieldId: 'field-3',
        cropType: 'Wheat',
        healthScore: 95,
        growthStage: 'Grain Filling',
        stressIndicators: [],
        irrigationNeeded: false,
        pestActivity: false,
        weedDensity: 3,
        yieldPrediction: 198,
        lastInspection: '2025-07-20T07:45:00Z'
      }
    ]);
  }, []);

  // Live video feed simulation
  useEffect(() => {
    if (isLiveStreaming && videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const drawFrame = () => {
        if (!ctx) return;
        
        // Simulate live drone feed with animated background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${Date.now() / 50 % 360}, 60%, 30%)`);
        gradient.addColorStop(1, `hsl(${(Date.now() / 50 + 180) % 360}, 60%, 20%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add simulated field patterns
        ctx.strokeStyle = 'rgba(100, 255, 100, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * canvas.height / 10);
          ctx.lineTo(canvas.width, i * canvas.height / 10);
          ctx.stroke();
        }
        
        // Add crosshair
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 - 20, canvas.height/2);
        ctx.lineTo(canvas.width/2 + 20, canvas.height/2);
        ctx.moveTo(canvas.width/2, canvas.height/2 - 20);
        ctx.lineTo(canvas.width/2, canvas.height/2 + 20);
        ctx.stroke();
        
        requestAnimationFrame(drawFrame);
      };
      
      drawFrame();
    }
  }, [isLiveStreaming]);

  const currentDrone = dronesData.find(d => d.id === selectedDrone);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-blue-600 bg-blue-100';
      case 'charging': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      case 'emergency': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFlightTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header with Real-time Stats */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Advanced Drone Command Center</h1>
              <p className="text-white text-base font-medium">Real-time aerial surveillance, precision agriculture & autonomous operations</p>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">{realTimeData.activeFlights || 0}</div>
                <div className="text-sm text-white font-medium">Active Flights</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">{realTimeData.dataPointsCollected || 0}</div>
                <div className="text-sm text-white font-medium">Data Points</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">{realTimeData.areasCovered || 0}</div>
                <div className="text-sm text-white font-medium">Acres Covered</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold text-white">{weatherData?.temperature?.toFixed(1) || 0}°C</div>
                <div className="text-sm text-white font-medium">Temperature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Mission Control', icon: Activity },
              { id: '3d-view', label: '3D Visualization', icon: Globe },
              { id: 'live-feed', label: 'Live Feeds', icon: Camera },
              { id: 'analytics', label: 'AI Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    viewMode === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Drone Fleet Status */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Drone className="w-6 h-6 mr-2 text-blue-600" />
                  Active Drone Fleet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dronesData.map((drone) => (
                    <div
                      key={drone.id}
                      onClick={() => setSelectedDrone(drone.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDrone === drone.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{drone.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drone.status)}`}>
                          {drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Battery:</span>
                          <span className={`font-medium ${
                            drone.battery > 60 ? 'text-green-600' : 
                            drone.battery > 30 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {drone.battery}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signal:</span>
                          <span className="font-medium text-blue-600">{drone.signal}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Altitude:</span>
                          <span className="font-medium">{drone.altitude}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flight Time:</span>
                          <span className="font-medium">{formatFlightTime(drone.flightTime)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time 3D Drone Visualization */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-green-600" />
                  3D Field Visualization
                </h3>
                <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg h-80 relative overflow-hidden">
                  {/* 3D Scene Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full relative">
                      {/* Animated 3D Field Grid */}
                      <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 400 300">
                          {/* Grid lines */}
                          {Array.from({length: 20}).map((_, i) => (
                            <g key={i}>
                              <line
                                x1={i * 20}
                                y1="0"
                                x2={i * 20}
                                y2="300"
                                stroke="white"
                                strokeWidth="0.5"
                                opacity="0.5"
                              />
                              <line
                                x1="0"
                                y1={i * 15}
                                x2="400"
                                y2={i * 15}
                                stroke="white"
                                strokeWidth="0.5"
                                opacity="0.5"
                              />
                            </g>
                          ))}
                          {/* Animated drone positions */}
                          {dronesData.filter(d => d.status === 'active').map((drone, index) => (
                            <g key={drone.id}>
                              <circle
                                cx={150 + index * 100 + Math.sin(Date.now() / 1000 + index) * 30}
                                cy={150 + Math.cos(Date.now() / 1200 + index) * 40}
                                r="4"
                                fill="yellow"
                                className="animate-pulse"
                              />
                              <text
                                x={150 + index * 100 + Math.sin(Date.now() / 1000 + index) * 30}
                                y={140 + Math.cos(Date.now() / 1200 + index) * 40}
                                fill="white"
                                fontSize="10"
                                textAnchor="middle"
                              >
                                {drone.name.split(' ')[0]}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                      
                      {/* 3D Controls */}
                      <div className="absolute top-4 right-4 space-y-2">
                        <button className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                          <RotateCcw className="w-5 h-5" />
                        </button>
                        <button className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                          <ZoomIn className="w-5 h-5" />
                        </button>
                        <button className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                          <ZoomOut className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Status overlay */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-lg font-bold text-white">3D Field Map</div>
                        <div className="text-sm text-white">Real-time drone positions & flight paths</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar with Weather & Analytics */}
            <div className="space-y-6">
              {/* Weather Station */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Sun className="w-6 h-6 mr-2 text-yellow-600" />
                  Weather Station
                </h3>
                {weatherData && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Temperature</span>
                      <span className="font-bold text-lg">{weatherData.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Humidity</span>
                      <span className="font-semibold">{weatherData.humidity.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Wind Speed</span>
                      <span className="font-semibold">{weatherData.windSpeed.toFixed(1)} mph</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pressure</span>
                      <span className="font-semibold">{weatherData.pressure.toFixed(0)} hPa</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Visibility</span>
                      <span className="font-semibold">{weatherData.visibility} km</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-800 font-medium">{weatherData.conditions}</div>
                      <div className="text-xs text-blue-600">Optimal for drone operations</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Crop Health Analytics */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <TreePine className="w-6 h-6 mr-2 text-green-600" />
                  Crop Analytics
                </h3>
                <div className="space-y-4">
                  {cropAnalytics.slice(0, 2).map((crop) => (
                    <div key={crop.fieldId} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{crop.fieldId.toUpperCase()}</span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {crop.cropType}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Health Score:</span>
                          <span className={`font-medium ${
                            crop.healthScore > 90 ? 'text-green-600' :
                            crop.healthScore > 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {crop.healthScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Growth Stage:</span>
                          <span className="font-medium">{crop.growthStage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yield Prediction:</span>
                          <span className="font-medium text-blue-600">{crop.yieldPrediction} bu/acre</span>
                        </div>
                        {crop.irrigationNeeded && (
                          <div className="flex items-center space-x-1 text-orange-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs">Irrigation needed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'live-feed' && (
          <div className="space-y-6">
            <AdvancedLiveDronePOV />
            
            {/* Additional Drone Feeds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thermal Camera Feed */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
                  Thermal Imaging
                </h3>
                <div className="bg-gradient-to-br from-purple-900 via-red-600 to-yellow-400 rounded-lg h-48 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-lg font-bold">Thermal Feed</div>
                      <div className="text-sm text-white">Heat signatures & stress detection</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {currentDrone?.sensors.thermalCamera ? 'ACTIVE' : 'OFFLINE'}
                  </div>
                </div>
              </div>

              {/* Multispectral Analysis */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-purple-600" />
                  Multispectral Analysis
                </h3>
                <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-lg h-48 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-lg font-bold">NDVI Mapping</div>
                      <div className="text-sm text-white">Vegetation health analysis</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {currentDrone?.sensors.multispectral ? 'ANALYZING' : 'OFFLINE'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === '3d-view' && (
          <div className="space-y-6">
            <Advanced3DVisualization />
            <DroneModel3D />
            
            {/* 3D Control Panel */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-black">
                <Mountain className="w-6 h-6 mr-2 text-purple-600" />
                3D Flight Control Center
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Drone Controls */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Drone Controls</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Auto-Flight Mode
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Manual Control
                    </button>
                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                      Return to Base
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                      Emergency Land
                    </button>
                  </div>
                </div>

                {/* Camera Controls */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Camera & Gimbal</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Tilt:</span>
                      <input type="range" min="-90" max="45" className="flex-1" />
                      <span className="text-sm">-15°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Pan:</span>
                      <input type="range" min="-180" max="180" className="flex-1" />
                      <span className="text-sm">0°</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Zoom:</span>
                      <input type="range" min="1" max="30" className="flex-1" />
                      <span className="text-sm">5x</span>
                    </div>
                  </div>
                </div>

                {/* Mission Planning */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Mission Planning</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                      Set Waypoints
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                      Survey Pattern
                    </button>
                    <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                      Perimeter Scan
                    </button>
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                      Save Mission
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI-Powered Crop Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-black">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                AI Crop Health Analysis
              </h3>
              <div className="space-y-4">
                {cropAnalytics.map((crop) => (
                  <div key={crop.fieldId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-black">{crop.fieldId.toUpperCase()} - {crop.cropType}</h4>
                        <p className="text-sm text-black">{crop.growthStage}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          crop.healthScore > 90 ? 'text-green-600' :
                          crop.healthScore > 75 ? 'text-yellow-600' : 'text-red-600'
                        }` + ' text-black'}>
                          {crop.healthScore}%
                        </div>
                        <div className="text-xs text-black">Health Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-black">Yield Prediction:</span>
                        <div className="font-semibold text-black">{crop.yieldPrediction} bu/acre</div>
                      </div>
                      <div>
                        <span className="text-black">Weed Density:</span>
                        <div className="font-semibold text-black">{crop.weedDensity}%</div>
                      </div>
                    </div>

                    {crop.stressIndicators.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-black mb-1">Stress Indicators:</div>
                        <div className="flex flex-wrap gap-1">
                          {crop.stressIndicators.map((indicator, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-100 text-black text-xs rounded-full"
                            >
                              {indicator}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex space-x-4 text-sm">
                      {crop.irrigationNeeded && (
                        <div className="flex items-center text-black">
                          <Droplets className="w-4 h-4 mr-1" />
                          <span>Irrigation Needed</span>
                        </div>
                      )}
                      {crop.pestActivity && (
                        <div className="flex items-center text-black">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span>Pest Activity</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Performance Metrics */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center text-black">
                <Activity className="w-6 h-6 mr-2 text-green-600" />
                Performance Metrics
              </h3>
              <div className="space-y-6">
                {/* Flight Efficiency Chart */}
                <div>
                  <h4 className="font-semibold mb-3 text-black">Flight Efficiency</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2 text-black">
                      <span>Battery Efficiency</span>
                      <span className="font-medium">{realTimeData.batteryEfficiency?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${realTimeData.batteryEfficiency || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Signal Strength */}
                <div>
                  <h4 className="font-semibold mb-3 text-black">Signal Strength</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2 text-black">
                      <span>Average Signal</span>
                      <span className="font-medium">{realTimeData.signalStrength?.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${realTimeData.signalStrength || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Today's Statistics */}
                <div>
                  <h4 className="font-semibold mb-3 text-black">Today's Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black">{realTimeData.dataPointsCollected}</div>
                      <div className="text-xs text-black">Data Points</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black">{realTimeData.areasCovered}</div>
                      <div className="text-xs text-black">Acres Covered</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black">
                        {dronesData.reduce((acc, drone) => acc + drone.flightTime, 0) / 3600 | 0}h
                      </div>
                      <div className="text-xs text-black">Flight Time</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-black">{realTimeData.alertsToday}</div>
                      <div className="text-xs text-black">Alerts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Alerts */}
        {emergencyAlerts.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <div>
                <strong className="font-bold">Emergency Alert!</strong>
                <span className="block sm:inline"> {emergencyAlerts[0]?.message}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedDroneMonitoringSystem;
