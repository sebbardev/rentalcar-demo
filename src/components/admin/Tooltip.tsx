'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  className?: string;
}

export default function Tooltip({ content, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Info 
        size={14} 
        className="text-gray-400 hover:text-[var(--color-secondary)] cursor-help transition-colors" 
      />
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in">
          <div className="bg-[var(--color-dark)] text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap max-w-xs">
            {content}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2">
              <div className="border-4 border-transparent border-t-[var(--color-dark)]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
