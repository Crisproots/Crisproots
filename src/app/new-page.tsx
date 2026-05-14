import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  Star,
  Users,
  MapPin,
  TrendingDown,
  Zap,
  Brain,
  Activity,
  Heart,
  Wheat,
  Globe,
  CheckCircle,
  PlayCircle,
  Award,
  Target,
  ChevronRight,
  Sparkles,
  Smartphone,
  Database,
  Cloud,
  Eye
} from 'lucide-react';

const modules = [
  {
    id: 'aigardenadvisor',
    name: 'AI Garden Advisor',
    hindiName: 'AI बगीचा सलाहकार',
    description: 'Get intelligent, AI-powered advice for your garden and crops with personalized recommendations tailored for Indian farming conditions.',
    detailedDesc: 'Advanced AI algorithms analyze your soil, weather, and crop conditions to provide personalized recommendations for optimal growth and yield.',
    icon: Brain,
    color: 'from-green-500 to-emerald-600',
    features: ['Smart Plant Care', 'Disease Detection', 'Growth Optimization', 'Weather Integration'],
    benefits: ['40% increase in yield', '30% reduction in water usage', '50% faster disease detection'],
    popular: true,
    rating: 4.9,
    users: '15,000+'
  },
  {
    id: 'cropsimulation',
    name: 'Advanced 3D Crop Simulation',
    hindiName: 'उन्नत 3D फसल सिमुलेशन',
    description: 'Revolutionary 3D crop growth simulation with real farm parameters, biosphere integration, and advanced farming techniques.',
    detailedDesc: 'Experience the future of farming with our cutting-edge 3D simulation technology that models complex agricultural ecosystems.',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    features: ['3D Visualization', 'Biosphere Systems', 'Mixed Cropping', 'Rice-Fish Integration'],
    benefits: ['60% better planning accuracy', '25% cost reduction', 'Real-time monitoring'],
    new: true,
    rating: 4.8,
    users: '8,500+'
  },
  {
    id: 'crop-management',
    name: 'Smart Crop Management',
    hindiName: 'स्मार्ट फसल प्रबंधन',
    description: 'Comprehensive crop management with smart fertilizer recommendations, pest control, and ROI optimization.',
    detailedDesc: 'Optimize every aspect of your crop production with data-driven insights and automated recommendations.',
    icon: Wheat,
    color: 'from-purple-500 to-pink-600',
    features: ['Smart Fertilizers', 'Pest Management', 'ROI Analysis', 'Biosphere Integration'],
    benefits: ['35% fertilizer savings', '50% pest reduction', 'ROI tracking'],
    popular: true,
    rating: 4.9,
    users: '22,000+'
  },
  {
    id: 'cattlefarmmanagement',
    name: 'Cattle Management',
    hindiName: 'पशु प्रबंधन',
    description: 'Complete cattle farm operations management with health tracking, breeding records, and feed optimization for Indian breeds.',
    detailedDesc: 'Manage your livestock with precision using AI-powered health monitoring and breeding optimization.',
    icon: Heart,
    color: 'from-amber-500 to-orange-600',
    features: ['Health Monitoring', 'Feed Management', 'Breeding Records', 'Milk Production'],
    benefits: ['20% increase in milk yield', '30% reduction in feed costs', 'Early disease detection'],
    popular: true,
    rating: 4.7,
    users: '18,000+'
  },
  {
    id: 'greenguardian/dashboard',
    name: 'Green Guardian',
    hindiName: 'हरित संरक्षक',
    description: 'Satellite-based environmental monitoring with real-time alerts for pest control, weather warnings, and crop health.',
    detailedDesc: 'Protect your crops with satellite imagery and AI-powered environmental monitoring systems.',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    features: ['Satellite Imagery', 'Risk Alerts', 'Environmental Data', 'Pest Detection'],
    benefits: ['90% accurate predictions', '24/7 monitoring', 'Early warning system'],
    new: true,
    rating: 4.8,
    users: '12,000+'
  },
  {
    id: 'demandanalysis',
    name: 'Market Intelligence',
    hindiName: 'बाजार विश्लेषण',
    description: 'Real-time market prices, demand forecasting, and crop trading insights with APMC mandi data integration.',
    detailedDesc: 'Make informed decisions with real-time market data and AI-powered demand forecasting.',
    icon: TrendingUp,
    color: 'from-rose-500 to-pink-600',
    features: ['Price Trends', 'Demand Forecasting', 'Mandi Rates', 'Export Opportunities'],
    benefits: ['25% better pricing', 'Market timing', 'Profit optimization'],
    popular: true,
    rating: 4.6,
    users: '25,000+'
  },
  {
    id: 'plantdiseaseprediction',
    name: 'Disease Detection',
    hindiName: 'रोग पहचान',
    description: 'AI-powered plant disease identification with treatment recommendations using local remedies and chemicals.',
    detailedDesc: 'Instantly identify plant diseases using advanced image recognition and get targeted treatment plans.',
    icon: Activity,
    color: 'from-teal-500 to-cyan-600',
    features: ['Image Analysis', 'Disease ID', 'Treatment Plans', 'Organic Solutions'],
    benefits: ['95% accuracy rate', 'Instant diagnosis', 'Organic alternatives'],
    rating: 4.9,
    users: '30,000+'
  }
];

const stats = [
  { label: 'Active Farms', value: '25,000+', icon: MapPin, change: '+15%', period: 'this month' },
  { label: 'Happy Farmers', value: '1,20,000+', icon: Users, change: '+22%', period: 'this year' },
  { label: 'AI Accuracy', value: '98.7%', icon: Activity, change: '+2.1%', period: 'improved' },
  { label: 'Cost Savings', value: '₹50 Cr+', icon: TrendingDown, change: '+35%', period: 'total saved' }
];

const testimonials = [
  {
    name: 'राजेश शर्मा (Rajesh Sharma)',
    location: 'Punjab',
    image: '👨‍🌾',
    text: 'FarmHub की AI technology से मेरी wheat की पैदावार 40% बढ़ गई है। अब मैं scientific तरीके से farming करता हूँ।',
    english: 'FarmHub\'s AI technology increased my wheat yield by 40%. Now I farm scientifically.',
    rating: 5,
    crop: 'Wheat, Rice',
    savings: '₹2.5 Lakh'
  },
  {
    name: 'सुनीता देवी (Sunita Devi)',
    location: 'Maharashtra',
    image: '👩‍🌾',
    text: 'Cattle management system से मेरे गायों का milk production बहुत बढ़ा है। Health monitoring बहुत helpful है।',
    english: 'The cattle management system significantly increased my cows\' milk production. Health monitoring is very helpful.',
    rating: 5,
    crop: 'Dairy Farming',
    savings: '₹3.2 Lakh'
  },
  {
    name: 'अनिल कुमार (Anil Kumar)',
    location: 'Haryana',
    image: '👨‍🌾',
    text: 'Market intelligence से मुझे सही time पर crop sell करने में मदद मिली। Profit 30% increase हुआ।',
    english: 'Market intelligence helped me sell crops at the right time. Profit increased by 30%.',
    rating: 5,
    crop: 'Sugarcane, Cotton',
    savings: '₹4.1 Lakh'
  }
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Advanced machine learning algorithms analyze your farm data to provide actionable insights',
    benefits: ['Predictive Analytics', 'Smart Recommendations', 'Automated Decisions']
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Access all features on your smartphone with offline capabilities for remote areas',
    benefits: ['Offline Mode', 'Voice Commands', 'Regional Languages']
  },
  {
    icon: Database,
    title: 'Comprehensive Database',
    description: 'Extensive database of Indian crops, soil types, and agricultural practices',
    benefits: ['1000+ Crop Varieties', 'Soil Analysis', 'Best Practices']
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description: 'Secure cloud storage with real-time synchronization across all your devices',
    benefits: ['Data Backup', 'Multi-Device Sync', 'Security']
  }
];

const achievements = [
  { icon: Award, label: 'Best AgTech Platform 2024', org: 'India AgTech Awards' },
  { icon: Star, label: '4.8/5 Rating', org: 'Google Play Store' },
  { icon: Users, label: '1M+ Downloads', org: 'App Stores' },
  { icon: Globe, label: 'Available in 12 Languages', org: 'Including Hindi & Regional' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 text-sm font-semibold mb-8 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                भारत का #1 Smart Farming Platform
                <Award className="w-4 h-4 ml-2 text-yellow-600" />
              </div>
              
              {/* Main Headline */}
              <h1 className="text-6xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 animate-gradient">
                  Smart
                </span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 animate-gradient">
                  Farming
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-gradient">
                  Revolution
                </span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
                भारतीय किसानों के लिए बनाया गया AI-powered platform। 
                <span className="text-green-600 font-semibold"> 40% तक अधिक पैदावार</span>, 
                <span className="text-blue-600 font-semibold"> 50% कम लागत</span>, और 
                <span className="text-purple-600 font-semibold"> 100% scientific farming</span> 
                के साथ अपनी खेती को transform करें।
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Link
                  href="/cropsimulation"
                  className="group bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <PlayCircle className="w-6 h-6 mr-3" />
                  3D Crop Simulation शुरू करें
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <Link
                  href="/aigardenadvisor"
                  className="group bg-white text-gray-900 border-3 border-gray-300 px-10 py-5 rounded-2xl font-bold text-lg hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
                >
                  <Brain className="w-6 h-6 mr-3" />
                  AI सलाहकार से बात करें
                  <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-black text-green-600">1.2M+</div>
                  <div className="text-sm text-gray-600 font-medium">खुश किसान</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-black text-blue-600">₹50Cr+</div>
                  <div className="text-sm text-gray-600 font-medium">बचत</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-black text-purple-600">98.7%</div>
                  <div className="text-sm text-gray-600 font-medium">सटीकता</div>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Preview */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Phone Mockup */}
                <div className="p-8">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-2 shadow-xl">
                    <div className="bg-black rounded-2xl overflow-hidden">
                      {/* Phone Screen */}
                      <div className="bg-gradient-to-br from-green-400 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-lg font-bold">FarmHub AI</div>
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <Brain className="w-5 h-5" />
                              <span className="font-semibold">AI Recommendation</span>
                            </div>
                            <div className="text-sm opacity-90">आपकी wheat crop के लिए नई fertilizer strategy तैयार है...</div>
                          </div>
                          
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <Activity className="w-5 h-5" />
                              <span className="font-semibold">Real-time Monitoring</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Soil: 72%</div>
                              <div>Weather: Good</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                  <Target className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">विश्वसनीय और पुरस्कार प्राप्त Platform</h2>
            <p className="text-xl text-gray-600">भारत की leading agricultural organizations द्वारा मान्यता प्राप्त</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="bg-white rounded-xl p-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <achievement.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="font-bold text-gray-900 mb-2">{achievement.label}</div>
                  <div className="text-sm text-gray-600">{achievement.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">हमारे Numbers की कहानी</h2>
            <p className="text-xl opacity-90">Real data, Real impact, Real transformation</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-colors duration-300">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-4xl font-black mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold mb-2">{stat.label}</div>
                  <div className="text-sm opacity-75">
                    <span className="text-green-200 font-semibold">{stat.change}</span> {stat.period}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">क्यों चुनें FarmHub?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology और traditional farming wisdom का perfect combination
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-green-200">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Modules Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Farming Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              खेत से market तक - हर step के लिए intelligent tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div key={module.id} className="group relative">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${module.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <module.icon className="w-8 h-8" />
                          {module.popular && (
                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                              Popular
                            </span>
                          )}
                          {module.new && (
                            <span className="bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-1">{module.name}</h3>
                        <p className="text-sm opacity-90">{module.hindiName}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 fill-current text-yellow-300" />
                          <span className="text-sm font-bold">{module.rating}</span>
                        </div>
                        <div className="text-xs opacity-75">{module.users} users</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{module.description}</p>
                    <p className="text-sm text-gray-500 mb-6">{module.detailedDesc}</p>
                    
                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {module.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Benefits */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                      <div className="space-y-1">
                        {module.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                            <TrendingUp className="w-3 h-3 mr-2 flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Link
                      href={`/${module.id}`}
                      className={`w-full bg-gradient-to-r ${module.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center group-hover:shadow-lg`}
                    >
                      Explore Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">किसानों की Success Stories</h2>
            <p className="text-xl opacity-90">Real farmers, Real results, Real transformation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-300" />
                    ))}
                  </div>
                  
                  {/* Hindi Quote */}
                  <blockquote className="text-lg mb-4 italic">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* English Translation */}
                  <p className="text-sm opacity-75 mb-6 italic">
                    "{testimonial.english}"
                  </p>
                  
                  {/* Farmer Details */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm opacity-75">{testimonial.location}</div>
                    </div>
                  </div>
                  
                  {/* Results */}
                  <div className="bg-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Crops:</span>
                      <span className="font-semibold">{testimonial.crop}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Annual Savings:</span>
                      <span className="font-bold text-green-300">{testimonial.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            आज ही शुरू करें अपना 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Smart Farming Journey</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            1.2 million+ किसान पहले से ही FarmHub का इस्तेमाल करके अपनी income बढ़ा रहे हैं। 
            आप भी जुड़िए और experience करिए future of farming।
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/cropsimulation"
              className="group bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Free में Try करें
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <Link
              href="/demandanalysis"
              className="group bg-white text-gray-900 border-3 border-gray-300 px-12 py-5 rounded-2xl font-bold text-xl hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
            >
              <Eye className="w-6 h-6 mr-3" />
              Demo देखें
            </Link>
          </div>
          
          {/* Additional CTA Info */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div className="bg-gray-50 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Free Trial</div>
              <div className="text-sm text-gray-600">30 दिन मुफ्त</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">24/7 Support</div>
              <div className="text-sm text-gray-600">Hindi में help</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Instant Setup</div>
              <div className="text-sm text-gray-600">5 मिनट में ready</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
