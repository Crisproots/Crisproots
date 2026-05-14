import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PlantPhysiologyMonitorProps {
  plantPhysiology: {
    biomass: number;
    leafAreaIndex: number;
    photosynthesisRate: number;
    respirationRate: number;
    transpiration: number;
    rootMass: number;
    stemMass: number;
    leafMass: number;
    fruitMass: number;
    waterUptake: number;
    nutrientUptake: number;
    stressFactors: {
      water: number;
      nitrogen: number;
      temperature: number;
      light: number;
      disease: number;
    };
  };
  plantMorphology: {
    height: number;
    leafCount: number;
    stemDiameter: number;
    rootDepth: number;
    rootSpread: number;
    branchCount: number;
    flowerCount: number;
    fruitCount: number;
    leafSize: number;
    internodeLength: number;
  };
  currentDay: number;
  cropType: string;
}

interface GrowthMetrics {
  dailyGrowthRate: number;
  biomassAccumulation: number;
  waterUseEfficiency: number;
  photosynthesisEfficiency: number;
  stressIndex: number;
  developmentIndex: number;
}

const PlantPhysiologyMonitor: React.FC<PlantPhysiologyMonitorProps> = ({
  plantPhysiology,
  plantMorphology,
  currentDay,
  cropType
}) => {
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>({
    dailyGrowthRate: 0,
    biomassAccumulation: 0,
    waterUseEfficiency: 0,
    photosynthesisEfficiency: 0,
    stressIndex: 0,
    developmentIndex: 0
  });

  const [historicalData, setHistoricalData] = useState<Array<{
    day: number;
    biomass: number;
    height: number;
    lai: number;
    stress: number;
  }>>([]);

  // Calculate advanced growth metrics
  useEffect(() => {
    const overallStress = Object.values(plantPhysiology.stressFactors).reduce((sum, factor) => sum + factor, 0) / 5;
    const netPhotosynthesis = Math.max(0, plantPhysiology.photosynthesisRate - plantPhysiology.respirationRate);
    
    const newMetrics: GrowthMetrics = {
      dailyGrowthRate: (plantMorphology.height / Math.max(1, currentDay)) * 100,
      biomassAccumulation: plantPhysiology.biomass,
      waterUseEfficiency: plantPhysiology.photosynthesisRate / Math.max(0.1, plantPhysiology.transpiration),
      photosynthesisEfficiency: netPhotosynthesis / Math.max(0.1, plantPhysiology.leafAreaIndex),
      stressIndex: (1 - overallStress) * 100,
      developmentIndex: (currentDay / getExpectedMaturityDays(cropType)) * 100
    };
    
    setGrowthMetrics(newMetrics);
    
    // Update historical data
    setHistoricalData(prev => {
      const newData = [...prev, {
        day: currentDay,
        biomass: plantPhysiology.biomass,
        height: plantMorphology.height,
        lai: plantPhysiology.leafAreaIndex,
        stress: overallStress
      }];
      
      // Keep only last 30 days
      return newData.slice(-30);
    });
  }, [plantPhysiology, plantMorphology, currentDay, cropType]);

  const getExpectedMaturityDays = (crop: string): number => {
    const maturityDays: Record<string, number> = {
      wheat: 152,
      rice: 135,
      tomato: 199,
      cotton: 180,
      maize: 140
    };
    return maturityDays[crop] || 150;
  };

  const getStressLevel = (value: number): { level: string; color: string; icon: React.ReactNode } => {
    if (value >= 0.8) return { level: 'Optimal', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
    if (value >= 0.6) return { level: 'Good', color: 'text-yellow-600', icon: <Info className="w-4 h-4" /> };
    if (value >= 0.4) return { level: 'Stressed', color: 'text-orange-600', icon: <AlertTriangle className="w-4 h-4" /> };
    return { level: 'Critical', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
  };

  const formatValue = (value: number, decimals: number = 1): string => {
    return value.toFixed(decimals);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Plant Physiology Monitor</h2>
      </div>

      {/* Key Growth Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Daily Growth Rate</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-green-800">
            {formatValue(growthMetrics.dailyGrowthRate)} cm/day
          </div>
          <div className="text-xs text-green-600 mt-1">
            Height progression
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Water Use Efficiency</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-blue-800">
            {formatValue(growthMetrics.waterUseEfficiency, 2)}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Photosynthesis/Transpiration
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Development Index</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold text-purple-800">
            {formatValue(growthMetrics.developmentIndex)}%
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Progress to maturity
          </div>
        </div>
      </div>

      {/* Biomass Distribution */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Biomass Distribution</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Root Mass', value: plantPhysiology.rootMass, color: 'bg-amber-500' },
            { label: 'Stem Mass', value: plantPhysiology.stemMass, color: 'bg-green-500' },
            { label: 'Leaf Mass', value: plantPhysiology.leafMass, color: 'bg-emerald-500' },
            { label: 'Fruit Mass', value: plantPhysiology.fruitMass, color: 'bg-red-500' }
          ].map((item, index) => {
            const percentage = (item.value / plantPhysiology.biomass) * 100;
            return (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {formatValue(percentage)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatValue(item.value)} g
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physiological Processes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Physiological Processes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">Photosynthesis Rate</span>
              <span className="text-sm font-bold text-green-800">
                {formatValue(plantPhysiology.photosynthesisRate)} μmol/m²/s
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-700">Respiration Rate</span>
              <span className="text-sm font-bold text-red-800">
                {formatValue(plantPhysiology.respirationRate)} μmol/m²/s
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">Transpiration</span>
              <span className="text-sm font-bold text-blue-800">
                {formatValue(plantPhysiology.transpiration)} mmol/m²/s
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
              <span className="text-sm font-medium text-cyan-700">Water Uptake</span>
              <span className="text-sm font-bold text-cyan-800">
                {formatValue(plantPhysiology.waterUptake)} L/day
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-700">Nutrient Uptake</span>
              <span className="text-sm font-bold text-yellow-800">
                {formatValue(plantPhysiology.nutrientUptake)} g/day
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-700">Leaf Area Index</span>
              <span className="text-sm font-bold text-purple-800">
                {formatValue(plantPhysiology.leafAreaIndex, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stress Factor Analysis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Stress Factor Analysis</h3>
        <div className="space-y-3">
          {Object.entries(plantPhysiology.stressFactors).map(([factor, value]) => {
            const stressInfo = getStressLevel(value);
            return (
              <div key={factor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {stressInfo.icon}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {factor} Stress
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        value >= 0.8 ? 'bg-green-500' :
                        value >= 0.6 ? 'bg-yellow-500' :
                        value >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${stressInfo.color}`}>
                    {stressInfo.level}
                  </span>
                  <span className="text-xs text-gray-600">
                    ({(value * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth Trend Visualization */}
      {historicalData.length > 5 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Growth Trends (Last 30 Days)</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-600 mb-1">Biomass Trend</div>
              <div className="text-lg font-bold text-green-600">
                +{formatValue((historicalData[historicalData.length - 1]?.biomass || 0) - (historicalData[0]?.biomass || 0))} g
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-600 mb-1">Height Trend</div>
              <div className="text-lg font-bold text-blue-600">
                +{formatValue((historicalData[historicalData.length - 1]?.height || 0) - (historicalData[0]?.height || 0))} cm
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-600 mb-1">LAI Trend</div>
              <div className="text-lg font-bold text-purple-600">
                +{formatValue((historicalData[historicalData.length - 1]?.lai || 0) - (historicalData[0]?.lai || 0), 2)}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-600 mb-1">Avg Stress</div>
              <div className="text-lg font-bold text-orange-600">
                {formatValue(historicalData.reduce((sum, day) => sum + day.stress, 0) / historicalData.length * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantPhysiologyMonitor;
