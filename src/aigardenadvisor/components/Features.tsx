import React from 'react';
import { Leaf as Plant, Cloud, Map, Calendar, BarChart, Thermometer, Droplets, Wind, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, index }) => (
  <div 
    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px] border border-white/50 animate-slide-up"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className={`relative rounded-2xl ${color} w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
      {icon}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
        <Sparkles className="w-2 h-2 text-yellow-600" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
      {description}
    </p>
    
    {/* Hover Effect Line */}
    <div className="w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-4 group-hover:w-full transition-all duration-500"></div>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Plant className="h-8 w-8 text-white" />,
      title: "AI Plant Selection",
      description: "Get intelligent recommendations for vegetables, fruits, and herbs that will thrive in your specific garden conditions with 98% accuracy.",
      color: "bg-gradient-to-br from-green-500 to-emerald-600"
    },
    {
      icon: <Map className="h-8 w-8 text-white" />,
      title: "Smart Location Analysis",
      description: "Receive guidance tailored to your exact climate zone, soil type, and micro-climate conditions using satellite data.",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Dynamic Planting Calendar",
      description: "AI-powered planting schedules that adapt to real-time weather patterns and seasonal variations in your area.",
      color: "bg-gradient-to-br from-purple-500 to-violet-600"
    },
    {
      icon: <Cloud className="h-8 w-8 text-white" />,
      title: "Weather Intelligence",
      description: "Advanced weather integration with 7-day forecasts and climate trend analysis for optimal planting decisions.",
      color: "bg-gradient-to-br from-indigo-500 to-blue-600"
    },
    {
      icon: <BarChart className="h-8 w-8 text-white" />,
      title: "Growth Analytics",
      description: "Track plant progress with AI-powered growth predictions and receive personalized care recommendations.",
      color: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      icon: <Thermometer className="h-8 w-8 text-white" />,
      title: "Climate Adaptation",
      description: "Future-proof your garden with climate-resilient plant varieties and adaptive growing strategies.",
      color: "bg-gradient-to-br from-rose-500 to-pink-600"
    },
    {
      icon: <Droplets className="h-8 w-8 text-white" />,
      title: "Smart Irrigation",
      description: "Optimize water usage with AI-calculated irrigation schedules based on soil moisture and plant needs.",
      color: "bg-gradient-to-br from-teal-500 to-cyan-600"
    },
    {
      icon: <Wind className="h-8 w-8 text-white" />,
      title: "Pest & Disease AI",
      description: "Early detection and prevention of garden threats using computer vision and machine learning algorithms.",
      color: "bg-gradient-to-br from-amber-500 to-yellow-600"
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center justify-center bg-green-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm font-semibold uppercase tracking-wide">AI-Powered Features</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Smart Gardening</span>
            <br />
            <span className="text-gray-900">Made Simple</span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-gray-600 text-xl leading-relaxed">
            Our cutting-edge AI platform combines machine learning, satellite data, and local expertise 
            to give you the most accurate gardening advice available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-scale-in">
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Happy Gardeners</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-blue-600 mb-2">98.5%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-purple-600 mb-2">2M+</div>
              <div className="text-gray-600 font-medium">Plants Tracked</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-orange-600 mb-2">365</div>
              <div className="text-gray-600 font-medium">Days Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};