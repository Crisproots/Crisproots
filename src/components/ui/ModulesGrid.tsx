"use client";

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  Brain,
  Heart,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react';

const modules = [
  {
    id: 'aigardenadvisor',
    name: 'AI Garden Advisor',
    hindiName: 'AI बगीचा सलाहकार',
    description: 'Get intelligent, AI-powered advice for your garden and crops with personalized recommendations tailored for Indian farming conditions.',
    icon: Brain,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    iconColor: 'text-green-600',
    features: ['Smart Plant Care', 'Disease Detection', 'Growth Optimization'],
    popular: true,
    new: false
  },
  {
    id: 'cropsimulation',
    name: 'Advanced Crop Simulation',
    hindiName: 'उन्नत फसल सिमुलेशन',
    description: 'Comprehensive crop growth simulation with Indian weather data, soil conditions, and regional farming practices.',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    iconColor: 'text-blue-600',
    features: ['Weather Integration', 'Yield Prediction', 'Risk Analysis', 'BBCH Stages'],
    popular: false,
    new: true
  },
  {
    id: 'cattlefarmmanagement',
    name: 'Cattle Management',
    hindiName: 'पशु प्रबंधन',
    description: 'Complete cattle farm operations management with health tracking, breeding records, and feed optimization for Indian breeds.',
    icon: Heart,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    iconColor: 'text-amber-600',
    features: ['Health Monitoring', 'Feed Management', 'Breeding Records', 'Milk Production'],
    popular: true,
    new: false
  },
  {
    id: 'greenguardian/dashboard',
    name: 'Green Guardian',
    hindiName: 'हरित संरक्षक',
    description: 'Satellite-based environmental monitoring with real-time alerts for pest control, weather warnings, and crop health.',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
    iconColor: 'text-purple-600',
    features: ['Satellite Imagery', 'Risk Alerts', 'Environmental Data', 'Pest Detection'],
    popular: false,
    new: true
  },
  {
    id: 'demandanalysis',
    name: 'Market Intelligence',
    hindiName: 'बाजार विश्लेषण',
    description: 'Real-time market prices, demand forecasting, and crop trading insights with APMC mandi data integration.',
    icon: TrendingUp,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
    iconColor: 'text-rose-600',
    features: ['Price Trends', 'Demand Forecasting', 'Mandi Rates', 'Export Opportunities'],
    popular: true,
    new: false
  },
  {
    id: 'plantdiseaseprediction',
    name: 'Disease Detection',
    hindiName: 'रोग पहचान',
    description: 'AI-powered plant disease identification with treatment recommendations using local remedies and chemicals.',
    icon: Activity,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    iconColor: 'text-teal-600',
    features: ['Image Analysis', 'Disease ID', 'Treatment Plans', 'Organic Solutions'],
    popular: false,
    new: false
  }
];

const ModulesGrid: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Complete Farming Solutions
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive <span className="text-green-600">Agricultural Platform</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to modernize your farming operations. From AI-powered crop monitoring to market intelligence - all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                className="group relative bg-white rounded-2xl border border-gray-200 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Popular/New Badge */}
                {(module.popular || module.new) && (
                  <div className="absolute top-4 right-4 z-10">
                    {module.popular && (
                      <div className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </div>
                    )}
                    {module.new && (
                      <div className="flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full mt-1">
                        <Zap className="w-3 h-3 mr-1" />
                        New
                      </div>
                    )}
                  </div>
                )}

                {/* Background Gradient */}
                <div className={`absolute inset-0 ${module.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${module.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                        {module.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {module.hindiName}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {module.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/${module.id}`}
                      className="group/btn inline-flex items-center justify-between w-full mt-6 px-4 py-3 bg-gray-50 hover:bg-green-100 text-gray-700 hover:text-green-800 rounded-xl font-medium transition-all duration-300 border border-gray-200 hover:border-green-300"
                    >
                      <span>Explore Module</span>
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-1 group-hover/btn:scale-110 transition-transform" />
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4">
            <Link
              href="/aigardenadvisor"
              className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              Start with AI Advisor
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <span className="text-gray-400">or</span>
            
            <Link
              href="/cropsimulation"
              className="group text-green-600 hover:text-green-700 font-semibold underline-offset-4 hover:underline transition-all duration-300 flex items-center"
            >
              Try Crop Simulation
              <ExternalLink className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesGrid;
