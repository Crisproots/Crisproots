"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wheat, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe email:', email);
    setEmail('');
  };

  const quickLinks = [
    { name: 'AI Garden Advisor', href: '/aigardenadvisor' },
    { name: '3D Crop Simulation', href: '/cropsimulation' },
    { name: 'Smart Crop Management', href: '/crop-management' },
    { name: 'Cattle Management', href: '/cattlefarmmanagement' },
    { name: 'Green Guardian', href: '/greenguardian/dashboard' },
    { name: 'Disease Detection', href: '/plantdiseaseprediction' },
    { name: 'Market Analysis', href: '/demandanalysis' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Video Tutorials', href: '/tutorials' },
    { name: 'Farmer Success Stories', href: '/success-stories' },
    { name: 'Mobile App', href: '/mobile-app' },
    { name: 'WhatsApp Support', href: 'https://wa.me/+919876543210' },
  ];

  const governmentLinks = [
    { name: 'PM-KISAN Scheme', href: '/schemes/pm-kisan' },
    { name: 'Fasal Bima Yojana', href: '/schemes/fasal-bima' },
    { name: 'Soil Health Card', href: '/schemes/soil-health' },
    { name: 'e-NAM Portal', href: '/schemes/e-nam' },
    { name: 'Kisan Credit Card', href: '/schemes/kcc' },
    { name: 'RKVY Schemes', href: '/schemes/rkvy' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Data Security', href: '/security' },
    { name: 'GDPR Compliance', href: '/gdpr' },
    { name: 'Accessibility', href: '/accessibility' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Stay Updated with FarmHub</h3>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Get the latest farming tips, technology updates, and exclusive insights delivered to your inbox.
              </p>
              <form 
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button 
                  type="submit"
                  className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <Link href="/" className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Wheat className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Farm<span className="text-green-400">Hub</span></h1>
                    <p className="text-gray-400 text-sm">स्मार्ट कृषि (Smart Agriculture)</p>
                  </div>
                </Link>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  भारतीय किसानों के लिए AI-संचालित अंतर्दृष्टि, व्यापक फार्म प्रबंधन, और टिकाऊ कृषि सफलता के लिए अत्याधुनिक तकनीक के साथ कृषि में क्रांति लाना।
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-400">
                    <Mail className="w-5 h-5 mr-3 text-green-400" />
                    <span>support@farmhub.co.in</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Phone className="w-5 h-5 mr-3 text-green-400" />
                    <span>+91 1800-123-4567 (Toll Free)</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-5 h-5 mr-3 text-green-400" />
                    <span>Krishi Bhawan, New Delhi, India 110001</span>
                  </div>
                </div>

                {/* Language Selector */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="text-sm text-gray-400 mb-2">भाषा चुनें (Choose Language):</div>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">हिंदी</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600">English</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600">ગુજરાતી</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600">मराठी</button>
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600">தமிழ்</button>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6">कृषि मॉड्यूल<br/><span className="text-sm text-gray-400">Farm Modules</span></h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group text-sm"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-lg font-semibold mb-6">सहायता केंद्र<br/><span className="text-sm text-gray-400">Support Center</span></h3>
                <ul className="space-y-3">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Government Schemes */}
              <div>
                <h3 className="text-lg font-semibold mb-6">सरकारी योजनाएं<br/><span className="text-sm text-gray-400">Govt Schemes</span></h3>
                <ul className="space-y-3">
                  {governmentLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-lg font-semibold mb-6">कानूनी<br/><span className="text-sm text-gray-400">Legal</span></h3>
                <ul className="space-y-3">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* Certifications */}
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500 mb-2">Certified by:</div>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div>🏛️ Govt. of India Approved</div>
                    <div>🔒 ISO 27001 Certified</div>
                    <div>✅ GDPR Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center text-gray-400 mb-4 md:mb-0">
                <span>© {currentYear} FarmHub. Made with</span>
                <Heart className="w-4 h-4 mx-2 text-red-500" />
                <span>for farmers worldwide.</span>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
