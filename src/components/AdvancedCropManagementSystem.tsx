"use client";

import React, { useState, useEffect, useRef } from 'react';
import Advanced3DVisualization from './Advanced3DVisualization';
import {
  Sprout, Droplets, Thermometer, Sun, Cloud, Wind, Zap, 
  BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Camera, MapPin, Settings, Filter, Search, Download,
  Activity, Battery, Gauge, Target, Eye, Layers, Globe,
  Calendar, Users, Database, RefreshCw, Play, Pause,
  ArrowUp, ArrowDown, Maximize, Minimize, RotateCcw
} from 'lucide-react';

// Advanced Types for Crop Management
interface CropField {
  id: string;
  name: string;
  cropType: string;
  area: number; // in acres
  plantingDate: string;
  expectedHarvest: string;
  currentStage: string;
  healthScore: number;
  soilMoisture: number;
  soilTemperature: number;
  soilPH: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  irrigationStatus: 'optimal' | 'low' | 'high' | 'critical';
  pestRisk: 'low' | 'medium' | 'high' | 'critical';
  diseaseRisk: 'low' | 'medium' | 'high' | 'critical';
  weatherImpact: 'positive' | 'neutral' | 'negative' | 'severe';
  yieldPrediction: number;
  coordinates: { lat: number; lng: number };
}

interface SensorReading {
  timestamp: number;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  co2Level: number;
  windSpeed: number;
}

interface IrrigationSystem {
  zoneId: string;
  status: 'active' | 'scheduled' | 'offline' | 'maintenance';
  waterFlow: number; // liters per minute
  pressure: number; // PSI
  schedule: Array<{
    time: string;
    duration: number;
    waterAmount: number;
  }>;
  efficiency: number;
  lastMaintenance: string;
}

interface WeatherForecast {
  date: string;
  temperature: { min: number; max: number };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  conditions: string;
  uvIndex: number;
}

const AdvancedCropManagementSystem: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'irrigation' | 'analytics' | 'planning' | '3d-view'>('overview');
  const [selectedField, setSelectedField] = useState<string>('field-1');
  const [realTimeData, setRealTimeData] = useState<SensorReading[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);
  const [irrigationSystems, setIrrigationSystems] = useState<IrrigationSystem[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [autoIrrigation, setAutoIrrigation] = useState<boolean>(true);
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Sample Crop Fields Data
  const cropFields: CropField[] = [
    {
      id: 'field-1',
      name: 'North Field Alpha',
      cropType: 'Corn (Hybrid)',
      area: 45.5,
      plantingDate: '2025-04-15',
      expectedHarvest: '2025-09-20',
      currentStage: 'Tasseling',
      healthScore: 94,
      soilMoisture: 78,
      soilTemperature: 26.5,
      soilPH: 6.8,
      nutrients: { nitrogen: 85, phosphorus: 72, potassium: 88 },
      irrigationStatus: 'optimal',
      pestRisk: 'low',
      diseaseRisk: 'low',
      weatherImpact: 'positive',
      yieldPrediction: 195,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'field-2',
      name: 'South Field Beta',
      cropType: 'Soybeans',
      area: 38.2,
      plantingDate: '2025-05-01',
      expectedHarvest: '2025-10-15',
      currentStage: 'Pod Filling',
      healthScore: 87,
      soilMoisture: 65,
      soilTemperature: 24.8,
      soilPH: 6.4,
      nutrients: { nitrogen: 72, phosphorus: 89, potassium: 76 },
      irrigationStatus: 'low',
      pestRisk: 'medium',
      diseaseRisk: 'low',
      weatherImpact: 'neutral',
      yieldPrediction: 162,
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 'field-3',
      name: 'East Field Gamma',
      cropType: 'Wheat (Winter)',
      area: 52.8,
      plantingDate: '2024-10-10',
      expectedHarvest: '2025-07-30',
      currentStage: 'Grain Filling',
      healthScore: 91,
      soilMoisture: 82,
      soilTemperature: 25.2,
      soilPH: 7.1,
      nutrients: { nitrogen: 88, phosphorus: 84, potassium: 91 },
      irrigationStatus: 'optimal',
      pestRisk: 'low',
      diseaseRisk: 'medium',
      weatherImpact: 'positive',
      yieldPrediction: 178,
      coordinates: { lat: 40.6892, lng: -74.0445 }
    }
  ];

  // Sample irrigation systems
  useEffect(() => {
    setIrrigationSystems([
      {
        zoneId: 'zone-1',
        status: 'active',
        waterFlow: 125.5,
        pressure: 35.2,
        schedule: [
          { time: '06:00', duration: 45, waterAmount: 2500 },
          { time: '18:00', duration: 35, waterAmount: 2000 }
        ],
        efficiency: 94.5,
        lastMaintenance: '2025-07-10'
      },
      {
        zoneId: 'zone-2',
        status: 'scheduled',
        waterFlow: 0,
        pressure: 38.1,
        schedule: [
          { time: '05:30', duration: 40, waterAmount: 2200 },
          { time: '19:00', duration: 30, waterAmount: 1800 }
        ],
        efficiency: 91.2,
        lastMaintenance: '2025-07-08'
      },
      {
        zoneId: 'zone-3',
        status: 'offline',
        waterFlow: 0,
        pressure: 0,
        schedule: [],
        efficiency: 0,
        lastMaintenance: '2025-07-05'
      }
    ]);
  }, []);

  // Real-time sensor data simulation
  useEffect(() => {
    const generateSensorData = () => {
      const newReading: SensorReading = {
        timestamp: Date.now(),
        temperature: 25 + Math.sin(Date.now() / 10000) * 5,
        humidity: 65 + Math.sin(Date.now() / 8000) * 15,
        soilMoisture: 75 + Math.sin(Date.now() / 12000) * 10,
        lightIntensity: 850 + Math.sin(Date.now() / 6000) * 200,
        co2Level: 410 + Math.sin(Date.now() / 15000) * 30,
        windSpeed: 8 + Math.sin(Date.now() / 9000) * 4
      };
      
      setRealTimeData(prev => [...prev.slice(-50), newReading]);
    };

    generateSensorData();
    const interval = setInterval(generateSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Weather forecast simulation
  useEffect(() => {
    const forecast: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      temperature: {
        min: 18 + Math.random() * 5,
        max: 28 + Math.random() * 8
      },
      humidity: 50 + Math.random() * 30,
      precipitation: Math.random() * 10,
      windSpeed: 5 + Math.random() * 10,
      conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      uvIndex: Math.floor(Math.random() * 10) + 1
    }));
    setWeatherForecast(forecast);
  }, []);

  // Real-time chart rendering
  useEffect(() => {
    if (chartRef.current && realTimeData.length > 0) {
      const canvas = chartRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const y = (height / 10) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw temperature line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      realTimeData.slice(-20).forEach((reading, index) => {
        const x = (width / 19) * index;
        const y = height - (reading.temperature / 40) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw humidity line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      realTimeData.slice(-20).forEach((reading, index) => {
        const x = (width / 19) * index;
        const y = height - (reading.humidity / 100) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw soil moisture line
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      realTimeData.slice(-20).forEach((reading, index) => {
        const x = (width / 19) * index;
        const y = height - (reading.soilMoisture / 100) * height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [realTimeData]);

  const currentField = cropFields.find(f => f.id === selectedField);
  const latestSensorData = realTimeData[realTimeData.length - 1];

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header with Real-time Status */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Advanced Crop Management System</h1>
              <p className="text-green-100">AI-powered precision agriculture with real-time monitoring & automation</p>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold">{cropFields.length}</div>
                <div className="text-xs text-green-100">Active Fields</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold">
                  {cropFields.reduce((acc, field) => acc + field.area, 0).toFixed(1)}
                </div>
                <div className="text-xs text-green-100">Total Acres</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold">
                  {cropFields.reduce((acc, field) => acc + field.healthScore, 0) / cropFields.length | 0}%
                </div>
                <div className="text-xs text-green-100">Avg Health</div>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="text-2xl font-bold">
                  {latestSensorData?.temperature?.toFixed(1) || 0}°C
                </div>
                <div className="text-xs text-green-100">Temperature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Field Overview', icon: Sprout },
              { id: 'monitoring', label: 'Real-time Monitoring', icon: Activity },
              { id: 'irrigation', label: 'Smart Irrigation', icon: Droplets },
              { id: '3d-view', label: '3D Field View', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
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

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Field Selection & Status */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-green-600" />
                  Field Management Dashboard
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cropFields.map((field) => (
                    <div
                      key={field.id}
                      onClick={() => setSelectedField(field.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedField === field.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{field.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(field.healthScore)}`}>
                          {field.healthScore}%
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Crop:</span>
                          <span className="font-medium">{field.cropType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Area:</span>
                          <span className="font-medium">{field.area} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stage:</span>
                          <span className="font-medium">{field.currentStage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Soil Moisture:</span>
                          <span className={`font-medium ${
                            field.soilMoisture > 70 ? 'text-green-600' :
                            field.soilMoisture > 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {field.soilMoisture}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yield Prediction:</span>
                          <span className="font-medium text-blue-600">{field.yieldPrediction} bu/acre</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Field Information */}
              {currentField && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">{currentField.name} - Detailed Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Thermometer className="w-6 h-6 text-blue-600" />
                        <span className="text-sm text-gray-600">Soil Temp</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{currentField.soilTemperature}°C</div>
                      <div className="text-xs text-gray-500">Optimal range: 20-30°C</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Droplets className="w-6 h-6 text-green-600" />
                        <span className="text-sm text-gray-600">Soil pH</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{currentField.soilPH}</div>
                      <div className="text-xs text-gray-500">Optimal range: 6.0-7.0</div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="w-6 h-6 text-purple-600" />
                        <span className="text-sm text-gray-600">Nitrogen</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{currentField.nutrients.nitrogen}%</div>
                      <div className="text-xs text-gray-500">NPK Balance</div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                        <span className="text-sm text-gray-600">Yield Pred.</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{currentField.yieldPrediction}</div>
                      <div className="text-xs text-gray-500">bu/acre</div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Risk Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="font-medium">Pest Risk:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(currentField.pestRisk)}`}>
                          {currentField.pestRisk.charAt(0).toUpperCase() + currentField.pestRisk.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="font-medium">Disease Risk:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(currentField.diseaseRisk)}`}>
                          {currentField.diseaseRisk.charAt(0).toUpperCase() + currentField.diseaseRisk.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="font-medium">Weather Impact:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          currentField.weatherImpact === 'positive' ? 'text-green-600 bg-green-100' :
                          currentField.weatherImpact === 'neutral' ? 'text-blue-600 bg-blue-100' :
                          currentField.weatherImpact === 'negative' ? 'text-yellow-600 bg-yellow-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {currentField.weatherImpact.charAt(0).toUpperCase() + currentField.weatherImpact.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Weather & Alerts Sidebar */}
            <div className="space-y-6">
              {/* Weather Forecast */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Sun className="w-6 h-6 mr-2 text-yellow-600" />
                  7-Day Weather Forecast
                </h3>
                <div className="space-y-3">
                  {weatherForecast.slice(0, 5).map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium">
                          {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs text-gray-600">{day.conditions}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {day.temperature.max.toFixed(0)}°/{day.temperature.min.toFixed(0)}°
                        </div>
                        <div className="text-xs text-blue-600">{day.precipitation.toFixed(1)}mm</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                  System Alerts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Low Soil Moisture</div>
                      <div className="text-sm text-yellow-700">South Field Beta requires irrigation within 24 hours</div>
                      <div className="text-xs text-yellow-600 mt-1">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800">Irrigation Completed</div>
                      <div className="text-sm text-blue-700">North Field Alpha irrigation cycle finished successfully</div>
                      <div className="text-xs text-blue-600 mt-1">4 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">Optimal Growth Conditions</div>
                      <div className="text-sm text-green-700">East Field Gamma showing excellent health metrics</div>
                      <div className="text-xs text-green-600 mt-1">6 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Sensor Data */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-600" />
                Real-time Environmental Data
              </h3>
              
              {latestSensorData && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <Thermometer className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{latestSensorData.temperature.toFixed(1)}°C</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{latestSensorData.humidity.toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{latestSensorData.soilMoisture.toFixed(0)}%</div>
                    <div className="text-sm text-gray-600">Soil Moisture</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">{latestSensorData.lightIntensity.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Light (lux)</div>
                  </div>
                </div>
              )}

              {/* Real-time Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Live Sensor Trends</h4>
                <canvas
                  ref={chartRef}
                  width={500}
                  height={200}
                  className="w-full"
                />
                <div className="flex justify-center space-x-6 mt-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Temperature</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Humidity</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Soil Moisture</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Monitoring */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-purple-600" />
                Advanced Field Monitoring
              </h3>
              
              {/* Satellite/Drone View Simulation */}
              <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-lg h-64 relative overflow-hidden mb-4">
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 400 250">
                    {/* Field boundaries */}
                    <rect x="20" y="20" width="360" height="210" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
                    
                    {/* Field sections */}
                    {cropFields.map((field, index) => (
                      <g key={field.id}>
                        <rect
                          x={20 + index * 120}
                          y={20}
                          width={110}
                          height={210}
                          fill={`rgba(${field.healthScore > 90 ? '34, 197, 94' : field.healthScore > 75 ? '234, 179, 8' : '239, 68, 68'}, 0.3)`}
                          stroke="white"
                          strokeWidth="1"
                        />
                        <text
                          x={75 + index * 120}
                          y={130}
                          fill="white"
                          fontSize="12"
                          textAnchor="middle"
                          className="font-medium"
                        >
                          {field.name}
                        </text>
                        <text
                          x={75 + index * 120}
                          y={145}
                          fill="white"
                          fontSize="10"
                          textAnchor="middle"
                        >
                          {field.healthScore}% Health
                        </text>
                      </g>
                    ))}
                    
                    {/* Animated sensors */}
                    {Array.from({length: 6}).map((_, i) => (
                      <circle
                        key={i}
                        cx={60 + i * 60}
                        cy={80 + Math.sin(Date.now() / 1000 + i) * 10}
                        r="3"
                        fill="yellow"
                        className="animate-pulse"
                      />
                    ))}
                  </svg>
                </div>
                
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
                  <div className="font-medium">Live Field View</div>
                  <div className="text-xs opacity-80">Updated: {new Date().toLocaleTimeString()}</div>
                </div>
                
                <div className="absolute top-4 right-4 space-y-2">
                  <button className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                    <Layers className="w-5 h-5" />
                  </button>
                  <button className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Monitoring Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">Real-time Alerts</span>
                  <button
                    onClick={() => setAlertsEnabled(!alertsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      alertsEnabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="font-medium">Auto Irrigation</span>
                  <button
                    onClick={() => setAutoIrrigation(!autoIrrigation)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoIrrigation ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoIrrigation ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'irrigation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Irrigation Control Panel */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Droplets className="w-6 h-6 mr-2 text-blue-600" />
                Smart Irrigation Control
              </h3>
              
              <div className="space-y-4">
                {irrigationSystems.map((system) => (
                  <div key={system.zoneId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Zone {system.zoneId.split('-')[1].toUpperCase()}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        system.status === 'active' ? 'bg-green-100 text-green-800' :
                        system.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        system.status === 'offline' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Water Flow:</span>
                        <div className="font-semibold text-blue-600">{system.waterFlow} L/min</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Pressure:</span>
                        <div className="font-semibold">{system.pressure} PSI</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Efficiency:</span>
                        <div className="font-semibold text-green-600">{system.efficiency}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Maintenance:</span>
                        <div className="font-semibold">{system.lastMaintenance}</div>
                      </div>
                    </div>

                    {system.schedule.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">Today's Schedule:</div>
                        <div className="space-y-1">
                          {system.schedule.map((schedule, index) => (
                            <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                              <span>{schedule.time}</span>
                              <span>{schedule.duration}min ({schedule.waterAmount}L)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        {system.status === 'active' ? 'Stop' : 'Start'}
                      </button>
                      <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Usage Analytics */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
                Water Usage Analytics
              </h3>
              
              {/* Water Usage Chart Simulation */}
              <div className="bg-gray-50 p-4 rounded-lg h-64 mb-4">
                <div className="h-full flex items-end justify-between space-x-2">
                  {Array.from({length: 7}).map((_, i) => {
                    const height = 40 + Math.random() * 60;
                    return (
                      <div key={i} className="flex flex-col items-center space-y-2">
                        <div
                          className="bg-blue-500 rounded-t"
                          style={{
                            height: `${height}%`,
                            width: '30px'
                          }}
                        ></div>
                        <div className="text-xs text-gray-600 transform -rotate-45">
                          {new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Water Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-sm text-gray-600">Liters Today</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">18,456</div>
                  <div className="text-sm text-gray-600">Weekly Total</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">$234</div>
                  <div className="text-sm text-gray-600">Cost Savings</div>
                </div>
              </div>

              {/* Irrigation Recommendations */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">AI Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-800">Optimize Zone 2 Schedule</div>
                      <div className="text-blue-700">Reduce morning session by 10 minutes based on soil moisture levels</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800">Weather Integration</div>
                      <div className="text-green-700">Rain expected tomorrow - auto-skip scheduled irrigation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2>AI Analytics Placeholder</h2>
            <p>This section will display AI-driven insights and analysis of crop health, yield predictions, and other relevant data.</p>
          </div>
        )}
        {activeTab === 'planning' && (
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2>Crop Planning Placeholder</h2>
            <p>This section will allow users to plan their planting schedules, manage resources, and optimize crop yields based on AI predictions and historical data.</p>
          </div>
        )}
        {activeTab === '3d-view' && (
          <div className="space-y-6">
            <Advanced3DVisualization />
            
            {/* 3D Field Analysis Panel */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Layers className="w-6 h-6 mr-2 text-indigo-600" />
                3D Field Analysis Center
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Field Health Mapping */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Field Health Mapping</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Crop Health View
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Soil Moisture Map
                    </button>
                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                      Temperature Zones
                    </button>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                      Growth Analysis
                    </button>
                  </div>
                </div>

                {/* Visualization Controls */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">View Controls</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Height Scale:</span>
                      <input type="range" min="0.5" max="3" step="0.1" className="flex-1" />
                      <span className="text-sm">2x</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Opacity:</span>
                      <input type="range" min="0.1" max="1" step="0.1" className="flex-1" />
                      <span className="text-sm">70%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Grid Size:</span>
                      <input type="range" min="10" max="50" className="flex-1" />
                      <span className="text-sm">20x20</span>
                    </div>
                  </div>
                </div>

                {/* Analysis Tools */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Analysis Tools</h4>
                  <div className="space-y-2">
                    <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                      Generate Report
                    </button>
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                      Compare Timeframes
                    </button>
                    <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                      Predictive Model
                    </button>
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Average Health</p>
                    <p className="text-2xl font-bold">87.3%</p>
                  </div>
                  <Sprout className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Soil Moisture</p>
                    <p className="text-2xl font-bold">64.2%</p>
                  </div>
                  <Droplets className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Avg Temperature</p>
                    <p className="text-2xl font-bold">24.7°C</p>
                  </div>
                  <Thermometer className="w-8 h-8 text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Growth Rate</p>
                    <p className="text-2xl font-bold">+12.4%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedCropManagementSystem;
