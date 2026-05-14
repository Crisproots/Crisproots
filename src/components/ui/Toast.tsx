import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onRemove
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-yellow-500 to-orange-600',
    info: 'from-blue-500 to-cyan-600'
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`${bgColors[type]} border rounded-xl shadow-lg p-4 mb-3 max-w-sm`}>
        <div className="flex items-start">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colors[type]} mr-3 flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(id), 300);
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default Toast;
