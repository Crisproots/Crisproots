import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Thermometer, Droplets, Wind, Eye, BarChart3, Zap, RefreshCw } from 'lucide-react';
import weatherService, { WeatherData } from '../services/weatherService';
import soilGridsService, { SoilData } from '../services/soilGridsService';

interface SuitabilityAnalysis {
  score: number;
  factors: {
    pH: { score: number; optimal: string; current: number };
    nitrogen: { score: number; optimal: string; current: number };
    texture: { score: number; optimal: string; current: string };
    organicMatter: { score: number; optimal: string; current: number };
  };
}

interface RealDataIntegrationProps {
  latitude: number;
  longitude: number;
  selectedCrop: string;
  onDataUpdate: (data: {
    weather: WeatherData;
    soil: SoilData | null;
    suitabilityScore: number;
  }) => void;
}

const RealDataIntegration: React.FC<RealDataIntegrationProps> = ({
  latitude,
  longitude,
  selectedCrop,
  onDataUpdate
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suitabilityAnalysis, setSuitabilityAnalysis] = useState<SuitabilityAnalysis | null>(null);

  const fetchRealData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch weather data
      const weather = await weatherService.getCurrentWeather(`${latitude},${longitude}`);
      setWeatherData(weather);

      // Fetch soil data
      const soil = await soilGridsService.getSoilData(latitude, longitude);
      setSoilData(soil);

      // Calculate suitability
      if (soil && selectedCrop) {
        const suitability = soilGridsService.getSoilSuitabilityScore(soil, selectedCrop);
        setSuitabilityAnalysis(suitability);
        
        // Pass data to parent component
        onDataUpdate({
          weather,
          soil,
          suitabilityScore: suitability.score
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch real data');
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, selectedCrop, onDataUpdate]);

  useEffect(() => {
    if (latitude && longitude) {
      fetchRealData();
    }
  }, [latitude, longitude, selectedCrop, fetchRealData]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Fetching real-time data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-red-700 font-medium">Error: {error}</span>
        </div>
        <button
          onClick={fetchRealData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weather Data Card */}
      {weatherData && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Live Weather Data
            </h3>
            <span className="text-sm opacity-90">
              {weatherData.location.name}, {weatherData.location.region}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm font-medium">Temperature</span>
              </div>
              <div className="text-2xl font-bold">{weatherData.current.temp_c}°C</div>
              <div className="text-xs opacity-80">Feels like {weatherData.current.feelslike_c}°C</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <div className="text-2xl font-bold">{weatherData.current.humidity}%</div>
              <div className="text-xs opacity-80">Precipitation: {weatherData.current.precip_mm}mm</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Wind className="w-4 h-4" />
                <span className="text-sm font-medium">Wind</span>
              </div>
              <div className="text-2xl font-bold">{weatherData.current.wind_kph}</div>
              <div className="text-xs opacity-80">km/h</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">UV Index</span>
              </div>
              <div className="text-2xl font-bold">{weatherData.current.uv}</div>
              <div className="text-xs opacity-80">
                {weatherData.current.uv <= 2 ? 'Low' : 
                 weatherData.current.uv <= 5 ? 'Moderate' : 
                 weatherData.current.uv <= 7 ? 'High' : 'Very High'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soil Data Card */}
      {soilData && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Soil Analysis (SoilGrids Data)
            </h3>
            <span className="text-sm opacity-90">Depth: 0-5cm</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm font-medium mb-1">pH Level</div>
              <div className="text-2xl font-bold">{soilData.pH.toFixed(1)}</div>
              <div className="text-xs opacity-80">
                {soilData.pH < 6.5 ? 'Acidic' : soilData.pH > 7.5 ? 'Alkaline' : 'Neutral'}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm font-medium mb-1">Nitrogen</div>
              <div className="text-2xl font-bold">{soilData.nitrogen.toFixed(0)}</div>
              <div className="text-xs opacity-80">mg/kg</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm font-medium mb-1">Organic Matter</div>
              <div className="text-2xl font-bold">{soilData.organicCarbon.toFixed(1)}</div>
              <div className="text-xs opacity-80">%</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm font-medium mb-1">Texture</div>
              <div className="text-lg font-bold">{soilData.soilTexture.textureClass}</div>
              <div className="text-xs opacity-80">
                S:{soilData.soilTexture.sand.toFixed(0)}% 
                Si:{soilData.soilTexture.silt.toFixed(0)}% 
                C:{soilData.soilTexture.clay.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Soil composition visual */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="text-sm font-medium mb-2">Soil Composition</div>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div 
                className="bg-yellow-300" 
                style={{ width: `${soilData.soilTexture.sand}%` }}
                title={`Sand: ${soilData.soilTexture.sand.toFixed(1)}%`}
              ></div>
              <div 
                className="bg-orange-400" 
                style={{ width: `${soilData.soilTexture.silt}%` }}
                title={`Silt: ${soilData.soilTexture.silt.toFixed(1)}%`}
              ></div>
              <div 
                className="bg-red-500" 
                style={{ width: `${soilData.soilTexture.clay}%` }}
                title={`Clay: ${soilData.soilTexture.clay.toFixed(1)}%`}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1 opacity-80">
              <span>Sand</span>
              <span>Silt</span>
              <span>Clay</span>
            </div>
          </div>
        </div>
      )}

      {/* Suitability Analysis */}
      {suitabilityAnalysis && selectedCrop && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Crop Suitability Analysis
            </h3>
            <div className="text-right">
              <div className="text-3xl font-bold">{suitabilityAnalysis.score}%</div>
              <div className="text-sm opacity-90">
                {suitabilityAnalysis.score >= 80 ? 'Excellent' :
                 suitabilityAnalysis.score >= 60 ? 'Good' :
                 suitabilityAnalysis.score >= 40 ? 'Fair' : 'Poor'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(suitabilityAnalysis.factors).map(([factor, data]) => (
              <div key={factor} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-sm font-medium mb-1 capitalize">{factor}</div>
                <div className="text-lg font-bold">{data.score}%</div>
                <div className="text-xs opacity-80">
                  Optimal: {data.optimal}
                </div>
                <div className="text-xs opacity-80">
                  Current: {data.current}
                </div>
                <div className="w-full bg-white/30 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-white rounded-full h-1.5 transition-all duration-300"
                    style={{ width: `${Math.min(data.score, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {suitabilityAnalysis.score < 60 && (
            <div className="mt-4 p-3 bg-yellow-500/30 rounded-lg">
              <div className="text-sm font-medium">⚠️ Improvement Recommendations:</div>
              <ul className="text-xs mt-1 space-y-1 opacity-90">
                {suitabilityAnalysis.factors.pH.score < 60 && (
                  <li>• Adjust soil pH using lime or sulfur</li>
                )}
                {suitabilityAnalysis.factors.nitrogen.score < 60 && (
                  <li>• Apply nitrogen-rich fertilizer or compost</li>
                )}
                {suitabilityAnalysis.factors.organicMatter.score < 60 && (
                  <li>• Add organic matter through compost or manure</li>
                )}
                {suitabilityAnalysis.factors.texture.score < 60 && (
                  <li>• Consider soil amendments to improve texture</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={fetchRealData}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Real Data</span>
        </button>
      </div>
    </div>
  );
};

export default RealDataIntegration;
