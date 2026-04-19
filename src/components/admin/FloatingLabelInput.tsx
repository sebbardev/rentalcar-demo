'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface FloatingLabelInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  validate?: (value: string) => string | null;
  placeholder?: string;
  className?: string;
}

export default function FloatingLabelInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  validate,
  placeholder,
  className = '',
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  useEffect(() => {
    if (validate && hasValue) {
      const error = validate(value);
      setValidationError(error);
      setIsValid(error === null);
    } else if (!hasValue) {
      setIsValid(null);
      setValidationError(null);
    }
  }, [value, validate, hasValue]);

  const displayError = error || validationError;
  const showSuccess = isValid && !isFocused;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          placeholder={isFocused ? placeholder : undefined}
          className={`
            w-full px-5 py-4 pt-6 pb-2 bg-[var(--color-bg)] border-2 rounded-xl
            outline-none transition-all duration-300 text-sm font-bold
            ${displayError
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : showSuccess
              ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
              : 'border-transparent focus:border-[var(--color-secondary)] focus:ring-4 focus:ring-[var(--color-secondary)]/10'
            }
            ${isFocused ? 'shadow-lg shadow-[var(--color-secondary)]/5 scale-[1.02]' : 'hover:border-gray-200'}
          `}
        />
        
        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`
            absolute left-5 transition-all duration-300 pointer-events-none font-black uppercase tracking-[0.15em]
            ${isFloating
              ? 'top-2 text-[8px] text-[var(--color-secondary)]'
              : 'top-1/2 -translate-y-1/2 text-[9px] text-gray-400'
            }
            ${displayError && isFloating ? 'text-red-500' : ''}
            ${showSuccess && isFloating ? 'text-green-500' : ''}
          `}
        >
          {label}
        </label>

        {/* Validation Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {displayError ? (
            <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
          ) : showSuccess ? (
            <Check className="h-4 w-4 text-green-500 animate-scale-in" />
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider animate-fade-in pl-2">
          {displayError}
        </p>
      )}
    </div>
  );
}
