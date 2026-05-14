"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wheat, Globe, Zap, Brain } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/10 to-purple-600/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-6 animate-pulse">
              <Wheat className="w-4 h-4 mr-2" />
              भारतीय किसानों के लिए AI तकनीक (AI Technology for Indian Farmers)
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Smart
              </span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Farming
              </span>{' '}
              for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                India
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Revolutionize your farming with AI-powered insights, real-time crop monitoring, and predictive analytics. 
              Designed specifically for Indian agriculture with support for Hindi, regional crops, and local market data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/cropsimulation"
                className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
              >
                फसल सिमुलेशन शुरू करें (Start Crop Simulation)
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/aigardenadvisor"
                className="group bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold hover:border-green-300 hover:text-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                AI सलाहकार (AI Advisor)
                <Brain className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                AI-Powered Insights
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-blue-500" />
                India-Specific Data
              </div>
              <div className="flex items-center text-gray-600">
                <Wheat className="w-4 h-4 mr-2 text-green-500" />
                Regional Crop Support
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                <h3 className="text-white text-xl font-bold mb-2">Live Farm Dashboard</h3>
                <p className="text-green-100">Real-time monitoring for your crops</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rice (Basmati)</span>
                  <span className="text-green-600 font-semibold">Excellent Health</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '92%' }}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">28°C</div>
                    <div className="text-xs text-gray-600">Temperature</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-xs text-gray-600">Soil Moisture</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              🌱
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
              💧
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
