import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "gradient-button text-white focus:ring-primary",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
    xl: "text-lg px-8 py-4",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;