import React from 'react';
import { Loader2, Sprout } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <Sprout className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
            <span className="text-gray-700 font-medium">Loading FarmHub</span>
          </div>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <Loader2 className={`${sizes[size]} text-green-600 animate-spin`} />
      <span className={`${textSizes[size]} text-gray-700 font-medium`}>{text}</span>
    </div>
  );
};

export default Loading;
