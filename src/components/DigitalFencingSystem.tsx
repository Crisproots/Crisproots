"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Bell,
  Clock,
  Activity,
  Camera,
  Radio,
  Battery,
  Signal,
  Map,
  RefreshCw,
  Play,
  Pause,
  AlertCircle,
  Info
} from 'lucide-react';

interface DigitalFence {
  id: string;
  name: string;
  type: 'perimeter' | 'zone' | 'corridor' | 'exclusion';
  status: 'active' | 'inactive' | 'triggered' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  coordinates: Array<{ lat: number; lng: number }>;
  sensors: string[];
  actions: string[];
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
  area: number;
  perimeter: number;
}

interface SecurityEvent {
  id: string;
  fenceId: string;
  fenceName: string;
  type: 'breach' | 'intrusion' | 'sensor_failure' | 'maintenance' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  location: { lat: number; lng: number };
  description: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  response: string[];
  images?: string[];
  video?: string;
}

interface SensorStatus {
  id: string;
  name: string;
  type: 'motion' | 'infrared' | 'camera' | 'pressure' | 'magnetic' | 'ultrasonic';
  status: 'online' | 'offline' | 'warning' | 'error';
  battery: number;
  signal: number;
  location: { lat: number; lng: number };
  lastUpdate: string;
  readings: {
    motion: boolean;
    temperature: number;
    humidity: number;
    light: number;
  };
}

const DigitalFencingSystem: React.FC = () => {
  const [selectedFence, setSelectedFence] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'sensors' | 'events'>('map');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [fences, setFences] = useState<DigitalFence[]>([
    {
      id: 'fence-1',
      name: 'Main Farm Perimeter',
      type: 'perimeter',
      status: 'active',
      priority: 'high',
      coordinates: [
        { lat: 28.7041, lng: 77.1025 },
        { lat: 28.7051, lng: 77.1025 },
        { lat: 28.7051, lng: 77.1035 },
        { lat: 28.7041, lng: 77.1035 }
      ],
      sensors: ['Motion Detector', 'IR Camera', 'Pressure Sensor'],
      actions: ['SMS Alert', 'Email Notification', 'Sound Alarm', 'Camera Recording'],
      createdAt: '2024-07-01',
      lastTriggered: '2024-07-19T14:30:00Z',
      triggerCount: 12,
      area: 25.5,
      perimeter: 2.1
    },
    {
      id: 'fence-2',
      name: 'Greenhouse Protection Zone',
      type: 'zone',
      status: 'active',
      priority: 'critical',
      coordinates: [
        { lat: 28.7045, lng: 77.1027 },
        { lat: 28.7048, lng: 77.1027 },
        { lat: 28.7048, lng: 77.1030 },
        { lat: 28.7045, lng: 77.1030 }
      ],
      sensors: ['Motion Detector', 'Camera', 'Magnetic Sensor'],
      actions: ['Immediate Alert', 'Guard Dispatch', 'Emergency Contact'],
      createdAt: '2024-07-05',
      lastTriggered: '2024-07-18T09:15:00Z',
      triggerCount: 3,
      area: 4.2,
      perimeter: 0.8
    },
    {
      id: 'fence-3',
      name: 'Equipment Storage Exclusion',
      type: 'exclusion',
      status: 'triggered',
      priority: 'medium',
      coordinates: [
        { lat: 28.7043, lng: 77.1032 },
        { lat: 28.7046, lng: 77.1032 },
        { lat: 28.7046, lng: 77.1034 },
        { lat: 28.7043, lng: 77.1034 }
      ],
      sensors: ['Ultrasonic Sensor', 'Camera'],
      actions: ['Log Event', 'Send Notification'],
      createdAt: '2024-07-10',
      lastTriggered: '2024-07-20T11:45:00Z',
      triggerCount: 8,
      area: 1.8,
      perimeter: 0.5
    }
  ]);

  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: 'event-1',
      fenceId: 'fence-3',
      fenceName: 'Equipment Storage Exclusion',
      type: 'intrusion',
      severity: 'high',
      timestamp: '2024-07-20T11:45:00Z',
      location: { lat: 28.7044, lng: 77.1033 },
      description: 'Unauthorized personnel detected in restricted area',
      status: 'new',
      response: ['Security Alert Sent', 'Camera Recording Started'],
      images: ['/api/security/event1_1.jpg', '/api/security/event1_2.jpg']
    },
    {
      id: 'event-2',
      fenceId: 'fence-1',
      fenceName: 'Main Farm Perimeter',
      type: 'breach',
      severity: 'medium',
      timestamp: '2024-07-19T14:30:00Z',
      location: { lat: 28.7048, lng: 77.1028 },
      description: 'Perimeter fence motion detected - possible wildlife',
      status: 'acknowledged',
      response: ['SMS Sent to Security', 'Motion Logged']
    },
    {
      id: 'event-3',
      fenceId: 'fence-2',
      fenceName: 'Greenhouse Protection Zone',
      type: 'sensor_failure',
      severity: 'low',
      timestamp: '2024-07-18T09:15:00Z',
      location: { lat: 28.7046, lng: 77.1028 },
      description: 'Sensor battery low - Camera 3',
      status: 'resolved',
      response: ['Maintenance Scheduled', 'Battery Replaced']
    }
  ]);

  const [sensors, setSensors] = useState<SensorStatus[]>([
    {
      id: 'sensor-1',
      name: 'Motion Detector Alpha',
      type: 'motion',
      status: 'online',
      battery: 85,
      signal: 92,
      location: { lat: 28.7041, lng: 77.1025 },
      lastUpdate: '2024-07-20T12:00:00Z',
      readings: {
        motion: false,
        temperature: 26.5,
        humidity: 68,
        light: 450
      }
    },
    {
      id: 'sensor-2',
      name: 'IR Camera Beta',
      type: 'camera',
      status: 'online',
      battery: 73,
      signal: 88,
      location: { lat: 28.7045, lng: 77.1027 },
      lastUpdate: '2024-07-20T12:00:00Z',
      readings: {
        motion: false,
        temperature: 25.8,
        humidity: 65,
        light: 520
      }
    },
    {
      id: 'sensor-3',
      name: 'Pressure Sensor Gamma',
      type: 'pressure',
      status: 'warning',
      battery: 32,
      signal: 78,
      location: { lat: 28.7048, lng: 77.1030 },
      lastUpdate: '2024-07-20T11:55:00Z',
      readings: {
        motion: false,
        temperature: 27.2,
        humidity: 72,
        light: 380
      }
    }
  ]);

  // Real-time updates simulation
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setSensors(prevSensors =>
        prevSensors.map(sensor => ({
          ...sensor,
          battery: Math.max(10, sensor.battery - (Math.random() * 0.5)),
          signal: Math.max(60, Math.min(100, sensor.signal + (Math.random() - 0.5) * 10)),
          readings: {
            ...sensor.readings,
            temperature: 25 + Math.random() * 5,
            humidity: 60 + Math.random() * 20,
            light: 300 + Math.random() * 400,
            motion: Math.random() < 0.05 // 5% chance of motion detection
          },
          lastUpdate: new Date().toISOString()
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
      case 'online': return 'text-green-600 bg-green-100';
      case 'inactive':
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'triggered':
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'triggered':
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance':
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFences = filterStatus === 'all' 
    ? fences 
    : fences.filter(fence => fence.status === filterStatus);

  const filteredEvents = events.filter(event => event.status !== 'resolved').slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Digital Fencing System</h2>
          <p className="text-gray-600">Intelligent perimeter security and access control</p>
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
          <button 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>New Fence</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Active Fences', 
            value: fences.filter(f => f.status === 'active').length, 
            total: fences.length,
            icon: Shield, 
            color: 'green' 
          },
          { 
            label: 'Recent Alerts', 
            value: events.filter(e => e.status === 'new').length, 
            total: events.length,
            icon: Bell, 
            color: 'red' 
          },
          { 
            label: 'Online Sensors', 
            value: sensors.filter(s => s.status === 'online').length, 
            total: sensors.length,
            icon: Activity, 
            color: 'blue' 
          },
          { 
            label: 'Coverage Area', 
            value: fences.reduce((sum, f) => sum + f.area, 0).toFixed(1), 
            total: 'hectares',
            icon: Map, 
            color: 'purple' 
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {typeof stat.total === 'number' && (
                      <span className="text-sm text-gray-500">/{stat.total}</span>
                    )}
                    {typeof stat.total === 'string' && (
                      <span className="text-sm text-gray-500 ml-1">{stat.total}</span>
                    )}
                  </p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-500`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'map', label: 'Map View', icon: Map },
            { key: 'list', label: 'Fence List', icon: Shield },
            { key: 'sensors', label: 'Sensors', icon: Radio },
            { key: 'events', label: 'Events', icon: Bell }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key as 'map' | 'list' | 'sensors' | 'events')}
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

        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="triggered">Triggered</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Interactive Security Map</h3>
              <p className="text-gray-600">Real-time visualization of digital fences, sensors, and security events</p>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Active Fences</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Triggered Zones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sensors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fence List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredFences.map((fence) => (
            <div
              key={fence.id}
              onClick={() => setSelectedFence(selectedFence === fence.id ? null : fence.id)}
              className={`p-6 bg-white rounded-xl shadow-lg border-2 cursor-pointer transition-all ${
                selectedFence === fence.id ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{fence.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="capitalize">{fence.type}</span>
                      <span>{fence.area} hectares</span>
                      <span>{fence.perimeter} km perimeter</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(fence.status)}`}>
                    {getStatusIcon(fence.status)}
                    <span className="capitalize">{fence.status}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(fence.priority)}`}>
                    {fence.priority.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Sensors ({fence.sensors.length})</h5>
                  <div className="space-y-1">
                    {fence.sensors.map((sensor, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Radio className="w-3 h-3" />
                        <span>{sensor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Response Actions</h5>
                  <div className="space-y-1">
                    {fence.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Bell className="w-3 h-3" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Statistics</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Triggers:</span>
                      <span className="font-medium">{fence.triggerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{fence.createdAt}</span>
                    </div>
                    {fence.lastTriggered && (
                      <div className="flex justify-between">
                        <span>Last Alert:</span>
                        <span>{new Date(fence.lastTriggered).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedFence === fence.id && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-700">Fence Controls</h5>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        <Pause className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sensors View */}
      {viewMode === 'sensors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Radio className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{sensor.type} sensor</p>
                  </div>
                </div>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
                  {getStatusIcon(sensor.status)}
                  <span className="capitalize">{sensor.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Battery className={`w-4 h-4 ${sensor.battery > 60 ? 'text-green-500' : sensor.battery > 30 ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="text-sm text-gray-600">Battery</span>
                  </div>
                  <span className={`font-semibold ${sensor.battery > 60 ? 'text-green-600' : sensor.battery > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {sensor.battery}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Signal className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Signal</span>
                  </div>
                  <span className="font-semibold text-gray-900">{sensor.signal}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Location</span>
                  </div>
                  <span className="text-sm font-mono text-gray-900">
                    {sensor.location.lat.toFixed(4)}, {sensor.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">Live Readings</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Motion:</span>
                    <span className={`font-medium ${sensor.readings.motion ? 'text-red-600' : 'text-green-600'}`}>
                      {sensor.readings.motion ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temp:</span>
                    <span className="font-medium text-gray-900">{sensor.readings.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium text-gray-900">{sensor.readings.humidity.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Light:</span>
                    <span className="font-medium text-gray-900">{sensor.readings.light.toFixed(0)} lux</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Last update: {new Date(sensor.lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events View */}
      {viewMode === 'events' && (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-6 h-6 ${
                    event.severity === 'critical' ? 'text-red-500' :
                    event.severity === 'high' ? 'text-orange-500' :
                    event.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.fenceName}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(event.severity)}`}>
                    {event.severity.toUpperCase()}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'new' ? 'text-red-600 bg-red-100' :
                    event.status === 'acknowledged' ? 'text-yellow-600 bg-yellow-100' :
                    event.status === 'investigating' ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-100'
                  }`}>
                    {event.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Event Details</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{event.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-mono">{event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Response Actions</h5>
                  <div className="space-y-1">
                    {event.response.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Evidence</h5>
                  <div className="space-y-2">
                    {event.images && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Camera className="w-3 h-3" />
                        <span>{event.images.length} images captured</span>
                      </div>
                    )}
                    {event.video && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Play className="w-3 h-3" />
                        <span>Video recording available</span>
                      </div>
                    )}
                    <button className="text-blue-500 text-sm hover:underline">View Evidence</button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {Math.floor((Date.now() - new Date(event.timestamp).getTime()) / (1000 * 60))} minutes ago
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {event.status === 'new' && (
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                      Acknowledge
                    </button>
                  )}
                  <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DigitalFencingSystem;
