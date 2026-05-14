"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Eye,
  Layers,
  Fish,
  Sprout,
  TrendingUp,
  Zap,
  Users,
  Target,
  BarChart3,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const CropSimulationOverview: React.FC = () => {
  const features = [
    {
      icon: Eye,
      title: '3D Visual Farm',
      description: 'Interactive 3D visualization of your farm with real-time crop growth animation',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Layers,
      title: 'Biosphere Integration',
      description: 'Advanced farming techniques including fish-rice systems and mixed cropping',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Fish,
      title: 'Aquaponics Systems',
      description: 'Rice-fish integration for 35% higher ROI and natural pest control',
      color: 'text-cyan-600 bg-cyan-100'
    },
    {
      icon: Sprout,
      title: 'Smart Agriculture',
      description: 'AI-powered recommendations for optimal crop health and maximum yield',
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      icon: TrendingUp,
      title: 'ROI Optimization',
      description: 'Detailed financial analysis with profit maximization strategies',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Zap,
      title: 'Real-time Simulation',
      description: 'Live crop growth tracking with environmental parameter adjustments',
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const biosphereSystems = [
    {
      name: 'Rice-Fish Integration',
      description: 'Traditional Indian technique combining fish farming with rice cultivation',
      benefits: ['Natural pest control', 'Additional protein source', 'Reduced chemical inputs'],
      roi: '+35%',
      image: '🐟🌾'
    },
    {
      name: 'Duck-Rice System',
      description: 'Integrated system using ducks for weed and pest management',
      benefits: ['Organic weed control', 'Duck meat/eggs income', 'Soil fertilization'],
      roi: '+28%',
      image: '🦆🌾'
    },
    {
      name: 'Agroforestry',
      description: 'Tree-crop integration for sustainable farming practices',
      benefits: ['Carbon sequestration', 'Windbreak protection', 'Timber income'],
      roi: '+40%',
      image: '🌳🌾'
    },
    {
      name: 'Aquaponics',
      description: 'Soilless farming with fish and plant symbiosis',
      benefits: ['90% less water usage', 'Year-round production', 'Premium organic produce'],
      roi: '+60%',
      image: '🐠🥬'
    }
  ];

  const statistics = [
    { label: 'Farmers Helped', value: '50,000+', icon: Users },
    { label: 'ROI Increase', value: '45%', icon: TrendingUp },
    { label: 'Crop Success Rate', value: '95%', icon: Target },
    { label: 'Cost Reduction', value: '30%', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🌾 Advanced 3D Crop Simulation
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Experience the future of farming with our revolutionary 3D simulation platform featuring 
              biosphere integration, mixed cropping systems, and AI-powered optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cropsimulation"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="w-6 h-6 mr-2" />
                Try 3D Simulation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/crop-management"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                <BarChart3 className="w-6 h-6 mr-2" />
                Smart Management
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Revolutionary Farming Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience cutting-edge agricultural technology designed specifically for Indian farmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Biosphere Systems */}
      <div className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Biosphere Integration Systems
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Innovative farming techniques that combine multiple agricultural systems for maximum efficiency and sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {biosphereSystems.map((system, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{system.image}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{system.name}</h3>
                    <div className="text-lg font-bold text-green-600">{system.roi} ROI Increase</div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{system.description}</p>
                
                <div className="space-y-2">
                  <div className="font-medium text-gray-700">Key Benefits:</div>
                  {system.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to revolutionize your farming with 3D simulation and smart recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Setup Your Farm</h3>
              <p className="text-gray-600">
                Enter your farm parameters including crop type, soil conditions, and environmental factors
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Integration</h3>
              <p className="text-gray-600">
                Select from various biosphere systems like rice-fish integration or agroforestry
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Optimize & Harvest</h3>
              <p className="text-gray-600">
                Get AI-powered recommendations and watch your ROI increase with optimized farming practices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of farmers who have increased their ROI by up to 60% using our advanced 3D crop simulation platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cropsimulation"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <Calendar className="w-6 h-6 mr-2" />
              Start 3D Simulation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/crop-management"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              <BarChart3 className="w-6 h-6 mr-2" />
              Smart Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSimulationOverview;
