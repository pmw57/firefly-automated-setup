import React from 'react';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
};

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  disabled,
  ...props 
}: ButtonProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition duration-300 ease-in-out transform shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 border-b-4 flex items-center justify-center gap-2";
  const activeStyle = "active:scale-95 active:border-b-0 active:translate-y-1";
  
  let variantStyle = "";
  
  if (isDark) {
    // Dark Mode Styles (Space/Sci-Fi feel)
    switch (variant) {
      case 'primary':
        variantStyle = "bg-emerald-900 text-emerald-100 border-emerald-950 hover:bg-emerald-800 focus:ring-emerald-500";
        break;
      case 'secondary':
        variantStyle = "bg-amber-900/60 text-amber-100 border-amber-950 hover:bg-amber-800 focus:ring-amber-500";
        break;
      case 'danger':
        variantStyle = "bg-red-900 text-red-100 border-black hover:bg-red-800 focus:ring-red-500";
        break;
    }
  } else {
    // Light Mode Styles (Firefly Board Game feel: Burgundy, Leather, Gold)
    switch (variant) {
      case 'primary':
        variantStyle = "bg-firefly-red text-firefly-parchment-subtle border-firefly-red-dark hover:bg-firefly-red-light focus:ring-firefly-gold";
        break;
      case 'secondary':
        variantStyle = "bg-firefly-leather text-white border-firefly-brown hover:bg-firefly-leather-dark focus:ring-amber-500";
        break;
      case 'danger':
        variantStyle = "bg-red-700 text-white border-red-900 hover:bg-red-600 focus:ring-red-500";
        break;
    }
  }

  const disabledStyle = "opacity-60 cursor-not-allowed";

  return (
    <button 
      className={cls(
        baseStyle, 
        variantStyle, 
        fullWidth && "w-full", 
        !disabled && activeStyle,
        disabled && disabledStyle,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {disabled && <LoadingSpinner />}
      {children}
    </button>
  );
};
