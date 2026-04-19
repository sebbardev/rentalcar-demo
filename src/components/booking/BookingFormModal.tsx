"use client";

import { useState, useEffect } from "react";
import { Calendar, Send, X } from "lucide-react";
import { createBooking } from "@/services/bookingService";
import { toast } from "react-hot-toast";
import { Car } from "@/services/carService";
import { createPortal } from "react-dom";
import SuccessMessage from "@/components/admin/SuccessMessage";
import Image from "next/image";

interface BookingFormModalProps {
  car: Car;
}

export default function BookingFormModal({ car }: BookingFormModalProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "18:00",
    location: "Casablanca",
    returnLocation: "Casablanca",
  });

  const [mounted, setMounted] = useState(false);

  // Block body scroll and disable navbar when modal is open
  useEffect(() => {
    if (showBookingForm) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Disable navbar interactions
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.pointerEvents = 'none';
        (navbar as HTMLElement).style.opacity = '0';
        (navbar as HTMLElement).style.transition = 'opacity 0.3s ease';
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Restore navbar interactions
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.pointerEvents = 'auto';
        (navbar as HTMLElement).style.opacity = '1';
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.pointerEvents = 'auto';
        (navbar as HTMLElement).style.opacity = '1';
      }
    };
  }, [showBookingForm]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const calculateTotalPrice = () => {
    if (!bookingFormData.startDate || !bookingFormData.endDate) return 0;
    const start = new Date(bookingFormData.startDate);
    const end = new Date(bookingFormData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const calculateDays = () => {
    if (!bookingFormData.startDate || !bookingFormData.endDate) return 0;
    const start = new Date(bookingFormData.startDate);
    const end = new Date(bookingFormData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);

    try {
      const totalPrice = calculateTotalPrice();
      // Combine date and time into datetime format
      const startDateTime = `${bookingFormData.startDate} ${bookingFormData.startTime}:00`;
      const endDateTime = `${bookingFormData.endDate} ${bookingFormData.endTime}:00`;
      
      const bookingData = {
        car_id: car.id,
        first_name: bookingFormData.firstName,
        last_name: bookingFormData.lastName,
        email: bookingFormData.email,
        phone: bookingFormData.phone,
        start_date: startDateTime,
        end_date: endDateTime,
        location: bookingFormData.location,
        return_location: bookingFormData.returnLocation,
        daily_price: car.pricePerDay,
        total_price: totalPrice,
        status: "PENDING",
      };

      // DEMO MODE: Always show success message when form is filled
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBookingSubmitted(true);
      toast.success("Réservation créée avec succès !");
      setBookingFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        startDate: "",
        startTime: "09:00",
        endDate: "",
        endTime: "18:00",
        location: "Casablanca",
        returnLocation: "Casablanca",
      });
      setTimeout(() => {
        setBookingSubmitted(false);
        setShowBookingForm(false);
      }, 4000);
    } catch (error: any) {
      // DEMO MODE: Still show success even if there's an error
      setBookingSubmitted(true);
      toast.success("Réservation créée avec succès !");
      setTimeout(() => {
        setBookingSubmitted(false);
        setShowBookingForm(false);
      }, 4000);
    }
    
    setBookingSubmitting(false);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={() => {
        setShowBookingForm(false);
        setBookingSubmitted(false);
      }}
    >
      <div 
        id="booking-form-section"
        className="bg-white rounded-[2.5rem] p-8 sm:p-10 lg:p-12 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
        
        {bookingSubmitted ? (
          <SuccessMessage
            title="Réservation"
            highlightedText="Confirmée !"
            message="Votre réservation a été créée avec succès. Vous recevrez un email de confirmation shortly."
          />
        ) : (
          <>
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                  Réserver <span className="text-[var(--color-secondary)]">{car.brand} {car.model}</span>
                </h3>
                <p className="text-[var(--color-text-muted)] font-light">
                  Remplissez le formulaire pour réserver ce véhicule
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowBookingForm(false);
                  setBookingSubmitted(false);
                }}
                className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all ml-4 flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Car Main Image */}
            <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden mb-8">
              <Image
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                quality={90}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 inline-block shadow-lg">
                  <p className="text-sm font-black text-[var(--color-primary)] uppercase">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs font-bold text-[var(--color-secondary)] mt-1">
                    {car.pricePerDay} {car.currency}/jour
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6 relative z-10">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.firstName}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                    placeholder="Ahmed"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.lastName}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                    placeholder="Alami"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingFormData.email}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                    placeholder="ahmed@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                    placeholder="+212 6 00 00 00 00"
                  />
                </div>
              </div>

              {/* Dates & Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingFormData.startDate}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Heure de départ *
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingFormData.startTime}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingFormData.endDate}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={bookingFormData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Heure de retour *
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingFormData.endTime}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Lieu de prise en charge *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.location}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                    placeholder="Casablanca"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    Lieu de retour *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.returnLocation}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, returnLocation: e.target.value }))}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all font-bold text-sm"
                    placeholder="Casablanca"
                  />
                </div>
              </div>

              {/* Price Summary */}
              {calculateDays() > 0 && (
                <div className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 border-2 border-[var(--color-primary)]/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Durée</span>
                    <span className="text-lg font-black text-[var(--color-primary)]">{calculateDays()} jour{calculateDays() > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Tarif journalier</span>
                    <span className="text-base font-black text-[var(--color-primary)]">{car.pricePerDay} MAD</span>
                  </div>
                  <div className="border-t border-[var(--color-primary)]/20 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Total</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">{calculateTotalPrice()} MAD</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bookingSubmitting}
                className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {bookingSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Confirmer la Réservation
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Reservation Button */}
      <button
        onClick={() => setShowBookingForm(true)}
        className="group relative w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 shadow-2xl shadow-[var(--color-accent)]/30 hover:shadow-[var(--color-highlight)]/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 overflow-hidden mb-6"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <span className="relative flex items-center gap-3">
          <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
          Réserver Maintenant
        </span>
      </button>

      {/* Render modal via Portal to ensure it's centered in viewport */}
      {showBookingForm && mounted && createPortal(modalContent, document.body)}
    </>
  );
}
