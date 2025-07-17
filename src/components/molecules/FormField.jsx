import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required, 
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (children) {
      return children;
    }
    
    switch (type) {
      case "select":
        return <Select {...props} />;
      case "textarea":
        return <Textarea {...props} />;
      default:
        return <Input type={type} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      {renderInput()}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;