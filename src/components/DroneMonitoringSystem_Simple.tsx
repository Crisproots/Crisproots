"use client";

import React from 'react';

const DroneMonitoringSystem: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Advanced Drone Monitoring System
          </h1>
          <p className="text-gray-600 mb-6">
            Real-time aerial surveillance, weather monitoring, and precision agriculture analytics
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Drone Status Cards */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Active Drones</h3>
              <p className="text-3xl font-bold">3</p>
              <p className="text-blue-100">Currently Flying</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Area Covered</h3>
              <p className="text-3xl font-bold">125</p>
              <p className="text-green-100">Acres Today</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Data Points</h3>
              <p className="text-3xl font-bold">2.4K</p>
              <p className="text-purple-100">Collected Today</p>
            </div>
          </div>
          
          {/* Real-time Features */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Live Camera Feed</h3>
              <div className="bg-black rounded-lg h-64 flex items-center justify-center">
                <p className="text-white">Live Drone Camera Feed</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">3D Field Map</h3>
              <div className="bg-gradient-to-br from-green-200 to-green-400 rounded-lg h-64 flex items-center justify-center">
                <p className="text-green-800 font-semibold">Interactive 3D Map View</p>
              </div>
            </div>
          </div>
          
          {/* Feature List */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Advanced Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-blue-900">Real-time Analytics</h4>
                <p className="text-sm text-blue-700 mt-1">Live data processing</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-green-900">Crop Health Monitoring</h4>
                <p className="text-sm text-green-700 mt-1">AI-powered analysis</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-purple-900">Weather Integration</h4>
                <p className="text-sm text-purple-700 mt-1">Environmental data</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <h4 className="font-medium text-orange-900">Geofencing</h4>
                <p className="text-sm text-orange-700 mt-1">Automated boundaries</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              This is a simplified version of the drone monitoring system. The full version with advanced analytics, 
              real-time charts, 3D visualization, and comprehensive monitoring features is being optimized.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneMonitoringSystem;
