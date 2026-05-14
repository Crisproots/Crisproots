"use client";

import React from 'react';
import { 
  MapPin, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

const indianStates = [
  { name: 'Punjab', crops: ['Wheat', 'Rice', 'Cotton'], farmers: '12,000+' },
  { name: 'Haryana', crops: ['Wheat', 'Rice', 'Sugarcane'], farmers: '8,500+' },
  { name: 'Uttar Pradesh', crops: ['Wheat', 'Rice', 'Potato'], farmers: '25,000+' },
  { name: 'Rajasthan', crops: ['Bajra', 'Jowar', 'Mustard'], farmers: '15,000+' },
  { name: 'Gujarat', crops: ['Cotton', 'Groundnut', 'Wheat'], farmers: '18,000+' },
  { name: 'Maharashtra', crops: ['Cotton', 'Sugarcane', 'Soybean'], farmers: '22,000+' }
];

const cropCalendar = [
  { season: 'Kharif', months: 'Jun-Oct', crops: ['Rice', 'Cotton', 'Sugarcane'], color: 'bg-green-500' },
  { season: 'Rabi', months: 'Oct-Mar', crops: ['Wheat', 'Barley', 'Mustard'], color: 'bg-yellow-500' },
  { season: 'Zaid', months: 'Mar-Jun', crops: ['Watermelon', 'Fodder', 'Vegetables'], color: 'bg-blue-500' }
];

const regionalFeatures = [
  {
    title: 'Multi-Language Support',
    description: 'Available in Hindi, English, and 12 regional Indian languages',
    icon: MapPin,
    stats: '15 Languages'
  },
  {
    title: 'Indian Weather Integration',
    description: 'Real-time data from IMD (Indian Meteorological Department)',
    icon: CloudRain,
    stats: '500+ Weather Stations'
  },
  {
    title: 'Mandi Price Integration',
    description: 'Live prices from APMC mandis across India',
    icon: TrendingUp,
    stats: '2,500+ Markets'
  },
  {
    title: 'Crop Insurance Support',
    description: 'Integration with PM Fasal Bima Yojana',
    icon: CheckCircle,
    stats: 'Government Backed'
  }
];

const IndianFarmingFeatures: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-6">
            <Leaf className="w-4 h-4 mr-2" />
            भारतीय कृषि के लिए विशेष सुविधाएं (Special Features for Indian Agriculture)
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Designed for <span className="text-orange-600">Indian Farmers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform understands the unique challenges of Indian agriculture - from monsoon patterns 
            to regional crop varieties, from APMC regulations to government schemes.
          </p>
        </div>

        {/* Regional Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {regionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                    {feature.stats}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* State Coverage */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pan-India Coverage
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indianStates.map((state, index) => (
              <div
                key={state.name}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{state.name}</h4>
                  <div className="text-sm text-green-600 font-medium">{state.farmers}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Primary Crops:</div>
                  <div className="flex flex-wrap gap-1">
                    {state.crops.map((crop, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Calendar */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Indian Crop Calendar Integration
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {cropCalendar.map((season, index) => (
              <div
                key={season.season}
                className="relative bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${season.color} rounded-t-2xl`}></div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-gray-900">{season.season}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {season.months}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Main Crops:</div>
                    <div className="space-y-1">
                      {season.crops.map((crop, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <div className={`w-2 h-2 ${season.color} rounded-full mr-2`}></div>
                          {crop}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
              <Target className="w-4 h-4 mr-2" />
              Automated season-based recommendations and alerts
            </div>
          </div>
        </div>

        {/* Government Integration */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Government Scheme Integration
              </h3>
              <p className="text-green-100 mb-6 leading-relaxed">
                Seamlessly integrated with major government farming schemes and initiatives 
                for maximum farmer benefit and subsidy utilization.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>PM Fasal Bima Yojana Integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>Kisan Credit Card Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>PM-KISAN Beneficiary Tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>Soil Health Card Integration</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">₹15,000 Cr+</div>
                <div className="text-green-200 font-medium mb-4">Government Benefits Facilitated</div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">5.5L+</div>
                    <div className="text-green-200">Insurance Claims</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">12L+</div>
                    <div className="text-green-200">Subsidies Availed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndianFarmingFeatures;
