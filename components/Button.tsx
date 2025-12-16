
import React from 'react';
import { useTheme } from './ThemeContext';

// FIX: Changed interface to a type alias with an intersection to correctly include all button attributes.
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
  
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition duration-300 ease-in-out transform active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 border-b-4 active:border-b-0 active:translate-y-1";
  
  let variantStyle = "";
  
  if (theme === 'dark') {
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
        // Deep Burgundy like the game box/logo
        variantStyle = "bg-[#7f1d1d] text-[#fef3c7] border-[#450a0a] hover:bg-[#991b1b] focus:ring-[#d4af37]";
        break;
      case 'secondary':
        // Worn Leather/Amber
        variantStyle = "bg-[#d97706] text-white border-[#78350f] hover:bg-[#b45309] focus:ring-[#f59e0b]";
        break;
      case 'danger':
        variantStyle = "bg-red-700 text-white border-red-900 hover:bg-red-600 focus:ring-red-500";
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
