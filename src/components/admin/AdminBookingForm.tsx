"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Calendar, 
  Clock,
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Car as CarIcon, 
  CreditCard,
  AlertTriangle,
  Loader2,
  CheckCircle
} from "lucide-react";
import { getAllCars, Car } from "@/services/carService";
import { createBooking } from "@/services/bookingService";
import SuccessMessage from "./SuccessMessage";
import FloatingLabelInput from "./FloatingLabelInput";
import FloatingLabelSelect from "./FloatingLabelSelect";
import FormSection from "./FormSection";

interface AdminBookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminBookingForm({ onClose, onSuccess }: AdminBookingFormProps) {
  const [mounted, setMounted] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    car_id: "",
    start_date: "2026-02-04",
    start_time: "09:00",
    end_date: "2026-12-04",
    end_time: "18:00",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "Agence",
    return_location: "Agence",
    daily_price: 250,
    status: "CONFIRMED"
  });

  const [days, setDays] = useState(304);
  const [totalPrice, setTotalPrice] = useState(76000);

  const selectedCar = cars.find((c) => c.id === formData.car_id);
  const carDisplayName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "";

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const allCars = await getAllCars();
        setCars(allCars);
        if (allCars.length > 0) {
          setFormData(prev => ({ ...prev, car_id: allCars[0].id }));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des voitures:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (formData.start_date && formData.end_date && formData.start_time && formData.end_time) {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
      
      if (!isNaN(startDateTime.getTime()) && !isNaN(endDateTime.getTime())) {
        const diffTime = Math.abs(endDateTime.getTime() - startDateTime.getTime());
        const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDays(calculatedDays > 0 ? calculatedDays : 1);
        setTotalPrice((calculatedDays > 0 ? calculatedDays : 1) * formData.daily_price);
      }
    }
  }, [formData.start_date, formData.end_date, formData.start_time, formData.end_time, formData.daily_price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const startDateTime = `${formData.start_date} ${formData.start_time}:00`;
      const endDateTime = `${formData.end_date} ${formData.end_time}:00`;

      await createBooking({
        ...formData,
        start_date: startDateTime,
        end_date: endDateTime,
        total_price: totalPrice
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la création de la réservation.");
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[85vh] overflow-y-auto relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
        
        {submitted ? (
          <div className="p-8 sm:p-10 lg:p-12">
            <SuccessMessage
              title="Réservation"
              highlightedText="Créée avec succès !"
              message="La réservation a été enregistrée avec succès. Elle est maintenant visible dans le planning."
              autoCloseDelay={3000}
              onClose={onClose}
            />
          </div>
        ) : (
        <>
        
        <div className="sticky top-0 z-20 bg-white rounded-t-[2.5rem] p-8 sm:p-10 lg:p-12 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-[var(--color-primary)] mb-2 uppercase">
                Nouvelle {carDisplayName ? <span className="text-[var(--color-secondary)]">Réservation • {carDisplayName}</span> : <span className="text-[var(--color-secondary)]">Réservation Admin</span>}
              </h2>
              <p className="text-[var(--color-text-muted)] font-light">
                Remplissez le formulaire pour créer cette réservation
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-[var(--color-bg)] rounded-xl text-gray-400 hover:text-[var(--color-primary)] transition-all ml-4 flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-600">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold uppercase tracking-wider leading-relaxed">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Véhicule</label>
                <div className="relative group">
                  <CarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <select
                    required
                    value={formData.car_id}
                    onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all appearance-none"
                  >
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model} ({car.plateNumber || 'Sans matricule'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Tarif Journalier (MAD)</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="number"
                    required
                    value={formData.daily_price}
                    onChange={(e) => setFormData({ ...formData, daily_price: parseFloat(e.target.value) })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Date de début</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Heure de départ</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Date de fin</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Heure de retour</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Prénom</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    placeholder="Ex: Ahmed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Nom</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    placeholder="Ex: Alami"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    placeholder="Ex: ahmed@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Téléphone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-secondary)] transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-[var(--color-text)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                    placeholder="Ex: +212 600000000"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-bg)] rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Durée totale</span>
                </div>
                <span className="text-sm font-black text-[var(--color-text)]">{days} Jours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tarif appliqué</span>
                </div>
                <span className="text-sm font-black text-[var(--color-text)]">{formData.daily_price} MAD/Jour</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[var(--color-highlight)]" />
                  <span className="text-xs font-black text-[var(--color-text)] uppercase tracking-wider">Montant Total</span>
                </div>
                <span className="text-2xl font-black text-[var(--color-highlight)]">
                  {totalPrice.toLocaleString()} <span className="text-xs not-italic text-gray-400">MAD</span>
                </span>
              </div>
            </div>

            {showConfirmation ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 bg-[var(--color-highlight)]/10 border border-[var(--color-highlight)]/20 rounded-2xl flex items-center gap-3 text-[var(--color-accent)]">
                  <AlertTriangle size={20} />
                  <p className="text-[10px] font-black uppercase tracking-wider">
                    Confirmer la réservation de {days} jours pour un total de {totalPrice.toLocaleString()} MAD ?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    className="w-full py-4 rounded-xl border border-gray-300 text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Confirmer"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-5 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white text-xs font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                Vérifier la réservation
              </button>
            )}
          </form>
        )}
        </div>
      </>
      )}
    </div>
  </div>
);

  return mounted ? createPortal(modalContent, document.body) : null;
}
