"use client";

import React, { useState } from 'react';
import { Mail, ArrowRight, Bell, Gift, Star, CheckCircle } from 'lucide-react';

const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setSubscribed(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  const benefits = [
    'Weekly farming tips and best practices',
    'Early access to new AI features',
    'Market price alerts and trends',
    'Seasonal crop recommendations',
    'Government scheme updates',
    'Expert webinar invitations'
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <Gift className="w-4 h-4 mr-2" />
              FREE for Indian Farmers
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Stay Ahead with <br />
              <span className="text-yellow-300">Smart Farming</span> Updates
            </h2>
            
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Join over 1,20,000 Indian farmers who receive our weekly newsletter with AI-powered 
              farming insights, market updates, and expert tips delivered in Hindi and English.
            </p>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-green-100">
                  <CheckCircle className="w-4 h-4 mr-3 text-yellow-300 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 text-green-100">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs">👨‍🌾</div>
                  <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-xs">👩‍🌾</div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-xs">👨‍🌾</div>
                  <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-xs">👩‍🌾</div>
                </div>
                <span className="ml-3 text-sm">1,20,000+ subscribers</span>
              </div>
              
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {subscribed ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Mail className="w-8 h-8 text-white" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {subscribed ? 'Welcome Aboard!' : 'Join the Community'}
              </h3>
              <p className="text-gray-600">
                {subscribed 
                  ? 'Thank you for subscribing! Check your email for confirmation.'
                  : 'Get weekly insights delivered to your inbox'
                }
              </p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (ईमेल पता)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                >
                  <Bell className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Subscribe Now (अभी सब्सक्राइब करें)
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  You are now part of our farming community!
                </p>
                <div className="text-sm text-gray-500">
                  Your first newsletter will arrive within 24 hours.
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Free forever. Unsubscribe anytime. Available in Hindi & English.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
