"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, BarChart3, Heart, Shield, TrendingUp, 
  Microscope, FlaskConical, Wheat, Brain, Zap, Eye, Plane, 
  Globe, Stethoscope, Briefcase, BookOpen, LandPlot 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'AI Garden', href: '/aigardenadvisor', icon: Brain },
    { name: '3D Crop Sim', href: '/cropsimulation-v', icon: BarChart3 },
    { name: 'Biosphere Sim', href: '/cropsimulation', icon: Globe },
    { name: 'Livestock Disease Pred', href: '/livestock', icon: Stethoscope },
    { name: 'Smart Crop', href: '/crop-management', icon: Zap },
    { name: 'Drone Monitor', href: '/drone-monitoring', icon: Plane },
    { name: 'Cattle Farm', href: '/cattlefarmmanagement', icon: Heart },
    { name: 'Green Guardian', href: '/greenguardian/dashboard', icon: Shield },
    { name: 'Market Intel', href: '/demandanalysis', icon: TrendingUp },
    { name: 'Disease Detect', href: '/plant-disease-detection', icon: Eye },
    { name: 'PlantDoc AI', href: '/plantdiseaseprediction', icon: Microscope },
    { name: 'CRISP Roots', href: '/crisp', icon: FlaskConical },
    { name: 'AI Form Filling', href: '/ai-form-filling', icon: FlaskConical },
    { name: 'Community Blogs', href: '/community-blogs', icon: BarChart3 },
    { name: 'Krishi Connect', href: '/krishi', icon: Briefcase },
    { name: 'Farmer Education', href: '/farmer-education', icon: BookOpen },
    { name: 'Govt. Plans', href: '/government-plans', icon: LandPlot },
  ];
  const sortedNavItems = [...navItems].sort((a, b) => a.name.localeCompare(b.name));

  // Use static classes initially, then apply dynamic styling only after mount
  const getNavbarClasses = () => {
    // Always return static classes to prevent hydration mismatch
    return "fixed top-0 w-full z-[9999] transition-all duration-300 bg-gradient-to-r from-green-600 via-green-700 to-emerald-600";
  };

  const getLogoContainerClasses = () => {
    // Always return static classes to prevent hydration mismatch
    return "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-white/20";
  };

  const getTitleClasses = () => {
    // Always return static classes to prevent hydration mismatch
    return "text-xl font-bold transition-colors duration-300 text-white";
  };

  const getSubtitleClasses = () => {
    // Always return static classes to prevent hydration mismatch
    return "text-xs transition-colors duration-300 text-green-100";
  };

  const getMobileButtonClasses = () => {
    // Always return static classes to prevent hydration mismatch
    return "p-2 rounded-xl transition-colors duration-300 text-white hover:bg-white/10";
  };

  const getLinkClasses = (isActive: boolean) => {
    // Always return the same static classes during initial render to prevent hydration mismatch
    const baseClasses = "group relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1";
    const staticClasses = isActive 
      ? `${baseClasses} bg-white/20 text-white shadow-sm`
      : `${baseClasses} text-white/80 hover:bg-white/10 hover:text-white`;
    
    return staticClasses;
  };

  const getMobileLinkClasses = (isActive: boolean) => {
    // Use static classes to prevent hydration mismatch
    const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200";
    return isActive
      ? `${baseClasses} bg-green-100 text-green-700 font-medium`
      : `${baseClasses} text-gray-700 hover:bg-gray-50`;
  };

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav className={getNavbarClasses()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className={getLogoContainerClasses()}>
                  <Wheat className="w-6 h-6 transition-colors duration-300 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={getTitleClasses()}>
                  Smart<span className="text-green-300">Farm</span><span className="text-blue-300">AI</span>
                </h1>
                <p className={getSubtitleClasses()}>
                  Comprehensive Agriculture Platform
                </p>
              </div>
            </Link>

            {/* Hamburger menu button (always visible) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={getMobileButtonClasses()}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Hamburger Navigation (always available) */}
        {isOpen && (
          <div className={`fixed top-0 right-0 h-full w-72 max-w-full bg-white shadow-lg z-[9999] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-4 border-b border-green-100">
                <span className="text-lg font-bold text-green-700">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-green-700 hover:bg-green-100">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {sortedNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={getMobileLinkClasses(isActive)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;

