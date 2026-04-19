'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
        {Icon && (
          <div className="p-2 bg-[var(--color-bg)] rounded-xl text-[var(--color-secondary)]">
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-highlight)] rounded-full" />
      </div>

      {/* Section Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
