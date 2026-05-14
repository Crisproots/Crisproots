import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Zap,
  TreePine,
  AlertTriangle
} from 'lucide-react';

interface AdvancedEnvironmentalEngineProps {
  parameters: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    water: number;
    lightIntensity?: number;
    co2Level?: number;
  };
  currentDay: number;
  onEnvironmentalChange?: (newConditions: EnvironmentalConditions) => void;
}

interface EnvironmentalConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  lightIntensity: number;
  co2Concentration: number;
  soilTemperature: number;
  vaporPressureDeficit: number;
  dewPoint: number;
  solarRadiation: number;
  photoperiod: number;
  uvIndex: number;
  airPressure: number;
}

interface WeatherEvent {
  type: 'rain' | 'drought' | 'heatwave' | 'frost' | 'storm' | 'normal';
  intensity: number;
  duration: number;
  effects: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    lightIntensity: number;
  };
}

const AdvancedEnvironmentalEngine: React.FC<AdvancedEnvironmentalEngineProps> = ({
  parameters,
  currentDay,
  onEnvironmentalChange
}) => {
  const [environmentalConditions, setEnvironmentalConditions] = useState<EnvironmentalConditions>({
    temperature: parameters.temperature,
    humidity: parameters.humidity,
    windSpeed: parameters.windSpeed,
    lightIntensity: parameters.lightIntensity || 25,
    co2Concentration: parameters.co2Level || 410,
    soilTemperature: parameters.temperature - 2,
    vaporPressureDeficit: 0,
    dewPoint: 0,
    solarRadiation: 0,
    photoperiod: 12,
    uvIndex: 5,
    airPressure: 1013.25
  });

  const [activeWeatherEvent, setActiveWeatherEvent] = useState<WeatherEvent | null>(null);
  const [microclimate, setMicroclimate] = useState({
    canopyTemperature: parameters.temperature,
    soilMoisture: parameters.water,
    leafWetness: 0,
    windProfile: [] as number[],
    temperatureProfile: [] as number[]
  });

  // Advanced environmental calculations
  const calculateEnvironmentalConditions = useCallback((): EnvironmentalConditions => {
    let baseTemp = parameters.temperature;
    let baseHumidity = parameters.humidity;
    let baseWind = parameters.windSpeed;
    let baseLightIntensity = parameters.lightIntensity || 25;

    // Apply weather event effects
    if (activeWeatherEvent) {
      baseTemp += activeWeatherEvent.effects.temperature;
      baseHumidity += activeWeatherEvent.effects.humidity;
      baseWind += activeWeatherEvent.effects.windSpeed;
      baseLightIntensity += activeWeatherEvent.effects.lightIntensity;
    }

    // Calculate derived environmental parameters
    const saturationVP = calculateSaturationVaporPressure(baseTemp);
    const actualVP = saturationVP * (baseHumidity / 100);
    const vaporPressureDeficit = saturationVP - actualVP;
    const dewPoint = calculateDewPoint(baseTemp, baseHumidity);
    const solarRadiation = calculateSolarRadiation(baseLightIntensity, currentDay);
    const photoperiod = calculatePhotoperiod(currentDay);
    const uvIndex = calculateUVIndex(baseLightIntensity, currentDay);
    
    return {
      temperature: baseTemp,
      humidity: Math.max(0, Math.min(100, baseHumidity)),
      windSpeed: Math.max(0, baseWind),
      lightIntensity: Math.max(0, baseLightIntensity),
      co2Concentration: parameters.co2Level || 410,
      soilTemperature: baseTemp - 2 - (baseWind * 0.1),
      vaporPressureDeficit,
      dewPoint,
      solarRadiation,
      photoperiod,
      uvIndex,
      airPressure: 1013.25 - (baseTemp - 15) * 0.5 // Simplified barometric pressure
    };
  }, [parameters, currentDay, activeWeatherEvent]);

  const updateMicroclimate = useCallback((conditions: EnvironmentalConditions) => {
    const canopyTemp = conditions.temperature + (conditions.lightIntensity - 25) * 0.1;
    const soilMoisture = Math.max(0, Math.min(100, parameters.water));
    const leafWetness = conditions.humidity > 90 ? 1 : conditions.humidity > 80 ? 0.5 : 0;
    
    // Create wind and temperature profiles (height-based)
    const heights = [0, 0.5, 1, 2, 5]; // meters
    const windProfile = heights.map(h => conditions.windSpeed * Math.log((h + 0.1) / 0.01) / Math.log(10 / 0.01));
    const temperatureProfile = heights.map(h => conditions.temperature - (h * 0.5)); // Temperature lapse rate
    
    setMicroclimate({
      canopyTemperature: canopyTemp,
      soilMoisture,
      leafWetness,
      windProfile,
      temperatureProfile
    });
  }, [parameters.water]);

  useEffect(() => {
    const newConditions = calculateEnvironmentalConditions();
    setEnvironmentalConditions(newConditions);
    updateMicroclimate(newConditions);
    
    if (onEnvironmentalChange) {
      onEnvironmentalChange(newConditions);
    }
  }, [calculateEnvironmentalConditions, updateMicroclimate, onEnvironmentalChange]);

  const calculateSaturationVaporPressure = (temperature: number): number => {
    return 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  };

  const calculateDewPoint = (temperature: number, humidity: number): number => {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  };

  const calculateSolarRadiation = (lightIntensity: number, day: number): number => {
    const dayOfYear = day % 365;
    const solarConstant = 1367; // W/m²
    const seasonalVariation = 1 + 0.033 * Math.cos(2 * Math.PI * dayOfYear / 365);
    return (lightIntensity / 100) * solarConstant * seasonalVariation;
  };

  const calculatePhotoperiod = (day: number): number => {
    const dayOfYear = day % 365;
    const declination = 23.45 * Math.sin(2 * Math.PI * (284 + dayOfYear) / 365);
    const latitude = 28.6; // Assuming New Delhi latitude
    const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
    return (2 * hourAngle * 180 / Math.PI) / 15; // Convert to hours
  };

  const calculateUVIndex = (lightIntensity: number, day: number): number => {
    const baseUV = (lightIntensity / 100) * 11; // Scale to 0-11
    const seasonalFactor = 1 + 0.2 * Math.sin(2 * Math.PI * (day % 365) / 365);
    return Math.max(0, Math.min(11, baseUV * seasonalFactor));
  };

  // Weather event simulation
  useEffect(() => {
    const eventProbability = Math.random();
    
    if (eventProbability < 0.05) { // 5% chance of weather event
      const eventTypes: WeatherEvent['type'][] = ['rain', 'drought', 'heatwave', 'frost', 'storm'];
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const weatherEvents: Record<WeatherEvent['type'], Omit<WeatherEvent, 'type'>> = {
        rain: {
          intensity: 0.5 + Math.random() * 0.5,
          duration: 3 + Math.random() * 7,
          effects: { temperature: -3, humidity: 25, windSpeed: 2, lightIntensity: -10 }
        },
        drought: {
          intensity: 0.3 + Math.random() * 0.7,
          duration: 7 + Math.random() * 14,
          effects: { temperature: 5, humidity: -30, windSpeed: -1, lightIntensity: 5 }
        },
        heatwave: {
          intensity: 0.4 + Math.random() * 0.6,
          duration: 5 + Math.random() * 10,
          effects: { temperature: 8, humidity: -20, windSpeed: -2, lightIntensity: 10 }
        },
        frost: {
          intensity: 0.2 + Math.random() * 0.8,
          duration: 1 + Math.random() * 3,
          effects: { temperature: -8, humidity: 10, windSpeed: 1, lightIntensity: -5 }
        },
        storm: {
          intensity: 0.6 + Math.random() * 0.4,
          duration: 1 + Math.random() * 2,
          effects: { temperature: -5, humidity: 30, windSpeed: 15, lightIntensity: -20 }
        },
        normal: {
          intensity: 0,
          duration: 0,
          effects: { temperature: 0, humidity: 0, windSpeed: 0, lightIntensity: 0 }
        }
      };
      
      setActiveWeatherEvent({
        type: randomEvent,
        ...weatherEvents[randomEvent]
      });
      
      // Clear event after duration
      setTimeout(() => {
        setActiveWeatherEvent(null);
      }, weatherEvents[randomEvent].duration * 1000); // Convert to milliseconds for demo
    }
  }, [currentDay]);

  const getWeatherIcon = (event: WeatherEvent | null) => {
    if (!event) return <Sun className="w-6 h-6 text-yellow-500" />;
    
    switch (event.type) {
      case 'rain': return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'drought': return <Sun className="w-6 h-6 text-orange-500" />;
      case 'heatwave': return <Thermometer className="w-6 h-6 text-red-500" />;
      case 'frost': return <Cloud className="w-6 h-6 text-blue-300" />;
      case 'storm': return <Zap className="w-6 h-6 text-purple-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStressLevel = (value: number, min: number, max: number, optimal: number): string => {
    if (value < min || value > max) return 'Critical';
    if (Math.abs(value - optimal) <= optimal * 0.1) return 'Optimal';
    if (Math.abs(value - optimal) <= optimal * 0.2) return 'Good';
    return 'Moderate';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TreePine className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Environmental Engine</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {getWeatherIcon(activeWeatherEvent)}
          <span className="text-sm font-medium text-gray-600">
            {activeWeatherEvent ? `${activeWeatherEvent.type.charAt(0).toUpperCase() + activeWeatherEvent.type.slice(1)} Event` : 'Normal Conditions'}
          </span>
        </div>
      </div>

      {/* Current Environmental Conditions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Thermometer className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Temperature</span>
          </div>
          <div className="text-lg font-bold text-red-800">
            {environmentalConditions.temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-red-600">
            Soil: {environmentalConditions.soilTemperature.toFixed(1)}°C
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Humidity</span>
          </div>
          <div className="text-lg font-bold text-blue-800">
            {environmentalConditions.humidity.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-600">
            VPD: {environmentalConditions.vaporPressureDeficit.toFixed(2)} kPa
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Wind className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Wind Speed</span>
          </div>
          <div className="text-lg font-bold text-gray-800">
            {environmentalConditions.windSpeed.toFixed(1)} m/s
          </div>
          <div className="text-xs text-gray-600">
            At canopy level
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sun className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Solar Radiation</span>
          </div>
          <div className="text-lg font-bold text-yellow-800">
            {environmentalConditions.solarRadiation.toFixed(0)} W/m²
          </div>
          <div className="text-xs text-yellow-600">
            UV Index: {environmentalConditions.uvIndex.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Advanced Environmental Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Atmospheric Conditions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CO₂ Concentration</span>
              <span className="text-sm font-bold text-gray-800">
                {environmentalConditions.co2Concentration} ppm
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dew Point</span>
              <span className="text-sm font-bold text-gray-800">
                {environmentalConditions.dewPoint.toFixed(1)}°C
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Air Pressure</span>
              <span className="text-sm font-bold text-gray-800">
                {environmentalConditions.airPressure.toFixed(1)} hPa
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Photoperiod</span>
              <span className="text-sm font-bold text-gray-800">
                {environmentalConditions.photoperiod.toFixed(1)} hours
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Microclimate</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Canopy Temperature</span>
              <span className="text-sm font-bold text-gray-800">
                {microclimate.canopyTemperature.toFixed(1)}°C
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Soil Moisture</span>
              <span className="text-sm font-bold text-gray-800">
                {microclimate.soilMoisture.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Leaf Wetness</span>
              <span className="text-sm font-bold text-gray-800">
                {(microclimate.leafWetness * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wind at 2m</span>
              <span className="text-sm font-bold text-gray-800">
                {microclimate.windProfile[3]?.toFixed(1) || '0.0'} m/s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Stress Assessment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Environmental Stress Assessment</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { 
              param: 'Temperature', 
              value: environmentalConditions.temperature, 
              min: 15, 
              max: 35, 
              optimal: 25,
              unit: '°C'
            },
            { 
              param: 'Humidity', 
              value: environmentalConditions.humidity, 
              min: 40, 
              max: 80, 
              optimal: 60,
              unit: '%'
            },
            { 
              param: 'Wind Speed', 
              value: environmentalConditions.windSpeed, 
              min: 0.5, 
              max: 10, 
              optimal: 2,
              unit: 'm/s'
            },
            { 
              param: 'Solar Radiation', 
              value: environmentalConditions.solarRadiation, 
              min: 200, 
              max: 1200, 
              optimal: 600,
              unit: 'W/m²'
            }
          ].map((item, index) => {
            const stressLevel = getStressLevel(item.value, item.min, item.max, item.optimal);
            const stressColor = stressLevel === 'Optimal' ? 'text-green-600' :
                               stressLevel === 'Good' ? 'text-yellow-600' :
                               stressLevel === 'Moderate' ? 'text-orange-600' : 'text-red-600';
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.param}</div>
                  <div className="text-xs text-gray-500">
                    {item.value.toFixed(1)} {item.unit}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stressLevel === 'Critical' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-bold ${stressColor}`}>
                    {stressLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Weather Event Alert */}
      {activeWeatherEvent && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-bold text-yellow-800">Active Weather Event</span>
          </div>
          <div className="text-sm text-yellow-700">
            <strong>{activeWeatherEvent.type.charAt(0).toUpperCase() + activeWeatherEvent.type.slice(1)}</strong> event 
            with intensity {(activeWeatherEvent.intensity * 100).toFixed(0)}% affecting environmental conditions.
            Duration: {activeWeatherEvent.duration.toFixed(1)} hours.
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedEnvironmentalEngine;
