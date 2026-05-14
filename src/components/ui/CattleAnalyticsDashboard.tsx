"use client";

import React, { useState, useMemo } from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatUtils';
import { 
  TrendingUp, 
  DollarSign,
  Target,
  AlertTriangle,
  Heart,
  Droplets,
  Download,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  milkProduction: {
    daily: number[];
    monthly: number[];
    labels: string[];
  };
  healthMetrics: {
    vaccinationRate: number;
    diseaseIncidence: number;
    treatmentCosts: number;
  };
  breedingMetrics: {
    pregnancyRate: number;
    calvingInterval: number;
    fertilityRate: number;
  };
  economicMetrics: {
    profitPerAnimal: number;
    feedCostPerAnimal: number;
    roiPercentage: number;
    totalRevenue: number;
  };
  predictions: {
    nextMonthMilk: number;
    expectedCalvings: number;
    potentialIssues: Array<{
      type: string;
      severity: 'Low' | 'Medium' | 'High';
      message: string;
    }>;
  };
}

const CattleAnalyticsDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Sample analytics data
  const analyticsData: AnalyticsData = useMemo(() => {
    return {
      milkProduction: {
        daily: [28, 30, 27, 32, 29, 31, 28, 33, 30, 29, 31, 32, 28, 30, 31],
        monthly: [850, 920, 880, 960, 890, 940, 870, 980, 920, 890, 950, 960],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      healthMetrics: {
        vaccinationRate: 95,
        diseaseIncidence: 3.2,
        treatmentCosts: 15000
      },
      breedingMetrics: {
        pregnancyRate: 85,
        calvingInterval: 385,
        fertilityRate: 78
      },
      economicMetrics: {
        profitPerAnimal: 45000,
        feedCostPerAnimal: 18000,
        roiPercentage: 22.5,
        totalRevenue: 2850000
      },
      predictions: {
        nextMonthMilk: 975,
        expectedCalvings: 8,
        potentialIssues: [
          { type: 'Health', severity: 'Medium', message: '3 animals due for vaccination' },
          { type: 'Breeding', severity: 'Low', message: 'Monitor pregnancy status for 2 animals' },
          { type: 'Production', severity: 'High', message: 'Milk production trending down 5%' }
        ]
      }
    };
  }, []);

  const renderMilkProductionChart = () => {
    const data = analyticsData.milkProduction.monthly;
    const maxValue = Math.max(...data);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Milk Production Trends</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">+8.5% vs last period</span>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg w-full transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${(value / maxValue) * 200}px` }}
              />
              <div className="text-xs text-gray-600 mt-2 text-center">
                {analyticsData.milkProduction.labels[index]}
              </div>
              <div className="text-xs font-semibold text-gray-800">
                {value}L
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    change: number,
    icon: React.ElementType,
    color: string,
    suffix?: string
  ) => {
    const Icon = icon;
    const isPositive = change >= 0;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? formatNumber(value) : value}
              {suffix && <span className="text-lg text-gray-600 ml-1">{suffix}</span>}
            </p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
          <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const renderHealthBreakdown = () => {
    const healthData = [
      { label: 'Healthy', value: 85, color: 'bg-green-500' },
      { label: 'Under Treatment', value: 8, color: 'bg-yellow-500' },
      { label: 'Recovering', value: 5, color: 'bg-blue-500' },
      { label: 'Critical', value: 2, color: 'bg-red-500' }
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Herd Health Breakdown</h3>
        <div className="space-y-4">
          {healthData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPredictiveInsights = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Zap className="w-6 h-6 text-yellow-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">AI Predictive Insights</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Next Month Forecast</h4>
            <p className="text-sm text-blue-800">
              Expected milk production: <span className="font-bold">{analyticsData.predictions.nextMonthMilk}L</span>
            </p>
            <p className="text-sm text-blue-800">
              Expected calvings: <span className="font-bold">{analyticsData.predictions.expectedCalvings} animals</span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
            {analyticsData.predictions.potentialIssues.map((issue, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  issue.severity === 'High' ? 'bg-red-50 border-red-200' :
                  issue.severity === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className={`w-4 h-4 mr-2 ${
                    issue.severity === 'High' ? 'text-red-600' :
                    issue.severity === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{issue.type}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBreedingAnalytics = () => {
    const breedingMetrics = [
      { label: 'Pregnancy Rate', value: analyticsData.breedingMetrics.pregnancyRate, target: 90, unit: '%' },
      { label: 'Calving Interval', value: analyticsData.breedingMetrics.calvingInterval, target: 365, unit: ' days' },
      { label: 'Fertility Rate', value: analyticsData.breedingMetrics.fertilityRate, target: 85, unit: '%' }
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Breeding Performance</h3>
        <div className="space-y-6">
          {breedingMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{metric.value}{metric.unit}</span>
                  <div className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    metric.value >= metric.target ? 'bg-green-500' : 
                    metric.value >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Advanced cattle farm performance insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderMetricCard(
            'Total Revenue',
            analyticsData.economicMetrics.totalRevenue,
            12.5,
            DollarSign,
            'from-green-500 to-green-600',
            ''
          )}
          {renderMetricCard(
            'Avg Milk Production',
            920,
            8.2,
            Droplets,
            'from-blue-500 to-blue-600',
            'L/month'
          )}
          {renderMetricCard(
            'Herd Health Score',
            92,
            5.1,
            Heart,
            'from-red-500 to-pink-600',
            '%'
          )}
          {renderMetricCard(
            'ROI',
            analyticsData.economicMetrics.roiPercentage,
            3.7,
            Target,
            'from-purple-500 to-purple-600',
            '%'
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderMilkProductionChart()}
          {renderHealthBreakdown()}
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderBreedingAnalytics()}
          {renderPredictiveInsights()}
        </div>

        {/* Economic Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Profit per Animal</h4>
              <p className="text-2xl font-bold text-green-700">₹{formatCurrency(analyticsData.economicMetrics.profitPerAnimal)}</p>
              <p className="text-sm text-green-600 mt-1">+15% from last year</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Feed Cost per Animal</h4>
              <p className="text-2xl font-bold text-blue-700">₹{formatCurrency(analyticsData.economicMetrics.feedCostPerAnimal)}</p>
              <p className="text-sm text-blue-600 mt-1">-8% optimization achieved</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Treatment Costs</h4>
              <p className="text-2xl font-bold text-purple-700">₹{formatCurrency(analyticsData.healthMetrics.treatmentCosts)}</p>
              <p className="text-sm text-purple-600 mt-1">-12% through prevention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CattleAnalyticsDashboard;
