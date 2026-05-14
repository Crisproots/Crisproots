import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Maximize2,
  Grid3X3,
  Settings,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AdvancedCropSimulation from './AdvancedCropSimulation';
import PlantPhysiologyMonitor from './PlantPhysiologyMonitor';
import AdvancedEnvironmentalEngine from './AdvancedEnvironmentalEngine';

interface CropSimulationDashboardProps {
  selectedCrop: string;
  parameters: {
    temperature: number;
    fertilizer: number;
    water: number;
    humidity: number;
    windSpeed: number;
    soilPh: number;
    soilNitrogen: number;
    soilOrganicMatter: number;
  };
  currentDay: number;
  isRunning: boolean;
  currentStage: {
    code: string;
    stage: {
      name: string;
      description: string;
    };
  } | null;
}

interface DashboardState {
  activeView: '3d' | 'physiology' | 'environment' | 'combined';
  showAdvancedControls: boolean;
  simulationSpeed: number;
  viewSettings: {
    show3D: boolean;
    showPhysiology: boolean;
    showEnvironment: boolean;
    compactMode: boolean;
  };
}

const CropSimulationDashboard: React.FC<CropSimulationDashboardProps> = ({
  selectedCrop,
  parameters,
  currentDay,
  isRunning,
  currentStage
}) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    activeView: 'combined',
    showAdvancedControls: false,
    simulationSpeed: 1,
    viewSettings: {
      show3D: true,
      showPhysiology: true,
      showEnvironment: true,
      compactMode: false
    }
  });

  const [plantPhysiology, setPlantPhysiology] = useState({
    biomass: 0.1,
    leafAreaIndex: 0,
    photosynthesisRate: 0,
    respirationRate: 0,
    transpiration: 0,
    rootMass: 0.05,
    stemMass: 0.03,
    leafMass: 0.02,
    fruitMass: 0,
    waterUptake: 0,
    nutrientUptake: 0,
    stressFactors: {
      water: 1.0,
      nitrogen: 1.0,
      temperature: 1.0,
      light: 1.0,
      disease: 1.0
    }
  });

  const [plantMorphology, setPlantMorphology] = useState({
    height: 1,
    leafCount: 0,
    stemDiameter: 0.5,
    rootDepth: 0.5,
    rootSpread: 0.3,
    branchCount: 0,
    flowerCount: 0,
    fruitCount: 0,
    leafSize: 0,
    internodeLength: 0.5
  });

  const [performanceMetrics] = useState({
    renderTime: 0,
    simulationFPS: 60,
    memoryUsage: 0,
    dataPoints: 0
  });

  const calculateWaterStress = useCallback((): number => {
    return Math.min(1, Math.max(0.1, parameters.water / 80));
  }, [parameters.water]);

  const calculateNitrogenStress = useCallback((): number => {
    return Math.min(1, Math.max(0.1, parameters.fertilizer / 100));
  }, [parameters.fertilizer]);

  const calculateTemperatureStress = useCallback((): number => {
    const optimal = 25;
    const distance = Math.abs(parameters.temperature - optimal);
    return Math.max(0.1, 1 - (distance / 20));
  }, [parameters.temperature]);

  const calculateOverallStress = useCallback((): number => {
    const waterStress = calculateWaterStress();
    const nitrogenStress = calculateNitrogenStress();
    const tempStress = calculateTemperatureStress();
    return (waterStress + nitrogenStress + tempStress) / 3;
  }, [calculateWaterStress, calculateNitrogenStress, calculateTemperatureStress]);

  // Update plant data based on current simulation state
  const updatePlantData = useCallback(() => {
    // Simplified plant data calculation for dashboard
    const dayProgress = currentDay / 150; // Assuming 150 days for full growth
    const stressMultiplier = calculateOverallStress();
    
    setPlantPhysiology(prev => ({
      ...prev,
      biomass: dayProgress * 1000 * stressMultiplier,
      leafAreaIndex: Math.min(6, dayProgress * 8 * stressMultiplier),
      photosynthesisRate: Math.max(0, 30 * stressMultiplier * (parameters.temperature > 10 ? 1 : 0)),
      respirationRate: 5 + (parameters.temperature - 20) * 0.2,
      transpiration: Math.max(0, 10 * stressMultiplier * (parameters.humidity < 80 ? 1 : 0.5)),
      stressFactors: {
        water: calculateWaterStress(),
        nitrogen: calculateNitrogenStress(),
        temperature: calculateTemperatureStress(),
        light: 0.8 + Math.random() * 0.2,
        disease: 0.9 + Math.random() * 0.1
      }
    }));

    setPlantMorphology(prev => ({
      ...prev,
      height: dayProgress * getMaxHeight(selectedCrop) * stressMultiplier,
      leafCount: Math.floor(dayProgress * 20 * stressMultiplier),
      rootDepth: dayProgress * 50 * stressMultiplier,
      flowerCount: currentDay > 60 ? Math.floor((currentDay - 60) * 0.5 * stressMultiplier) : 0,
      fruitCount: currentDay > 90 ? Math.floor((currentDay - 90) * 0.3 * stressMultiplier) : 0
    }));
  }, [currentDay, selectedCrop, calculateOverallStress, calculateWaterStress, calculateNitrogenStress, calculateTemperatureStress, parameters.temperature, parameters.humidity]);

  useEffect(() => {
    updatePlantData();
  }, [updatePlantData]);

  const getMaxHeight = (crop: string): number => {
    const heights: Record<string, number> = {
      wheat: 120,
      rice: 150,
      tomato: 200,
      cotton: 180,
      maize: 250
    };
    return heights[crop] || 150;
  };

  const handleViewChange = (view: DashboardState['activeView']) => {
    setDashboardState(prev => ({ ...prev, activeView: view }));
  };

  const toggleAdvancedControls = () => {
    setDashboardState(prev => ({ 
      ...prev, 
      showAdvancedControls: !prev.showAdvancedControls 
    }));
  };

  const updateViewSettings = (setting: keyof DashboardState['viewSettings'], value: boolean) => {
    setDashboardState(prev => ({
      ...prev,
      viewSettings: {
        ...prev.viewSettings,
        [setting]: value
      }
    }));
  };

  const renderViewControls = () => (
    <div className="flex items-center space-x-2 mb-4">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {[
          { key: '3d', label: '3D View', icon: <Maximize2 className="w-4 h-4" /> },
          { key: 'physiology', label: 'Physiology', icon: <Activity className="w-4 h-4" /> },
          { key: 'environment', label: 'Environment', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'combined', label: 'Combined', icon: <Grid3X3 className="w-4 h-4" /> }
        ].map((view) => (
          <button
            key={view.key}
            onClick={() => handleViewChange(view.key as DashboardState['activeView'])}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
              dashboardState.activeView === view.key
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {view.icon}
            <span className="hidden md:inline">{view.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={toggleAdvancedControls}
        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-600 hover:bg-gray-200"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden md:inline">Controls</span>
        {dashboardState.showAdvancedControls ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
        }
      </button>
    </div>
  );

  const renderAdvancedControls = () => {
    if (!dashboardState.showAdvancedControls) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Advanced Controls</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(dashboardState.viewSettings).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateViewSettings(key as keyof DashboardState['viewSettings'], e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-700 mb-2 block">Simulation Speed</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={dashboardState.simulationSpeed}
            onChange={(e) => setDashboardState(prev => ({ 
              ...prev, 
              simulationSpeed: parseFloat(e.target.value) 
            }))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">
            {dashboardState.simulationSpeed}x speed
          </div>
        </div>
      </div>
    );
  };

  const renderPerformanceMetrics = () => (
    <div className="bg-gray-50 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-800">Performance</span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div>
          <div className="text-gray-600">Render Time</div>
          <div className="font-bold text-green-600">{performanceMetrics.renderTime}ms</div>
        </div>
        <div>
          <div className="text-gray-600">Simulation FPS</div>
          <div className="font-bold text-blue-600">{performanceMetrics.simulationFPS}</div>
        </div>
        <div>
          <div className="text-gray-600">Memory</div>
          <div className="font-bold text-purple-600">{performanceMetrics.memoryUsage}MB</div>
        </div>
        <div>
          <div className="text-gray-600">Data Points</div>
          <div className="font-bold text-orange-600">{performanceMetrics.dataPoints}</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (dashboardState.activeView) {
      case '3d':
        return (
          <AdvancedCropSimulation
            cropType={selectedCrop}
            parameters={{
              ...parameters,
              lightIntensity: 25,
              co2Level: 410
            }}
            currentDay={currentDay}
            isRunning={isRunning}
            weatherData={undefined}
          />
        );

      case 'physiology':
        return (
          <PlantPhysiologyMonitor
            plantPhysiology={plantPhysiology}
            plantMorphology={plantMorphology}
            currentDay={currentDay}
            cropType={selectedCrop}
          />
        );

      case 'environment':
        return (
          <AdvancedEnvironmentalEngine
            parameters={{
              ...parameters,
              lightIntensity: 25,
              co2Level: 410
            }}
            currentDay={currentDay}
          />
        );

      case 'combined':
      default:
        return (
          <div className="space-y-6">
            {dashboardState.viewSettings.show3D && (
              <AdvancedCropSimulation
                cropType={selectedCrop}
                parameters={{
                  ...parameters,
                  lightIntensity: 25,
                  co2Level: 410
                }}
                currentDay={currentDay}
                isRunning={isRunning}
                weatherData={undefined}
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardState.viewSettings.showPhysiology && (
                <PlantPhysiologyMonitor
                  plantPhysiology={plantPhysiology}
                  plantMorphology={plantMorphology}
                  currentDay={currentDay}
                  cropType={selectedCrop}
                />
              )}
              
              {dashboardState.viewSettings.showEnvironment && (
                <AdvancedEnvironmentalEngine
                  parameters={{
                    ...parameters,
                    lightIntensity: 25,
                    co2Level: 410
                  }}
                  currentDay={currentDay}
                />
              )}
            </div>
          </div>
        );
    }
  };

  if (!selectedCrop) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Advanced Simulation Dashboard</h3>
        <p className="text-gray-600 mb-4">
          Select a crop to access the enhanced 3D simulation with advanced plant physiology and environmental modeling.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-blue-800 mb-2">Features Include:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Realistic 3D plant growth visualization</li>
            <li>• Advanced physiological process monitoring</li>
            <li>• Environmental stress factor analysis</li>
            <li>• Real-time biomass and growth calculations</li>
            <li>• Interactive weather and climate simulation</li>
            <li>• BBCH-accurate crop development stages</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Advanced Crop Simulation Dashboard</h2>
          <p className="text-sm text-gray-600">
            {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} • Day {currentDay} • 
            {isRunning ? ' Running' : ' Paused'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-gray-600">
            {isRunning ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {renderViewControls()}
      {renderAdvancedControls()}
      {renderPerformanceMetrics()}
      {renderContent()}
    </div>
  );
};

export default CropSimulationDashboard;
