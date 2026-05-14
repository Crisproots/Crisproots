"use client";

import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Thermometer, 
  Droplets, 
  Eye, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Play,
  Pause,
  Layers,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Target,
  Zap,
  Leaf,
  Bug,
  Sprout,
  Sun,
  Cloud,
  Wind,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface HeatMapData {
  lat: number;
  lng: number;
  value: number;
  intensity: number;
  metadata: {
    soilMoisture: number;
    temperature: number;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
    cropHealth: number;
    diseaseRisk: number;
    pestActivity: number;
    weedDensity: number;
  };
}

interface HeatMapLayer {
  id: string;
  name: string;
  type: 'soil_moisture' | 'temperature' | 'ph' | 'nutrients' | 'crop_health' | 'disease_risk' | 'pest_activity' | 'irrigation_zones' | 'yield_potential';
  color: string;
  unit: string;
  min: number;
  max: number;
  visible: boolean;
  opacity: number;
}

interface ZoneAnalysis {
  zone: string;
  area: number;
  avgValue: number;
  minValue: number;
  maxValue: number;
  stdDev: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  recommendations: string[];
}

const HeatMapSystem: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('soil_moisture');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [viewMode, setViewMode] = useState<'heatmap' | 'zones' | 'analysis' | 'trends'>('heatmap');

  const [layers, setLayers] = useState<HeatMapLayer[]>([
    {
      id: 'soil_moisture',
      name: 'Soil Moisture',
      type: 'soil_moisture',
      color: '#3B82F6',
      unit: '%',
      min: 0,
      max: 100,
      visible: true,
      opacity: 0.7
    },
    {
      id: 'temperature',
      name: 'Soil Temperature',
      type: 'temperature',
      color: '#EF4444',
      unit: '°C',
      min: 15,
      max: 35,
      visible: false,
      opacity: 0.7
    },
    {
      id: 'ph_level',
      name: 'pH Level',
      type: 'ph',
      color: '#10B981',
      unit: 'pH',
      min: 5.5,
      max: 8.5,
      visible: false,
      opacity: 0.7
    },
    {
      id: 'nitrogen',
      name: 'Nitrogen Content',
      type: 'nutrients',
      color: '#8B5CF6',
      unit: 'ppm',
      min: 0,
      max: 200,
      visible: false,
      opacity: 0.7
    },
    {
      id: 'crop_health',
      name: 'Crop Health Index',
      type: 'crop_health',
      color: '#06B6D4',
      unit: 'index',
      min: 0,
      max: 1,
      visible: false,
      opacity: 0.7
    },
    {
      id: 'disease_risk',
      name: 'Disease Risk',
      type: 'disease_risk',
      color: '#F59E0B',
      unit: 'risk',
      min: 0,
      max: 1,
      visible: false,
      opacity: 0.7
    }
  ]);

  // Generate sample heat map data
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>(() => {
    const data: HeatMapData[] = [];
    for (let i = 0; i < 100; i++) {
      const lat = 28.7041 + (Math.random() - 0.5) * 0.01;
      const lng = 77.1025 + (Math.random() - 0.5) * 0.01;
      
      data.push({
        lat,
        lng,
        value: Math.random(),
        intensity: Math.random(),
        metadata: {
          soilMoisture: 30 + Math.random() * 40,
          temperature: 22 + Math.random() * 8,
          ph: 6.0 + Math.random() * 2.0,
          nitrogen: Math.random() * 150,
          phosphorus: Math.random() * 100,
          potassium: Math.random() * 200,
          organicMatter: 2 + Math.random() * 3,
          cropHealth: 0.6 + Math.random() * 0.4,
          diseaseRisk: Math.random() * 0.5,
          pestActivity: Math.random() * 0.3,
          weedDensity: Math.random() * 0.4
        }
      });
    }
    return data;
  });

  const [zoneAnalysis, setZoneAnalysis] = useState<ZoneAnalysis[]>([
    {
      zone: 'North Field',
      area: 12.5,
      avgValue: 68.5,
      minValue: 45.2,
      maxValue: 85.7,
      stdDev: 8.3,
      status: 'good',
      recommendations: [
        'Increase irrigation in low-moisture areas',
        'Consider soil amendment in southeast corner',
        'Monitor for pest activity near water source'
      ]
    },
    {
      zone: 'South Field',
      area: 15.3,
      avgValue: 72.1,
      minValue: 52.8,
      maxValue: 89.4,
      stdDev: 9.7,
      status: 'excellent',
      recommendations: [
        'Maintain current irrigation schedule',
        'Consider precision fertilizer application',
        'Excellent conditions for crop development'
      ]
    },
    {
      zone: 'East Greenhouse',
      area: 2.8,
      avgValue: 45.3,
      minValue: 35.1,
      maxValue: 58.9,
      stdDev: 5.2,
      status: 'fair',
      recommendations: [
        'Increase humidity control',
        'Check irrigation system functionality',
        'Consider supplemental water application'
      ]
    },
    {
      zone: 'West Orchard',
      area: 8.7,
      avgValue: 38.2,
      minValue: 28.5,
      maxValue: 48.6,
      stdDev: 6.1,
      status: 'poor',
      recommendations: [
        'Urgent irrigation required',
        'Implement drip irrigation system',
        'Soil improvement needed'
      ]
    }
  ]);

  // Real-time data updates simulation
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setHeatMapData(prevData =>
        prevData.map(point => ({
          ...point,
          value: Math.max(0, Math.min(1, point.value + (Math.random() - 0.5) * 0.1)),
          metadata: {
            ...point.metadata,
            soilMoisture: Math.max(0, Math.min(100, point.metadata.soilMoisture + (Math.random() - 0.5) * 2)),
            temperature: Math.max(15, Math.min(40, point.metadata.temperature + (Math.random() - 0.5) * 0.5)),
            cropHealth: Math.max(0, Math.min(1, point.metadata.cropHealth + (Math.random() - 0.5) * 0.05))
          }
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getLayerValue = (point: HeatMapData, layerType: string): number => {
    switch (layerType) {
      case 'soil_moisture': return point.metadata.soilMoisture;
      case 'temperature': return point.metadata.temperature;
      case 'ph': return point.metadata.ph;
      case 'nutrients': return point.metadata.nitrogen;
      case 'crop_health': return point.metadata.cropHealth * 100;
      case 'disease_risk': return point.metadata.diseaseRisk * 100;
      default: return point.value * 100;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'fair': return <Info className="w-4 h-4" />;
      case 'poor': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const selectedLayerData = layers.find(l => l.id === selectedLayer);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Heat Map Analytics</h2>
          <p className="text-gray-600">Spatial analysis and field condition visualization</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isLiveMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isLiveMode ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isLiveMode ? 'Live' : 'Paused'}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Layer Controls</h3>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedLayer === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: layer.color }}
                ></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLayers(layers.map(l => 
                      l.id === layer.id ? { ...l, visible: !l.visible } : l
                    ));
                  }}
                  className={`p-1 rounded ${layer.visible ? 'text-blue-500' : 'text-gray-400'}`}
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>
              <h4 className="font-medium text-sm text-gray-900">{layer.name}</h4>
              <p className="text-xs text-gray-600">{layer.min} - {layer.max} {layer.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { key: 'heatmap', label: 'Heat Map', icon: Map },
          { key: 'zones', label: 'Zone Analysis', icon: Target },
          { key: 'analysis', label: 'Statistics', icon: BarChart3 },
          { key: 'trends', label: 'Trends', icon: TrendingUp }
        ].map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as 'heatmap' | 'zones' | 'analysis' | 'trends')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === mode.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Heat Map View */}
      {viewMode === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Heat Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedLayerData?.name} Heat Map
                </h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Heat Map Visualization Area */}
              <div className="h-96 bg-gray-100 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Interactive Heat Map</h4>
                    <p className="text-gray-600 mb-4">
                      Displaying {selectedLayerData?.name} across field zones
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-200 rounded"></div>
                        <span>Low ({selectedLayerData?.min} {selectedLayerData?.unit})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>High ({selectedLayerData?.max} {selectedLayerData?.unit})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heat Map Grid Simulation */}
                <div className="absolute inset-4 grid grid-cols-10 gap-1 opacity-30">
                  {Array.from({ length: 100 }, (_, i) => {
                    const intensity = Math.random();
                    const color = intensity > 0.7 ? 'bg-red-500' : 
                                 intensity > 0.4 ? 'bg-yellow-400' : 'bg-blue-200';
                    return (
                      <div
                        key={i}
                        className={`${color} rounded`}
                        style={{ opacity: intensity }}
                      ></div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-700">Data Range</h5>
                  <span className="text-sm text-gray-600">
                    {heatMapData.length} data points
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex-1 h-3 bg-gradient-to-r from-blue-200 via-yellow-400 to-red-500 rounded"></div>
                  <div className="flex items-center space-x-8 text-sm text-gray-600">
                    <span>{selectedLayerData?.min} {selectedLayerData?.unit}</span>
                    <span>{selectedLayerData?.max} {selectedLayerData?.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Information</h3>
              {selectedLayerData && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: selectedLayerData.color }}
                      ></div>
                      <h4 className="font-medium text-gray-900">{selectedLayerData.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Range: {selectedLayerData.min} - {selectedLayerData.max} {selectedLayerData.unit}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-medium">
                        {(heatMapData.reduce((sum, point) => sum + getLayerValue(point, selectedLayerData.type), 0) / heatMapData.length).toFixed(1)} {selectedLayerData.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minimum:</span>
                      <span className="font-medium">
                        {Math.min(...heatMapData.map(point => getLayerValue(point, selectedLayerData.type))).toFixed(1)} {selectedLayerData.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Maximum:</span>
                      <span className="font-medium">
                        {Math.max(...heatMapData.map(point => getLayerValue(point, selectedLayerData.type))).toFixed(1)} {selectedLayerData.unit}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-700 mb-2">Controls</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Opacity</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedLayerData.opacity}
                          onChange={(e) => {
                            const opacity = parseFloat(e.target.value);
                            setLayers(layers.map(l => 
                              l.id === selectedLayerData.id ? { ...l, opacity } : l
                            ));
                          }}
                          className="w-full"
                        />
                      </div>
                      <button className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Filter className="w-4 h-4" />
                        <span>Apply Filter</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Data Coverage', value: '98.5%', icon: Map, color: 'green' },
                  { label: 'Update Frequency', value: '5 min', icon: Clock, color: 'blue' },
                  { label: 'Accuracy', value: '±2.1%', icon: Target, color: 'purple' },
                  { label: 'Last Sync', value: '2m ago', icon: RefreshCw, color: 'gray' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 text-${stat.color}-500`} />
                        <span className="text-sm text-gray-600">{stat.label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone Analysis View */}
      {viewMode === 'zones' && (
        <div className="space-y-6">
          {zoneAnalysis.map((zone) => (
            <div
              key={zone.zone}
              onClick={() => setSelectedZone(selectedZone === zone.zone ? null : zone.zone)}
              className={`p-6 bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all ${
                selectedZone === zone.zone ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{zone.zone}</h3>
                    <p className="text-sm text-gray-600">{zone.area} hectares</p>
                  </div>
                </div>
                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(zone.status)}`}>
                  {getStatusIcon(zone.status)}
                  <span className="capitalize">{zone.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{zone.avgValue.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Average</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{zone.minValue.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Minimum</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{zone.maxValue.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Maximum</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{zone.stdDev.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Std Dev</p>
                </div>
              </div>

              {selectedZone === zone.zone && (
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3">Recommendations</h5>
                  <div className="space-y-2">
                    {zone.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analysis View */}
      {viewMode === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Analysis</h3>
            <div className="space-y-4">
              {layers.filter(l => l.visible).map((layer) => (
                <div key={layer.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{layer.name}</h4>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: layer.color }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Mean</p>
                      <p className="font-medium">
                        {(heatMapData.reduce((sum, point) => sum + getLayerValue(point, layer.type), 0) / heatMapData.length).toFixed(1)} {layer.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Range</p>
                      <p className="font-medium">
                        {(Math.max(...heatMapData.map(point => getLayerValue(point, layer.type))) - 
                          Math.min(...heatMapData.map(point => getLayerValue(point, layer.type)))).toFixed(1)} {layer.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Variance</p>
                      <p className="font-medium">High</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlation Matrix</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Correlation analysis between parameters</p>
                <p className="text-sm text-gray-500">Soil moisture vs temperature, pH vs nutrients</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends View */}
      {viewMode === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Soil Moisture Trend', value: '+5.2%', trend: 'up', period: '7 days' },
              { label: 'Temperature Change', value: '-1.8°C', trend: 'down', period: '24 hours' },
              { label: 'pH Stability', value: '±0.1', trend: 'stable', period: '30 days' },
              { label: 'Nutrient Levels', value: '+12%', trend: 'up', period: '7 days' }
            ].map((metric, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">{metric.label}</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  {metric.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                  {metric.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                  {metric.trend === 'stable' && <Activity className="w-5 h-5 text-blue-500" />}
                </div>
                <p className="text-sm text-gray-600 mt-1">Over {metric.period}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Trends</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Time series analysis</p>
                <p className="text-sm text-gray-500">Parameter changes over selected time range</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMapSystem;
