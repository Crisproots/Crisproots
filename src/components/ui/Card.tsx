import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
  features?: string[];
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false 
}) => {
  const baseClasses = "rounded-2xl border border-gray-200 bg-white shadow-sm";
  const hoverClasses = hover ? "card-hover" : "";
  const glassClasses = glass ? "glass backdrop-blur-md bg-white/80" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${glassClasses} ${className}`}>
      {children}
    </div>
  );
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  color = "from-blue-500 to-purple-600",
  onClick,
  features = []
}) => {
  return (
    <Card hover className="p-6 cursor-pointer group" onClick={onClick}>
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      
      {features.length > 0 && (
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Card;
