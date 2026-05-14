'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  MessageSquare, 
  Settings, 
  User, 
  X,
  MapPin,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  Lightbulb,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';

// Enhanced Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  type?: 'text' | 'recommendations' | 'weather' | 'analysis';
}

interface GardenFormData {
  location: string;
  gardenSize: 'Small' | 'Medium' | 'Large';
  cropType: 'Vegetables' | 'Fruits' | 'Herbs' | 'Grains' | 'Mixed';
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ChatSectionProps {
  onOpenJournal?: () => void;
}

// Enhanced Component Interfaces
interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeaking: () => void;
}

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

interface AIStatusProps {
  isProcessing: boolean;
}

type WeatherWidgetProps = Record<string, never>;

// Voice Controls Component
const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onToggleListening,
  onToggleSpeaking,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggleListening}
        className={`p-2 rounded-full transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
      
      <button
        onClick={onToggleSpeaking}
        className={`p-2 rounded-full transition-all duration-200 ${
          isSpeaking 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        title={isSpeaking ? 'Disable voice responses' : 'Enable voice responses'}
      >
        {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </div>
  );
};

// Quick Suggestions Component
const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    { icon: <Lightbulb className="h-4 w-4" />, text: "Crop recommendations for my area", category: "Planning" },
    { icon: <Activity className="h-4 w-4" />, text: "Diagnose plant disease", category: "Health" },
    { icon: <Droplets className="h-4 w-4" />, text: "Optimize irrigation schedule", category: "Water" },
    { icon: <TrendingUp className="h-4 w-4" />, text: "Market price analysis", category: "Economics" },
    { icon: <Zap className="h-4 w-4" />, text: "Organic farming tips", category: "Sustainable" },
    { icon: <Sun className="h-4 w-4" />, text: "Seasonal planting guide", category: "Timing" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
        Quick Suggestions
      </h3>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-gray-200 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-green-600 group-hover:text-green-700">
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{suggestion.text}</div>
                <div className="text-xs text-gray-500">{suggestion.category}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// AI Status Component
const AIStatus: React.FC<AIStatusProps> = ({ isProcessing }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
      <span className="text-sm text-gray-600">
        {isProcessing ? 'AI Processing...' : 'AI Ready'}
      </span>
    </div>
  );
};

// Weather Widget Component
const WeatherWidget: React.FC<WeatherWidgetProps> = () => {
  const [weather] = useState({
    temperature: 24,
    humidity: 65,
    windSpeed: 8,
    condition: 'partly-cloudy',
    recommendation: 'Good day for outdoor farming activities'
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-green-600" />
        Weather & Farm Conditions
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-2xl font-bold text-gray-800">{weather.temperature}°C</div>
              <div className="text-sm text-gray-600">Partly Cloudy</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Wind: {weather.windSpeed} km/h</span>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm text-green-800 font-medium">Today&apos;s Farming Tip:</div>
          <div className="text-sm text-green-700 mt-1">{weather.recommendation}</div>
        </div>
      </div>
    </div>
  );
};

// Main ChatSection Component
const ChatSection: React.FC<ChatSectionProps> = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '🌱 **Welcome to your Advanced Agricultural AI Assistant!** 🌱\n\nI\'m here to revolutionize your farming experience with:\n\n🚜 **Precision Farming** - Optimize yields with data-driven insights\n🔬 **Plant Health** - AI-powered disease & pest identification\n📊 **Smart Analytics** - Real-time farm performance monitoring\n💧 **Resource Management** - Water, soil, and nutrient optimization\n🌡️ **Weather Intelligence** - Climate-aware recommendations\n🤖 **24/7 Expert Support** - Get instant answers to any farming question\n\nWhat would you like assistance with today?',
      timestamp: new Date(),
      suggestions: [
        'Questions about organic farming or sustainable practices?',
        'Need crop recommendations for my area?',
        'Help with pest or disease identification',
        'Optimize my irrigation schedule',
        'Market prices and demand forecasting',
        'Soil testing and improvement advice'
      ]
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [userProfile, setUserProfile] = useState<Partial<GardenFormData>>({});
  const [showOnboarding, setShowOnboarding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced message sending
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    try {
      // Simulate AI processing and generate intelligent response
      const aiResponse = await generateAIResponse(content, userProfile);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        type: aiResponse.type
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Text-to-speech for AI responses
      if (isSpeaking && aiResponse.content) {
        speakText(aiResponse.content);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again or check your internet connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate intelligent AI responses
  const generateAIResponse = async (userMessage: string, profile: Partial<GardenFormData>) => {
    // Enhanced AI logic for different types of queries
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('organic') || lowerMessage.includes('sustainable')) {
      return {
        content: `🌿 **Organic & Sustainable Farming Practices**\n\nFor sustainable agriculture, I recommend:\n\n✅ **Crop Rotation**: Alternate nitrogen-fixing legumes with heavy feeders\n✅ **Companion Planting**: Use marigolds with tomatoes for natural pest control\n✅ **Compost Management**: Create nutrient-rich organic matter\n✅ **Beneficial Insects**: Encourage ladybugs and lacewings for natural pest control\n✅ **Cover Crops**: Plant winter rye or clover to improve soil health\n\nWould you like specific organic certification guidelines or pest management strategies?`,
        suggestions: [
          'Show me companion planting combinations',
          'How to make effective compost?',
          'Natural pest control methods',
          'Organic fertilizer recommendations'
        ],
        type: 'analysis' as const
      };
    }
    
    if (lowerMessage.includes('crop') && (lowerMessage.includes('recommend') || lowerMessage.includes('suggest'))) {
      return {
        content: `🌾 **Personalized Crop Recommendations**\n\nBased on your profile, here are excellent options:\n\n🥕 **High-Yield Vegetables**: Tomatoes, Lettuce, Spinach, Radishes\n🌺 **Profitable Flowers**: Sunflowers, Marigolds, Zinnias\n🌿 **Essential Herbs**: Basil, Cilantro, Mint, Oregano\n🍓 **Quick Harvest**: Microgreens (7-14 days), Baby lettuce (21 days)\n\nFor your ${profile.gardenSize || 'garden'} setup, I especially recommend starting with **tomatoes and herbs** - they're beginner-friendly and highly profitable!\n\nWould you like detailed growing guides for any of these?`,
        suggestions: [
          'Tomato growing guide',
          'Best herbs for beginners',
          'Quick-harvest vegetables',
          'Seasonal planting calendar'
        ],
        type: 'recommendations' as const
      };
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('problem')) {
      return {
        content: `🔍 **Plant Health Diagnostics**\n\nI can help identify and treat common issues:\n\n🐛 **Pest Identification**: Upload photos for instant AI analysis\n🦠 **Disease Diagnosis**: Symptoms-based detection system\n🌡️ **Environmental Stress**: Heat, cold, or nutrient deficiency signs\n💊 **Treatment Plans**: Organic and conventional solutions\n📈 **Prevention Strategies**: Proactive plant health management\n\n**Quick Diagnosis**: Describe the symptoms (yellowing leaves, spots, holes, wilting) and affected plant type, or upload a photo for instant analysis!`,
        suggestions: [
          'Upload plant disease photo',
          'Common tomato problems',
          'Natural fungicide recipes',
          'Pest prevention strategies'
        ],
        type: 'analysis' as const
      };
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
      return {
        content: `💧 **Smart Irrigation & Water Management**\n\nOptimize your watering strategy:\n\n📊 **Soil Moisture Monitoring**: Check 2-3 inches deep before watering\n⏰ **Optimal Timing**: Early morning (6-8 AM) reduces evaporation\n🎯 **Deep, Infrequent Watering**: Encourages strong root development\n🌡️ **Weather-Based Adjustments**: Reduce watering before expected rain\n💡 **Efficiency Tips**: Drip irrigation saves 30-50% water vs. overhead sprinklers\n\n**Current Recommendation**: Based on the season, water ${profile.gardenSize === 'Large' ? '2-3 times per week' : 'every 2-3 days'} with deep soaking.\n\nWould you like a customized watering schedule for your specific crops?`,
        suggestions: [
          'Create watering schedule',
          'Drip irrigation setup',
          'Water conservation tips',
          'Soil moisture testing'
        ],
        type: 'analysis' as const
      };
    }
    
    // Default comprehensive response
    return {
      content: `🤖 **AI Agricultural Assistant Ready!**\n\nI understand you're looking for farming guidance. I can help with:\n\n🌱 **Crop Selection & Planning**: Personalized recommendations\n🔬 **Plant Health**: Disease/pest identification & treatment\n💧 **Resource Optimization**: Water, nutrients, space management\n📈 **Market Intelligence**: Pricing trends & demand forecasting\n🌡️ **Weather Integration**: Climate-aware farming decisions\n📚 **Knowledge Base**: Expert advice on any farming topic\n\nCould you be more specific about what you'd like help with? I'm here to provide detailed, actionable advice for your farming success!`,
      suggestions: [
        'What crops should I grow?',
        'Help with plant disease',
        'Optimize my watering',
        'Market price analysis',
        'Soil improvement tips',
        'Organic farming advice'
      ],
      type: 'text' as const
    };
  };

  // Text-to-speech functionality
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[🌱🚜🔬📊💧🌡️🤖✅🥕🌺🌿🍓🔍🐛🦠💊📈💧📊⏰🎯💡🤖]/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice input functionality
  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (!isListening) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCurrentInput(transcript);
        };
        
        recognition.start();
      }
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(currentInput);
    }
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  // Complete the main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-green-400 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-3">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Advanced Agricultural AI Assistant
                </h1>
                <p className="text-gray-600 mt-1">Intelligent farming guidance powered by advanced AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <VoiceControls 
                isListening={isListening}
                isSpeaking={isSpeaking}
                onToggleListening={toggleListening}
                onToggleSpeaking={() => setIsSpeaking(!isSpeaking)}
              />
              <AIStatus isProcessing={isProcessing} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <QuickSuggestions onSuggestionClick={handleSuggestionClick} />
            <WeatherWidget />
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-green-600" />
                Quick Setup
              </h3>
              <button
                onClick={startOnboarding}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                <User className="h-4 w-4 mr-2 inline" />
                Setup Your Farm Profile
              </button>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="font-medium">Agricultural AI Assistant Online</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MessageSquare className="h-4 w-4" />
                    <span>{messages.length} messages</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-600 mb-2">Quick Actions:</p>
                          <div className="grid grid-cols-1 gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-left text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">AI is analyzing your request...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about farming, crops, plant health, or agricultural practices..."
                      className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={1}
                      style={{ minHeight: '50px', maxHeight: '120px' }}
                    />
                    <button
                      onClick={toggleListening}
                      className={`absolute right-3 top-3 p-2 rounded-full transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => sendMessage(currentInput)}
                    disabled={!currentInput.trim() || isProcessing}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Setup Your Farm Profile</h2>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Location
                  </label>
                  <input
                    type="text"
                    value={userProfile.location || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter your city, state, or region"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Size
                  </label>
                  <select
                    value={userProfile.gardenSize || 'Small'}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, gardenSize: e.target.value as 'Small' | 'Medium' | 'Large' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Small">Small (under 1 acre)</option>
                    <option value="Medium">Medium (1-10 acres)</option>
                    <option value="Large">Large (over 10 acres)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Crop Type
                  </label>
                  <select
                    value={userProfile.cropType || 'Vegetables'}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, cropType: e.target.value as 'Vegetables' | 'Fruits' | 'Herbs' | 'Grains' | 'Mixed' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Grains">Grains</option>
                    <option value="Mixed">Mixed Crops</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={userProfile.experience || 'Beginner'}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowOnboarding(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Skip for Now
                  </button>
                  <button
                    onClick={() => {
                      setShowOnboarding(false);
                      sendMessage('I\'ve set up my farm profile. Can you give me personalized recommendations?');
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;