"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, Camera, RotateCcw, ZoomIn, ZoomOut, Download
} from 'lucide-react';

interface Drone3DModel {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  status: 'flying' | 'hovering' | 'returning' | 'landed';
  batteryLevel: number;
  cameraTilt: number;
}

interface Field3DData {
  id: string;
  vertices: Array<{ x: number; y: number; z: number }>;
  healthData: number[][];
  moistureData: number[][];
  temperatureData: number[][];
  cropHeight: number[][];
}

const Advanced3DVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'terrain' | 'health' | 'moisture' | 'temperature' | 'drones'>('terrain');
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 50, z: 100 });
  const [cameraRotation, setCameraRotation] = useState({ x: -0.3, y: 0, z: 0 });
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const animationRef = useRef<number | undefined>();

  // Sample 3D drone data
  const [drones3D, setDrones3D] = useState<Drone3DModel[]>([
    {
      id: 'drone-1',
      position: { x: 20, y: 25, z: 10 },
      rotation: { x: 0, y: 0.5, z: 0 },
      status: 'flying',
      batteryLevel: 87,
      cameraTilt: -15
    },
    {
      id: 'drone-2',
      position: { x: -15, y: 30, z: -20 },
      rotation: { x: 0.1, y: -0.3, z: 0 },
      status: 'hovering',
      batteryLevel: 92,
      cameraTilt: -45
    },
    {
      id: 'drone-3',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      status: 'landed',
      batteryLevel: 45,
      cameraTilt: 0
    }
  ]);

  // Sample field data
  const fieldData = React.useMemo<Field3DData>(() => ({
    id: 'main-field',
    vertices: [
      { x: -50, y: 0, z: -50 },
      { x: 50, y: 0, z: -50 },
      { x: 50, y: 0, z: 50 },
      { x: -50, y: 0, z: 50 }
    ],
    healthData: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() * 100)),
    moistureData: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() * 100)),
    temperatureData: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => 20 + Math.random() * 15)),
    cropHeight: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() * 3))
  }), []);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      // Update drone positions
      setDrones3D(prevDrones => 
        prevDrones.map(drone => {
          if (drone.status === 'flying') {
            return {
              ...drone,
              position: {
                x: drone.position.x + Math.sin(Date.now() / 2000 + parseFloat(drone.id.split('-')[1])) * 0.5,
                y: drone.position.y + Math.sin(Date.now() / 1500 + parseFloat(drone.id.split('-')[1])) * 0.3,
                z: drone.position.z + Math.cos(Date.now() / 2500 + parseFloat(drone.id.split('-')[1])) * 0.4
              },
              rotation: {
                ...drone.rotation,
                y: drone.rotation.y + 0.01
              }
            };
          }
          return drone;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // 3D Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set up 3D projection
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 3 * zoom;

      // Project 3D point to 2D
      const project = (x: number, y: number, z: number) => {
        const rotatedX = x * Math.cos(cameraRotation.y) - z * Math.sin(cameraRotation.y);
        const rotatedZ = x * Math.sin(cameraRotation.y) + z * Math.cos(cameraRotation.y);
        const rotatedY = y * Math.cos(cameraRotation.x) - rotatedZ * Math.sin(cameraRotation.x);
        const finalZ = y * Math.sin(cameraRotation.x) + rotatedZ * Math.cos(cameraRotation.x);

        const perspective = 200 / (200 + finalZ + cameraPosition.z);
        return {
          x: centerX + (rotatedX + cameraPosition.x) * scale * perspective,
          y: centerY + (rotatedY + cameraPosition.y) * scale * perspective,
          z: finalZ
        };
      };

      // Draw field grid
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      for (let i = -50; i <= 50; i += 10) {
        // Vertical lines
        const start = project(i, 0, -50);
        const end = project(i, 0, 50);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Horizontal lines
        const start2 = project(-50, 0, i);
        const end2 = project(50, 0, i);
        ctx.beginPath();
        ctx.moveTo(start2.x, start2.y);
        ctx.lineTo(end2.x, end2.y);
        ctx.stroke();
      }

      // Draw field data visualization
      if (viewMode !== 'terrain') {
        for (let i = 0; i < 19; i++) {
          for (let j = 0; j < 19; j++) {
            const x1 = -45 + i * 5;
            const z1 = -45 + j * 5;
            const x2 = x1 + 5;
            const z2 = z1 + 5;

            let value = 0;
            let color = '';

            switch (viewMode) {
              case 'health':
                value = fieldData.healthData[i][j];
                color = `hsl(${value * 1.2}, 70%, 50%)`;
                break;
              case 'moisture':
                value = fieldData.moistureData[i][j];
                color = `hsl(${200 + value * 0.6}, 70%, 50%)`;
                break;
              case 'temperature':
                value = fieldData.temperatureData[i][j];
                color = `hsl(${(35 - value) * 10}, 70%, 50%)`;
                break;
            }

            const height = viewMode === 'drones' ? 0 : value * 0.3;

            // Draw data cube
            const corners = [
              project(x1, height, z1),
              project(x2, height, z1),
              project(x2, height, z2),
              project(x1, height, z2),
              project(x1, 0, z1),
              project(x2, 0, z1),
              project(x2, 0, z2),
              project(x1, 0, z2)
            ];

            // Sort by z-depth for proper rendering
            // const avgZ = corners.reduce((sum, corner) => sum + corner.z, 0) / corners.length;

            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7;

            // Draw top face
            ctx.beginPath();
            ctx.moveTo(corners[0].x, corners[0].y);
            ctx.lineTo(corners[1].x, corners[1].y);
            ctx.lineTo(corners[2].x, corners[2].y);
            ctx.lineTo(corners[3].x, corners[3].y);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw drones
      drones3D.forEach(drone => {
        const pos = project(drone.position.x, drone.position.y, drone.position.z);
        
        // Drone body
        ctx.fillStyle = drone.status === 'flying' ? '#3b82f6' : 
                        drone.status === 'hovering' ? '#f59e0b' :
                        drone.status === 'returning' ? '#8b5cf6' : '#6b7280';
        
        const size = 8;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Drone rotors
        ctx.strokeStyle = drone.status === 'flying' ? '#ef4444' : '#6b7280';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI / 2) + drone.rotation.y;
          const rotorX = pos.x + Math.cos(angle) * size * 1.5;
          const rotorY = pos.y + Math.sin(angle) * size * 1.5;
          
          ctx.beginPath();
          ctx.arc(rotorX, rotorY, 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Drone label
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(drone.id.toUpperCase(), pos.x, pos.y - size - 5);

        // Battery indicator
        const batteryColor = drone.batteryLevel > 60 ? '#10b981' : 
                           drone.batteryLevel > 30 ? '#f59e0b' : '#ef4444';
        ctx.fillStyle = batteryColor;
        ctx.fillRect(pos.x - 15, pos.y + size + 5, (drone.batteryLevel / 100) * 30, 3);
        ctx.strokeStyle = '#374151';
        ctx.strokeRect(pos.x - 15, pos.y + size + 5, 30, 3);

        // Selection indicator
        if (selectedDrone === drone.id) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size + 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw legend
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(10, 10, 200, 120);
      ctx.strokeStyle = '#d1d5db';
      ctx.strokeRect(10, 10, 200, 120);

      ctx.fillStyle = '#1f2937';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('3D Field Visualization', 20, 30);

      ctx.font = '12px Arial';
      ctx.fillText(`View Mode: ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`, 20, 50);
      ctx.fillText(`Active Drones: ${drones3D.filter(d => d.status === 'flying').length}`, 20, 70);
      ctx.fillText(`Camera: X:${cameraRotation.x.toFixed(1)} Y:${cameraRotation.y.toFixed(1)}`, 20, 90);
      ctx.fillText(`Zoom: ${(zoom * 100).toFixed(0)}%`, 20, 110);
    };

    render();
  }, [drones3D, viewMode, cameraPosition, cameraRotation, zoom, selectedDrone, fieldData]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center text-black">
          <Globe className="w-6 h-6 mr-2 text-blue-600" />
          3D Field & Drone Visualization
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isAnimating ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {isAnimating ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => {
              setCameraRotation({ x: -0.3, y: 0, z: 0 });
              setZoom(1);
            }}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['terrain', 'health', 'moisture', 'temperature', 'drones'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as 'terrain' | 'health' | 'moisture' | 'temperature' | 'drones')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full cursor-move"
          onMouseMove={(e) => {
            if (e.buttons === 1) {
              const rect = e.currentTarget.getBoundingClientRect();
              const deltaX = (e.clientX - rect.left - rect.width / 2) / rect.width;
              const deltaY = (e.clientY - rect.top - rect.height / 2) / rect.height;
              
              setCameraRotation(prev => ({
                x: Math.max(-Math.PI/2, Math.min(Math.PI/2, prev.x + deltaY * 0.01)),
                y: prev.y + deltaX * 0.01,
                z: prev.z
              }));
            }
          }}
          onWheel={(e) => {
            e.preventDefault();
            setZoom(prev => Math.max(0.1, Math.min(3, prev + (e.deltaY > 0 ? -0.1 : 0.1))));
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Simple drone selection (you could make this more precise)
            drones3D.forEach(drone => {
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const scale = 3 * zoom;
              const perspective = 200 / (200 + drone.position.z + cameraPosition.z);
              
              const screenX = centerX + (drone.position.x + cameraPosition.x) * scale * perspective;
              const screenY = centerY + (drone.position.y + cameraPosition.y) * scale * perspective;
              
              const distance = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2);
              if (distance < 20) {
                setSelectedDrone(selectedDrone === drone.id ? null : drone.id);
              }
            });
          }}
        />

        {/* 3D Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
            className="block bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.1, prev - 0.2))}
            className="block bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button className="block bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <button className="block bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg text-sm">
          <div className="font-medium mb-1">Controls:</div>
          <div>• Drag to rotate camera</div>
          <div>• Scroll to zoom</div>
          <div>• Click drone to select</div>
        </div>
      </div>

      {/* Selected Drone Info */}
      {selectedDrone && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          {(() => {
            const drone = drones3D.find(d => d.id === selectedDrone);
            if (!drone) return null;
            
            return (
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  {selectedDrone.toUpperCase()} - Status Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="font-medium capitalize">{drone.status}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Battery:</span>
                    <div className="font-medium">{drone.batteryLevel}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Altitude:</span>
                    <div className="font-medium">{drone.position.y.toFixed(1)}m</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Camera Tilt:</span>
                    <div className="font-medium">{drone.cameraTilt}°</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Advanced3DVisualization;
