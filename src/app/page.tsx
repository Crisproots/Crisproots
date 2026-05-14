'use client';

import React, { useState, useEffect } from 'react';
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
  Heart,
  Wheat,
  Globe,
  CheckCircle,
  PlayCircle,
  Award,
  Sparkles,
  Smartphone,
  Database,
  Cloud,
  Eye,
  Clock,
  Bot,
  X
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
    id: 'plant-disease-prediction',
    name: 'Advanced Disease Detection',
    hindiName: 'उन्नत रोग पहचान',
    description: 'AI-powered plant disease identification with detailed analysis, interactive charts, and comprehensive treatment recommendations using Gemini AI.',
    detailedDesc: 'Revolutionary AI-powered disease detection using Gemini 2.5 Flash with real-time analysis, interactive visualizations, and comprehensive treatment timelines.',
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
    features: ['Gemini AI Analysis', 'Interactive Charts', 'Treatment Timeline', 'Environmental Factors', 'Real-time Detection'],
    benefits: ['98% accuracy rate', 'Instant diagnosis', 'Comprehensive treatment plans', 'Interactive visualizations'],
    rating: 4.9,
    users: '30,000+',
    popular: true,
    new: true
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
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 relative overflow-hidden flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse mx-auto">
              <Wheat className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-700">Loading Agricultural Intelligence</h2>
          <p className="text-green-600">Preparing the future of farming...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-6000"></div>
      </div>
      {/* Modern Navigation */}
      <nav className="relative bg-white/95 backdrop-blur-lg border-b border-green-200 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 animate-pulse-glow">
                  <Wheat className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  FarmHub AI
                </h1>
                <p className="text-sm text-green-600 font-medium">Agricultural Intelligence Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 hover:scale-105 transform">Features</a>
              <a href="#modules" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 hover:scale-105 transform">Solutions</a>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 hover:scale-105 transform">Success Stories</a>
              <Link href="/aigardenadvisor" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium animate-pulse-glow">
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-green-600 p-2 transition-colors duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/95 backdrop-blur-lg border-t border-green-200 px-4 py-4 space-y-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors">Features</a>
              <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors">Solutions</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors">Success Stories</a>
              <Link href="/aigardenadvisor" className="block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg font-medium text-center">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Blob Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50"></div>
        
        {/* Dynamic Blob Animations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-40 right-40 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-6000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Premium Badge */}
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-float">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>India&apos;s #1 AI-Powered Farming Platform</span>
                <Award className="h-5 w-5 animate-pulse" />
              </div>

              
              {/* Revolutionary Title */}
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent animate-gradient-x">
                  Farm with AI
                </span>
              </h1>
              
              {/* Compelling Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Join <span className="font-bold text-green-600 animate-pulse">1,20,000+ farmers</span> who increased their yield by 
                <span className="font-bold text-emerald-600 animate-pulse"> 40%</span> and reduced costs by 
                <span className="font-bold text-blue-600 animate-pulse"> 30%</span> using our AI-powered agricultural intelligence platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/aigardenadvisor" className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center animate-pulse-glow">
                  <span>Start Free Trial</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="group bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg inline-flex items-center justify-center">
                  <PlayCircle className="mr-2 h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 pt-8">
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-900 animate-pulse">25K+</div>
                  <div className="text-sm text-gray-600">Active Farms</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-900 animate-pulse">98.7%</div>
                  <div className="text-sm text-gray-600">AI Accuracy</div>
                </div>
                <div className="text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-900 animate-pulse">₹50Cr+</div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Preview */}
            <div className="relative animate-fade-in-right">
              <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 animate-float">
                <div className="bg-white rounded-2xl p-6 shadow-xl backdrop-blur-lg">
                  {/* Mock AI Dashboard */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">AI Farm Dashboard</h3>
                      <div className="flex items-center space-x-1 text-green-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Live</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-5 w-5 text-green-600 animate-pulse" />
                          <span className="text-sm font-medium text-gray-700">Crop Health</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">97%</div>
                        <div className="text-xs text-green-500 animate-pulse">+5% this week</div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-600 animate-pulse" />
                          <span className="text-sm font-medium text-gray-700">Yield Forecast</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">+42%</div>
                        <div className="text-xs text-blue-500 animate-pulse">Above average</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Water Efficiency</span>
                        <span className="text-sm font-bold text-amber-600 animate-pulse">Optimal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full w-4/5 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
                      <div className="text-sm font-medium text-gray-700 mb-2">AI Recommendations</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                          <span className="text-xs text-gray-600">Apply fertilizer in zone A</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                          <span className="text-xs text-gray-600">Pest risk detected - take action</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce animate-pulse-glow">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-pulse animate-pulse-glow">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Farm Management</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete agricultural intelligence platform with cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-10 bg-white rounded-3xl shadow-xl border hover:shadow-blue-500/30 hover:scale-105 hover:-translate-y-3 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Smart Analytics</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Real-time yield prediction and crop optimization using satellite data
                </p>
                <div className="mt-6 text-blue-600 font-bold text-sm">
                  📊 85% more accurate forecasts
                </div>
              </div>
            </div>

            <div className="group relative p-10 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 hover:shadow-purple-500/30 hover:scale-105 hover:-translate-y-3 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Auto Farming</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Intelligent automation for irrigation, fertilization, and pest control
                </p>
                <div className="mt-6 text-purple-600 font-bold text-sm">
                  ⚡ 60% reduced manual work
                </div>
              </div>
            </div>

            <div className="group relative p-10 bg-white rounded-3xl shadow-xl border hover:shadow-green-500/30 hover:scale-105 hover:-translate-y-3 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">AI Insights</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Machine learning powered recommendations for optimal farming decisions
                </p>
                <div className="mt-6 text-green-600 font-bold text-sm">
                  🧠 95% prediction accuracy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
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
      <section id="modules" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Farming Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              खेत से market तक - हर step के लिए intelligent tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => (
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
      <section id="testimonials" className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
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
                    &quot;{testimonial.text}&quot;
                  </blockquote>
                  
                  {/* English Translation */}
                  <p className="text-sm opacity-75 mb-6 italic">
                    &quot;{testimonial.english}&quot;
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

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                  <Wheat className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">FarmHub AI</h3>
              </div>
              <p className="text-gray-400">
                भारत का सबसे advanced agricultural intelligence platform। 
                हर किसान के लिए smart farming solutions।
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/aigardenadvisor" className="hover:text-green-400 transition-colors">AI Garden Advisor</Link></li>
                <li><Link href="/cropsimulation" className="hover:text-green-400 transition-colors">3D Crop Simulation</Link></li>
                <li><Link href="/crop-management" className="hover:text-green-400 transition-colors">Crop Management</Link></li>
                <li><Link href="/cattlefarmmanagement" className="hover:text-green-400 transition-colors">Cattle Management</Link></li>
                <li><Link href="/demandanalysis" className="hover:text-green-400 transition-colors">Market Intelligence</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">हिंदी Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>India (All States)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>24/7 Helpline</span>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg text-center">
                  <div className="text-white font-semibold">Download App</div>
                  <div className="text-green-100 text-sm">Available in 12 Languages</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 FarmHub AI. सभी अधिकार सुरक्षित। Made with ❤️ for Indian Farmers.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
