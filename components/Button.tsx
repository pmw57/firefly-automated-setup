
import React from 'react';
import { useTheme } from './ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();
  
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition duration-300 ease-in-out transform active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 border-b-4 active:border-b-0 active:translate-y-1";
  
  let variantStyle = "";
  
  if (theme === 'dark') {
    // Dark Mode Styles
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
    // Light Mode Styles
    switch (variant) {
      case 'primary':
        variantStyle = "bg-emerald-700 text-emerald-50 border-emerald-900 hover:bg-emerald-600 focus:ring-emerald-500";
        break;
      case 'secondary':
        variantStyle = "bg-amber-700 text-amber-50 border-amber-900 hover:bg-amber-600 focus:ring-amber-500";
        break;
      case 'danger':
        variantStyle = "bg-red-800 text-red-50 border-red-950 hover:bg-red-700 focus:ring-red-500";
        break;
    }
  }

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${widthStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
