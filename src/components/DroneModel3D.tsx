"use client";

import React, { useState } from 'react';
import {
  Drone, Camera, Radio, Target, Navigation, ZoomIn, Move, Mouse,
  RotateCcw, Maximize, Settings, Battery, Signal, Activity
} from 'lucide-react';

interface DroneModel3DProps {
  modelUrl?: string;
  droneData?: {
    model: string;
    battery: number;
    altitude: number;
    signal: number;
    flightMode: string;
    maxSpeed: string;
    flightTime: string;
    camera: string;
    range: string;
  };
}

const DroneModel3D: React.FC<DroneModel3DProps> = ({ 
  modelUrl = "https://sketchfab.com/models/80d9392bf1e640098f2f6365c7bbec74/embed",
  droneData = {
    model: "DJI Phantom 4 Pro",
    battery: 87,
    altitude: 120,
    signal: 95,
    flightMode: "Autonomous",
    maxSpeed: "72 km/h",
    flightTime: "30 minutes",
    camera: "4K UHD",
    range: "7 km"
  }
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center text-black">
          <Drone className="w-6 h-6 mr-2 text-blue-600" />
          Interactive 3D Drone Model
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Sketchfab 3D Model */}
        <div className={`bg-gray-100 rounded-lg overflow-hidden ${isFullscreen ? 'h-[70vh]' : 'h-96'}`}>
          <div className="sketchfab-embed-wrapper h-full">
            <iframe 
              title="Interactive 3D Drone Model" 
              className="w-full h-full"
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
              src={modelUrl}
            />
          </div>
          {!isFullscreen && (
            <div className="p-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-600">
                Interactive 3D model by{' '}
                <a 
                  href="https://sketchfab.com/Samad.Ahmed" 
                  target="_blank" 
                  rel="nofollow" 
                  className="font-bold text-blue-600 hover:text-blue-800"
                >
                  Samad.Ahmed
                </a>{' '}
                on{' '}
                <a 
                  href="https://sketchfab.com" 
                  target="_blank" 
                  rel="nofollow" 
                  className="font-bold text-blue-600 hover:text-blue-800"
                >
                  Sketchfab
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Model Information & Controls */}
        {(!isFullscreen || showControls) && (
          <div className="space-y-4">
            {/* Drone Specifications */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
              <h4 className="text-lg font-bold mb-2 flex items-center">
                <Drone className="w-5 h-5 mr-2" />
                {droneData.model}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="opacity-80">Max Speed:</span>
                  <div className="font-semibold">{droneData.maxSpeed}</div>
                </div>
                <div>
                  <span className="opacity-80">Flight Time:</span>
                  <div className="font-semibold">{droneData.flightTime}</div>
                </div>
                <div>
                  <span className="opacity-80">Camera:</span>
                  <div className="font-semibold">{droneData.camera}</div>
                </div>
                <div>
                  <span className="opacity-80">Range:</span>
                  <div className="font-semibold">{droneData.range}</div>
                </div>
              </div>
            </div>

            {/* 3D Interaction Guide */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-3 flex items-center text-black">
                <Mouse className="w-4 h-4 mr-2 text-black" />
                3D Model Controls
              </h5>
              <div className="space-y-2 text-sm text-black">
                <div className="flex items-center space-x-2">
                  <Mouse className="w-4 h-4 text-black" />
                  <span>Click & drag to rotate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ZoomIn className="w-4 h-4 text-black" />
                  <span>Scroll to zoom in/out</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move className="w-4 h-4 text-black" />
                  <span>Right-click & drag to pan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-black" />
                  <span>Double-click to reset view</span>
                </div>
              </div>
            </div>

            {/* Real-time Status */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Live Drone Status
              </h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Battery className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-700">Battery:</span>
                  </div>
                  <span className="font-bold text-green-800">{droneData.battery}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Signal className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-700">Signal:</span>
                  </div>
                  <span className="font-bold text-green-800">{droneData.signal}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Altitude:</span>
                  <span className="font-bold text-green-800">{droneData.altitude}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700">Mode:</span>
                  <span className="font-bold text-green-800">{droneData.flightMode}</span>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                <Camera className="w-4 h-4 mr-1" />
                Take Photo
              </button>
              <button className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm">
                <Radio className="w-4 h-4 mr-1" />
                Record
              </button>
              <button className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm">
                <Target className="w-4 h-4 mr-1" />
                Waypoint
              </button>
              <button className="bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center text-sm">
                <Navigation className="w-4 h-4 mr-1" />
                Return Home
              </button>
            </div>

            {/* Advanced Features */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">Advanced Features</h5>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• Obstacle avoidance system</div>
                <div>• GPS precision hovering</div>
                <div>• 3-axis mechanical gimbal</div>
                <div>• Follow-me intelligent flight mode</div>
                <div>• ActiveTrack subject tracking</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DroneModel3D;
