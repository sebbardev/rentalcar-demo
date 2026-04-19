import React from "react";
import { UseFormReturn, FieldError } from "react-hook-form";
import { ContractFormValues } from "@/hooks/admin/useContractForm";
import { AlertCircle, Loader2 } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  name?: string;
}

export function FormField({ label, error, children, className = "", required = false, name }: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={name}
        className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        {children}
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none z-10">
            <AlertCircle size={16} />
          </div>
        )}
      </div>
      {error && (
        <p 
          id={`${name}-error`}
          className="text-[9px] font-bold text-red-500 uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

interface AdaptiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register: any;
  name: keyof ContractFormValues;
  icon?: React.ReactNode;
}

export function AdaptiveInput({ register, name, className = "", icon, ...props }: AdaptiveInputProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors">
          {icon}
        </div>
      )}
      <input
        {...register(name)}
        id={name}
        aria-describedby={props["aria-invalid"] ? `${name}-error` : undefined}
        className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 ${icon ? 'pl-12' : 'px-5'} pr-4 text-[var(--color-text)] text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
}

interface AdaptiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  register: any;
  name: keyof ContractFormValues;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

export function AdaptiveSelect({ register, name, options, placeholder, className = "", icon, ...props }: AdaptiveSelectProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <select
        {...register(name)}
        id={name}
        className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 ${icon ? 'pl-12' : 'px-5'} pr-10 text-[var(--color-text)] text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all appearance-none ${className}`}
        {...props}
      >
        <option value="">{placeholder || "-- Sélectionner --"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight flex items-center gap-3">
        <div className="h-8 w-1.5 bg-[var(--color-primary)] rounded-full" />
        {title}
      </h3>
      {subtitle && <p className="text-[var(--color-text-muted)] font-light mt-2 ml-5">{subtitle}</p>}
    </div>
  );
}

export function AdminCard({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={`bg-white p-8 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden ${className}`}>
      {title && (
        <h3 className="text-xs font-black text-[var(--color-primary)] mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
          <div className="w-2 h-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function AdminButton({ children, className = "", loading, ...props }: any) {
  return (
    <button 
      {...props}
      disabled={loading || props.disabled}
      className={`bg-[var(--color-accent)] hover:bg-[#557a2d] text-white font-black uppercase tracking-[0.2em] py-6 px-16 rounded-[2rem] transition-all shadow-xl shadow-green-900/10 disabled:opacity-50 active:scale-95 flex items-center gap-4 text-xs ${className}`}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
}
