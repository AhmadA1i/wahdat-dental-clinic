import { useState } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name} is required`;
    }

    if (value && rule.minLength && value.toString().length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.maxLength && value.toString().length > rule.maxLength) {
      return `${name} must be no more than ${rule.maxLength} characters`;
    }

    if (value && rule.pattern && !rule.pattern.test(value.toString())) {
      return `${name} format is invalid`;
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateForm = (data: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(schema).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateSingleField = (name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return !error;
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors
  };
};