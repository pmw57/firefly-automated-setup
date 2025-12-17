import React from 'react';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}: ButtonProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition duration-300 ease-in-out transform active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 border-b-4 active:border-b-0 active:translate-y-1";
  
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

  return (
    <button 
      className={cls(baseStyle, variantStyle, fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
};