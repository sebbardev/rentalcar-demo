'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface FloatingLabelSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  className?: string;
}

export default function FloatingLabelSelect({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  className = '',
}: FloatingLabelSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`
            w-full px-5 py-4 pt-6 pb-2 bg-[var(--color-bg)] border-2 rounded-xl
            outline-none transition-all duration-300 text-sm font-bold appearance-none cursor-pointer
            ${isFocused 
              ? 'border-[var(--color-secondary)] ring-4 ring-[var(--color-secondary)]/10 shadow-lg shadow-[var(--color-secondary)]/5 scale-[1.02]' 
              : 'border-transparent hover:border-gray-200'
            }
          `}
        >
          <option value="">-- Sélectionner --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`
            absolute left-5 transition-all duration-300 pointer-events-none font-black uppercase tracking-[0.15em]
            ${isFloating
              ? 'top-2 text-[8px] text-[var(--color-secondary)]'
              : 'top-1/2 -translate-y-1/2 text-[9px] text-gray-400'
            }
          `}
        >
          {label}
        </label>

        {/* Display selected value when not focused */}
        {!isFocused && hasValue && selectedOption && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-sm font-bold text-[var(--color-text-main)]">
              {selectedOption.label}
            </span>
          </div>
        )}

        {/* Custom Chevron Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown 
            className={`h-5 w-5 transition-transform duration-300 ${
              isFocused ? 'rotate-180 text-[var(--color-secondary)]' : 'text-gray-400'
            }`} 
          />
        </div>
      </div>
    </div>
  );
}
