"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Maximize2, Volume2, VolumeX,
  Settings, Target, Zap, Signal, Battery,
  Eye, Play, Pause, Download, Share2
} from 'lucide-react';

interface DroneControls {
  gimbalTilt: number;
  gimbalPan: number;
  zoom: number;
  cameraMode: 'normal' | 'thermal' | 'infrared' | 'night-vision';
  stabilization: boolean;
  recording: boolean;
  autoTracking: boolean;
}

interface FlightData {
  altitude: number;
  speed: number;
  heading: number;
  battery: number;
  signal: number;
  temperature: number;
  windSpeed: number;
  coordinates: { lat: number; lng: number };
}

const AdvancedLiveDronePOV: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [controls, setControls] = useState<DroneControls>({
    gimbalTilt: 0,
    gimbalPan: 0,
    zoom: 1,
    cameraMode: 'normal',
    stabilization: true,
    recording: false,
    autoTracking: false
  });

  const [flightData, setFlightData] = useState<FlightData>({
    altitude: 120,
    speed: 15.3,
    heading: 285,
    battery: 76,
    signal: 94,
    temperature: 24,
    windSpeed: 8.2,
    coordinates: { lat: 28.6139, lng: 77.2090 }
  });

  const [detectedObjects, setDetectedObjects] = useState([
    { id: 1, type: 'Vehicle', confidence: 0.92, x: 320, y: 180, width: 80, height: 40 },
    { id: 2, type: 'Person', confidence: 0.87, x: 150, y: 220, width: 30, height: 60 },
    { id: 3, type: 'Building', confidence: 0.95, x: 500, y: 100, width: 200, height: 150 }
  ]);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFlightData(prev => ({
        ...prev,
        altitude: prev.altitude + (Math.random() - 0.5) * 2,
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 1),
        heading: (prev.heading + (Math.random() - 0.5) * 5) % 360,
        battery: Math.max(0, prev.battery - 0.01),
        signal: Math.max(70, Math.min(100, prev.signal + (Math.random() - 0.5) * 5)),
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5,
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 0.5),
        coordinates: {
          lat: prev.coordinates.lat + (Math.random() - 0.5) * 0.0001,
          lng: prev.coordinates.lng + (Math.random() - 0.5) * 0.0001
        }
      }));

      // Simulate object detection updates
      setDetectedObjects(prev => 
        prev.map(obj => ({
          ...obj,
          x: obj.x + (Math.random() - 0.5) * 10,
          y: obj.y + (Math.random() - 0.5) * 10,
          confidence: Math.max(0.5, Math.min(1, obj.confidence + (Math.random() - 0.5) * 0.05))
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Video controls
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleLoadedMetadata = () => setDuration(video.duration);
      
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  // Draw overlay graphics
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const drawOverlay = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Crosshair
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          ctx.beginPath();
          ctx.moveTo(centerX - 20, centerY);
          ctx.lineTo(centerX + 20, centerY);
          ctx.moveTo(centerX, centerY - 20);
          ctx.lineTo(centerX, centerY + 20);
          ctx.stroke();

          // Flight path grid
          ctx.strokeStyle = '#00ff0040';
          ctx.lineWidth = 1;
          for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
          }
          for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
          }

          // Object detection boxes
          detectedObjects.forEach(obj => {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
            
            // Object label
            ctx.fillStyle = '#ff0000';
            ctx.font = '12px Arial';
            ctx.fillText(`${obj.type} (${(obj.confidence * 100).toFixed(0)}%)`, obj.x, obj.y - 5);
          });

          // Altitude indicator
          ctx.fillStyle = '#00ff00';
          ctx.font = '16px Arial';
          ctx.fillText(`ALT: ${flightData.altitude.toFixed(1)}m`, 20, 30);
          ctx.fillText(`SPD: ${flightData.speed.toFixed(1)} m/s`, 20, 50);
          ctx.fillText(`HDG: ${flightData.heading.toFixed(0)}°`, 20, 70);
          
          // Battery and signal
          ctx.fillText(`BAT: ${flightData.battery.toFixed(0)}%`, canvas.width - 120, 30);
          ctx.fillText(`SIG: ${flightData.signal.toFixed(0)}%`, canvas.width - 120, 50);

          requestAnimationFrame(drawOverlay);
        };

        drawOverlay();
      }
    }
  }, [detectedObjects, flightData]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('drone-pov-container');
    if (container) {
      if (!isFullscreen) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <Camera className="w-6 h-6 mr-2 text-red-600" />
          Live Drone POV Feed
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600">LIVE</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Signal className="w-4 h-4" />
            <span>{flightData.signal.toFixed(0)}%</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Battery className="w-4 h-4" />
            <span>{flightData.battery.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Feed */}
        <div className="lg:col-span-2">
          <div id="drone-pov-container" className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-96 object-cover"
              loop
              muted={isMuted}
              onLoadedData={() => setDuration(videoRef.current?.duration || 0)}
            >
              <source src="/videoplayback (1).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Overlay Canvas */}
            <canvas
              ref={overlayCanvasRef}
              width={800}
              height={450}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-2">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div
                    className="bg-red-500 h-1 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* HUD Elements */}
            <div className="absolute top-4 left-4 text-white">
              <div className="bg-black/50 p-2 rounded-lg text-sm space-y-1">
                <div>Coordinates: {flightData.coordinates.lat.toFixed(6)}, {flightData.coordinates.lng.toFixed(6)}</div>
                <div>Temperature: {flightData.temperature.toFixed(1)}°C</div>
                <div>Wind: {flightData.windSpeed.toFixed(1)} m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Camera Controls */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center text-black">
              <Settings className="w-4 h-4 mr-2 text-black" />
              Camera Controls
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-black">Gimbal Tilt</label>
                <input
                  type="range"
                  min="-90"
                  max="45"
                  value={controls.gimbalTilt}
                  onChange={(e) => setControls(prev => ({ ...prev, gimbalTilt: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-black">{controls.gimbalTilt}°</span>
              </div>
              
              <div>
                <label className="text-sm text-black">Gimbal Pan</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={controls.gimbalPan}
                  onChange={(e) => setControls(prev => ({ ...prev, gimbalPan: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-black">{controls.gimbalPan}°</span>
              </div>
              
              <div>
                <label className="text-sm text-black">Zoom Level</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={controls.zoom}
                  onChange={(e) => setControls(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-black">{controls.zoom.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          {/* Camera Modes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center text-black">
              <Eye className="w-4 h-4 mr-2 text-black" />
              Vision Modes
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {['normal', 'thermal', 'infrared', 'night-vision'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setControls(prev => ({ ...prev, cameraMode: mode as 'normal' | 'thermal' | 'infrared' | 'night-vision' }))}
                  className={`p-2 text-xs rounded-lg transition-colors capitalize ${
                    controls.cameraMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center text-black">
              <Zap className="w-4 h-4 mr-2" />
              Advanced Features
            </h4>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={controls.stabilization}
                  onChange={(e) => setControls(prev => ({ ...prev, stabilization: e.target.checked }))}
                />
                <span className="font-medium text-black">Image Stabilization</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={controls.recording}
                  onChange={(e) => setControls(prev => ({ ...prev, recording: e.target.checked }))}
                />
                <span className="font-medium text-black">Recording</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={controls.autoTracking}
                  onChange={(e) => setControls(prev => ({ ...prev, autoTracking: e.target.checked }))}
                />
                <span className="font-medium text-black">Auto Tracking</span>
              </label>
            </div>
          </div>

          {/* Object Detection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center text-black">
              <Target className="w-4 h-4 mr-2 text-black" />
              Detected Objects
            </h4>
            
            <div className="space-y-2">
              {detectedObjects.map(obj => (
                <div key={obj.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-black">{obj.type}</span>
                  <span className="text-green-600 font-medium">{(obj.confidence * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedLiveDronePOV;
