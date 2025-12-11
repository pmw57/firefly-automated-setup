import React from 'react';

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
  const baseStyle = "px-6 py-3 rounded-lg font-bold transition duration-300 ease-in-out transform active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-green-800 text-white hover:bg-green-900 focus:ring-green-500 border border-green-900 dark:bg-green-900 dark:text-green-100 dark:border-green-800 dark:hover:bg-green-950";
      break;
    case 'secondary':
      variantStyle = "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 border border-amber-800 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-800 dark:hover:bg-amber-950";
      break;
    case 'danger':
      variantStyle = "bg-red-800 text-white hover:bg-red-900 focus:ring-red-500 border border-red-900 dark:bg-red-900/80 dark:text-red-100 dark:border-red-900";
      break;
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