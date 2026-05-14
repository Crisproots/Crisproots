import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 shadow-lg';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-500 shadow-green-200',
    secondary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500 shadow-blue-200',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 bg-transparent shadow-green-100',
    ghost: 'text-green-600 hover:bg-green-50 focus:ring-green-500 bg-transparent shadow-none hover:shadow-md',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : '';
  const widthStyles = fullWidth ? 'w-full' : '';
  const loadingStyles = loading ? 'cursor-wait' : '';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles} ${loadingStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      )}
      {!loading && icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};