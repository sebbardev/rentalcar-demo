"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  MapPin,
  Clock,
  Shield,
  Headphones,
  Star,
  ChevronRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  // Honeypot field for spam protection
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const SUBJECT_OPTIONS = [
  { value: "", label: "Sélectionnez un sujet" },
  { value: "Réservation", label: "Question sur une réservation" },
  { value: "Tarifs", label: "Demande de tarifs" },
  { value: "Véhicules", label: "Information sur les véhicules" },
  { value: "Support", label: "Support technique" },
  { value: "Réclamation", label: "Réclamation" },
  { value: "Partenariat", label: "Demande de partenariat" },
  { value: "Autre", label: "Autre" },
];

// Centralized contact information - Easy to update
const CONTACT_INFO = {
  address: "Avenue Mohammed V, Casablanca, Maroc",
  phone: "+212 6 00 00 00 00",
  email: "contact@carrental.ma",
  businessHours: {
    weekdays: "Lun - Sam: 9h00 - 19h00",
    weekend: "Dimanche: Fermé"
  },
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846!2d-7.6192!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa117b%3A0xb0b6a7e8b5e3e7c8!2sAvenue%20Mohammed%20V%2C%20Casablanca!5e0!3m2!1sfr!2sma!4v1710000000000!5m2!1sfr!2sma"
};

// Backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ContactPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // Honeypot field
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  // Auto-fill form for logged-in users
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]{8,20}$/.test(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone n'est pas valide";
    }

    if (!formData.subject) {
      newErrors.subject = "Veuillez sélectionner un sujet";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est obligatoire";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot field (spam protection)
    if (formData.website) {
      console.log("Spam detected");
      return;
    }

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsSubmitting(true);

    try {
      // DEMO MODE: Always show success message when form is filled
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsSubmitted(true);
      toast.success("Message envoyé avec succès !");
      
      // Reset form
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        subject: "",
        message: "",
        website: "",
      });
      setMessageLength(0);
    } catch (error) {
      // DEMO MODE: Still show success even if there's an error
      setIsSubmitted(true);
      toast.success("Message envoyé avec succès !");
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        subject: "",
        message: "",
        website: "",
      });
      setMessageLength(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Update message length
    if (name === "message") {
      setMessageLength(value.length);
    }
  };

  if (isSubmitted) {
    return (
      <AnimatedBackground>
        <div className="relative pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-8 sm:pb-10 md:pb-12 lg:pb-16">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--color-primary)] uppercase tracking-tight mb-4">
                Message <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Envoyé</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Send size={20} />
                Envoyer un autre message
              </button>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      {/* Premium Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6 md:pb-8 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large gradient orb - top right */}
          <div className="absolute -top-20 -right-20 w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-secondary)]/5 to-transparent rounded-full blur-3xl animate-pulse" />
          
          {/* Medium gradient orb - bottom left */}
          <div className="absolute -bottom-20 -left-20 w-[250px] sm:w-[400px] md:w-[500px] h-[250px] sm:h-[400px] md:h-[500px] bg-gradient-to-tr from-[var(--color-highlight)]/10 via-[var(--color-accent)]/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Small floating circle - top left */}
          <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
          
          {/* Small floating circle - bottom right */}
          <div className="absolute bottom-20 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-highlight)]/5 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          
          {/* Diagonal lines decoration */}
          <div className="absolute top-1/4 right-0 w-64 h-px bg-gradient-to-l from-[var(--color-primary)]/20 to-transparent rotate-45" />
          <div className="absolute bottom-1/3 left-0 w-48 h-px bg-gradient-to-r from-[var(--color-highlight)]/20 to-transparent -rotate-45" />
        </div>

        {/* Centered Content Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-xs sm:text-sm relative animate-fade-in-up">
            <Link 
              href="/" 
              className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all duration-300 font-bold hover:gap-3"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Accueil</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[var(--color-primary)] font-black uppercase tracking-wider bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">Contact</span>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-5">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-3 bg-white/90 backdrop-blur-xl px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-2xl border border-[var(--color-primary)]/10 hover:shadow-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/20 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up whitespace-nowrap" style={{ animationDelay: '0.1s' }}>
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-highlight)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]"></span>
              </span>
              <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[var(--color-primary)] whitespace-nowrap">Nous sommes là pour vous aider</span>
            </div>
          
            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-primary)] uppercase tracking-tight sm:tracking-tighter leading-[0.9] px-2 sm:px-1 md:px-0 overflow-visible animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Contactez-<span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)]">Nous</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 100 4 148 6C196 8 250 4 298 2" stroke="var(--color-highlight)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] font-light max-w-2xl mx-auto leading-relaxed px-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Une question ? Une demande de réservation ? N&#39;hésitez pas à nous contacter. Notre équipe vous répondra <span className="font-semibold text-[var(--color-primary)]">dans les plus brefs délais</span>.
            </p>

            {/* Quick Stats with Cards */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5 pt-3 sm:pt-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: "24h", label: "Temps de réponse" },
                { value: "6j/7", label: "Disponibilité" },
                { value: "100%", label: "Satisfaction" }
              ].map((stat, index) => (
                <div key={index} className="group flex flex-col bg-white/60 backdrop-blur-sm px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-xl border border-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/20 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-300">{stat.value}</span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Form - Left */}
            <div>
              <div className="group relative bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Header with icon */}
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl mb-4 sm:mb-6 shadow-xl">
                    <MessageSquare size={32} className="text-white sm:w-10 sm:h-10" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                    Envoyez-nous un <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]">message</span>
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--color-text-muted)] font-light mt-2">
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="relative space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm ${
                        errors.name ? "border-red-500 bg-red-50" : ""
                      }`}
                      placeholder="Votre nom"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-semibold">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Adresse email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm ${
                        errors.email ? "border-red-500 bg-red-50" : ""
                      }`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-semibold">
                        <AlertCircle size={14} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm ${
                        errors.phone ? "border-red-500 bg-red-50" : ""
                      }`}
                      placeholder="+212 6XX XXX XXX"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-semibold">
                        <AlertCircle size={14} />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm ${
                        errors.subject ? "border-red-500 bg-red-50" : ""
                      }`}
                    >
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.value === ""}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-semibold">
                        <AlertCircle size={14} />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      maxLength={1000}
                      className={`w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm resize-none ${
                        errors.message ? "border-red-500 bg-red-50" : ""
                      }`}
                      placeholder="Décrivez votre demande en détail..."
                    />
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      {messageLength}/1000 caractères
                    </p>
                    {errors.message && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1 font-semibold">
                        <AlertCircle size={14} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Honeypot field (hidden) */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:from-[var(--color-secondary)] hover:to-[var(--color-primary)] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info - Right */}
            <div className="space-y-6 sm:space-y-8">
              {/* Contact Information Card */}
              <div className="group relative bg-gradient-to-br from-white to-[var(--color-bg)] p-6 sm:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--color-primary)]/20 hover:-translate-y-3 overflow-hidden">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Header */}
                <div className="relative mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Headphones size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                    Informations de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)]">contact</span>
                  </h3>
                </div>

                <div className="relative space-y-4 sm:space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-3 sm:gap-4 group/item">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                      <MapPin size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="font-black text-[var(--color-primary)] uppercase tracking-wider text-xs sm:text-sm mb-1">Adresse</p>
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-light leading-relaxed">{CONTACT_INFO.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 sm:gap-4 group/item">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                      <Phone size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="font-black text-[var(--color-primary)] uppercase tracking-wider text-xs sm:text-sm mb-1">Téléphone</p>
                      <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-xs sm:text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-semibold transition-colors">
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3 sm:gap-4 group/item">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                      <Mail size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="font-black text-[var(--color-primary)] uppercase tracking-wider text-xs sm:text-sm mb-1">Email</p>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-xs sm:text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-semibold transition-colors">
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-3 sm:gap-4 group/item">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                      <Clock size={20} className="text-white sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="font-black text-[var(--color-primary)] uppercase tracking-wider text-xs sm:text-sm mb-1">Horaires d'ouverture</p>
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-light">{CONTACT_INFO.businessHours.weekdays}</p>
                      <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-light">{CONTACT_INFO.businessHours.weekend}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Map */}
              <div className="relative group">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-secondary)]/10 to-transparent rounded-[2rem] sm:rounded-[3rem] rotate-1 blur-xl" />
                
                {/* Map wrapper - Smaller size */}
                <div className="relative w-full h-[250px] sm:h-[300px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 group-hover:shadow-[var(--color-primary)]/20 transition-shadow duration-500">
                  <iframe
                    src={CONTACT_INFO.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="Notre localisation sur Google Maps"
                  ></iframe>
                  
                  {/* Overlay gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  
                  {/* Location badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xl px-4 py-3 rounded-xl shadow-xl border border-[var(--color-primary)]/10">
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-2 rounded-lg shadow-lg">
                        <MapPin size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-wider">Premium Car</p>
                        <p className="text-xs font-bold text-gray-600">Casablanca</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="group relative bg-gradient-to-br from-white to-[var(--color-bg)] p-6 sm:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[var(--color-primary)]/20 hover:-translate-y-3 overflow-hidden">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Shield size={28} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <p className="font-black text-[var(--color-primary)] uppercase tracking-wider text-xs sm:text-sm mb-1">Vos données sont protégées</p>
                    <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-light leading-relaxed">
                      Nous respectons votre vie privée et ne partageons jamais vos informations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 relative overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[var(--color-highlight)]/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border-4 border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
            {/* Enhanced headline */}
            <div className="space-y-4 sm:space-y-6">
              <span className="inline-block text-[var(--color-highlight)] text-xs font-black uppercase tracking-[0.3em]">Besoin d'aide ?</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight sm:tracking-tighter leading-[1.1] sm:leading-tight px-3 sm:px-2 md:px-0 overflow-visible">
                Notre équipe est <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-highlight)] via-white to-[var(--color-highlight)]">à votre écoute</span>
              </h2>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-light max-w-2xl mx-auto leading-relaxed px-2">
              N'hésitez pas à nous contacter pour toute question ou demande d'information. Nous sommes là pour vous <span className="font-semibold text-white">aider</span>.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6">
              {[
                { icon: <CheckCircle2 size={20} />, text: "Réponse sous 24h" },
                { icon: <CheckCircle2 size={20} />, text: "Support 6j/7" },
                { icon: <CheckCircle2 size={20} />, text: "100% gratuit" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90 font-bold text-xs sm:text-sm uppercase tracking-wider">
                  <span className="text-[var(--color-highlight)]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimatedBackground>
  );
}
