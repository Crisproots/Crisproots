"use client";

import React from 'react';
import { Users, MapPin, Activity, TrendingDown, Globe, Wheat, Calculator, Shield } from 'lucide-react';

const stats = [
  { 
    label: 'Active Farms', 
    value: '25,000+', 
    icon: MapPin, 
    description: 'Farms across India using our platform',
    growth: '+45% this year'
  },
  { 
    label: 'Happy Farmers', 
    value: '1,20,000+', 
    icon: Users, 
    description: 'Satisfied farmers nationwide',
    growth: '+60% adoption rate'
  },
  { 
    label: 'AI Accuracy', 
    value: '98.7%', 
    icon: Activity, 
    description: 'Disease detection accuracy',
    growth: '99.2% crop prediction'
  },
  { 
    label: 'Cost Savings', 
    value: '₹50 Cr+', 
    icon: TrendingDown, 
    description: 'Total farmer savings generated',
    growth: '35% avg. cost reduction'
  },
  { 
    label: 'States Covered', 
    value: '28+', 
    icon: Globe, 
    description: 'Indian states and territories',
    growth: 'Pan-India coverage'
  },
  { 
    label: 'Crop Varieties', 
    value: '150+', 
    icon: Wheat, 
    description: 'Supported crop types',
    growth: 'Including regional varieties'
  },
  { 
    label: 'Predictions Made', 
    value: '50L+', 
    icon: Calculator, 
    description: 'Accurate farming predictions',
    growth: 'Real-time analysis'
  },
  { 
    label: 'Disasters Prevented', 
    value: '2,800+', 
    icon: Shield, 
    description: 'Early warning alerts sent',
    growth: '95% success rate'
  }
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Empowering <span className="text-green-600">Indian Agriculture</span> with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform has transformed farming across India, helping farmers increase yields, 
            reduce costs, and make data-driven decisions for sustainable agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    Live
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500 leading-relaxed">
                    {stat.description}
                  </div>
                  <div className="text-xs text-green-600 font-medium pt-1 border-t border-gray-100">
                    {stat.growth}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Insights */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Real Impact on Indian Farming
              </h3>
              <p className="text-gray-600">
                Trusted by farmers from Punjab to Tamil Nadu, our AI solutions are making farming smarter and more profitable.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Support Available</div>
              <div className="text-sm text-gray-500">Hindi & Regional Languages</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">FREE</div>
              <div className="text-gray-700 font-medium">For Small Farmers</div>
              <div className="text-sm text-gray-500">Government Partnership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
