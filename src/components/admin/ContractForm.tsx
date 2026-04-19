"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Car as CarIcon, 
  Calendar, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2, 
  Plus, 
  Trash2,
  AlertCircle,
  FileText,
  Building2,
  Gauge,
  Fuel,
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  Phone,
  Mail,
  Home,
  Hash
} from "lucide-react";
import { useContractForm } from "@/hooks/admin/useContractForm";
import { 
  FormField, 
  AdaptiveInput, 
  AdaptiveSelect, 
  SectionTitle 
} from "./contracts/AdaptiveFormFields";
import SuccessMessage from "./SuccessMessage";

interface ContractFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
  prefillFromBookingId?: string | null;
}

const STEPS = [
  { id: "VEHICLE", label: "Véhicule", icon: CarIcon },
  { id: "DRIVER", label: "Conducteur", icon: User },
  { id: "FINANCIALS", label: "Paiement", icon: CreditCard },
];

export default function ContractForm({ initialData, onSuccess, onCancel, prefillFromBookingId }: ContractFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const {
    form,
    loading,
    isFetching,
    cars,
    bookings,
    customers,
    handleBookingSelect,
    handleCustomerSelect,
    calculateTotalPrice,
    onSubmit,
  } = useContractForm({ 
    initialData, 
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }, 
    prefillFromBookingId 
  });

  const { register, watch, formState: { errors }, setValue } = form;

  const contractType = watch("contract_type");
  const hasSecondDriver = watch("has_second_driver");
  const isPaid = watch("is_paid");

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Synchronisation des ressources...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {submitted ? (
        <SuccessMessage
          title="Contrat"
          highlightedText={initialData ? "Mis à jour !" : "Créé avec succès !"}
          message={initialData 
            ? "Le contrat a été modifié avec succès."
            : "Le contrat a été créé avec succès. Vous pouvez maintenant le consulter et le gérer."
          }
        />
      ) : (
        <>
      {/* Stepper Header */}
      <div className="mb-10 flex items-center justify-between px-4">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center group">
            <div className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                  idx <= currentStep 
                    ? "bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/20 scale-110" 
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <step.icon size={18} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                idx <= currentStep ? "text-[var(--color-primary)]" : "text-gray-300"
              }`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-[2px] w-8 md:w-20 mx-2 transition-all duration-700 rounded-full ${
                idx < currentStep ? "bg-[var(--color-primary)]" : "bg-gray-100"
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* STEP 0: VEHICLE */}
            {currentStep === 0 && (
              <motion.div
                key="step-vehicle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionTitle title="Véhicule & État" subtitle="Sélection, kilométrage et accessoires" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Véhicule" error={errors.car_id} required className="md:col-span-2" name="car_id">
                    <AdaptiveSelect 
                      register={register} 
                      name="car_id"
                      icon={<CarIcon size={18} />}
                      options={cars.map(c => ({ value: c.id, label: `${c.brand} ${c.model} (${c.price_per_day} MAD/j)` }))}
                    />
                  </FormField>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[var(--color-bg)] rounded-3xl">
                    <FormField label="Kilométrage Départ" error={errors.initial_mileage} required name="initial_mileage">
                      <AdaptiveInput 
                        register={register} 
                        name="initial_mileage" 
                        type="number" 
                        icon={<Gauge size={18} />}
                      />
                    </FormField>

                    <FormField label="Niveau Carburant" error={errors.fuel_level} required name="fuel_level">
                      <AdaptiveSelect 
                        register={register} 
                        name="fuel_level"
                        icon={<Fuel size={18} />}
                        options={[
                          { value: "RESERVE", label: "Réserve" },
                          { value: "1/4", label: "1/4" },
                          { value: "2/4", label: "1/2 (2/4)" },
                          { value: "3/4", label: "3/4" },
                          { value: "FULL", label: "Plein" },
                        ]}
                      />
                    </FormField>

                    <div className="space-y-3">
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Package size={14} /> Accessoires Inclus
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: "ROUE_SECOURS", label: "Secours" },
                          { id: "CRIC", label: "Cric" },
                          { id: "EXTINCTEUR", label: "Extincteur" },
                          { id: "GILETS", label: "Gilets" },
                        ].map((acc) => (
                          <label key={acc.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 cursor-pointer hover:border-[var(--color-secondary)] transition-all">
                            <input 
                              type="checkbox" 
                              value={acc.id}
                              {...register("included_accessories")}
                              className="w-4 h-4 accent-[var(--color-secondary)] rounded"
                            />
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">{acc.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <FormField label="Date de Début" error={errors.start_date} required name="start_date">
                    <AdaptiveInput register={register} name="start_date" type="datetime-local" icon={<Calendar size={18} />} />
                  </FormField>

                  <FormField label="Date de Fin" error={errors.end_date} required name="end_date">
                    <AdaptiveInput register={register} name="end_date" type="datetime-local" icon={<Calendar size={18} />} />
                  </FormField>

                  <FormField label="Lieu de Livraison" error={errors.pickup_location} required name="pickup_location">
                    <AdaptiveInput register={register} name="pickup_location" placeholder="E.g. Agence, Aéroport..." icon={<MapPin size={18} />} />
                  </FormField>

                  <FormField label="Lieu de Retour" error={errors.return_location} required name="return_location">
                    <AdaptiveInput register={register} name="return_location" placeholder="E.g. Agence, Aéroport..." icon={<MapPin size={18} />} />
                  </FormField>
                </div>

                <div className="p-6 bg-[var(--color-bg)] rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimation du Coût</p>
                      <p className="text-2xl font-black text-[var(--color-highlight)] tracking-tighter">
                        {calculateTotalPrice().toLocaleString()} <span className="text-xs not-italic opacity-50 ml-1">MAD</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100">
                      {watch("car_id") ? `${cars.find(c => c.id === watch("car_id"))?.price_per_day} MAD / jour` : "Tarif journalier"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1: DRIVER */}
            {currentStep === 1 && (
              <motion.div
                key="step-driver"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionTitle title="Locataire" subtitle="Informations du conducteur principal" />
                
                {contractType === "CORPORATE" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[var(--color-bg)] rounded-3xl mb-8">
                    <FormField label="Société" error={errors.company_name} required name="company_name">
                      <AdaptiveInput register={register} name="company_name" placeholder="Nom de l'entreprise" icon={<Building2 size={18} />} />
                    </FormField>
                    <FormField label="ICE" error={errors.company_ice} required name="company_ice">
                      <AdaptiveInput register={register} name="company_ice" placeholder="Identifiant Fiscal" icon={<Hash size={18} />} />
                    </FormField>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Prénom" error={errors.driver_first_name} required name="driver_first_name">
                    <AdaptiveInput register={register} name="driver_first_name" icon={<User size={18} />} />
                  </FormField>
                  <FormField label="Nom" error={errors.driver_last_name} required name="driver_last_name">
                    <AdaptiveInput register={register} name="driver_last_name" icon={<User size={18} />} />
                  </FormField>
                  <FormField label="N° Permis" error={errors.driver_license_number} required name="driver_license_number">
                    <AdaptiveInput register={register} name="driver_license_number" icon={<FileText size={18} />} />
                  </FormField>
                  <FormField label="Date Délivrance" error={errors.driver_license_date} required name="driver_license_date">
                    <AdaptiveInput register={register} name="driver_license_date" type="date" icon={<Calendar size={18} />} />
                  </FormField>
                  <FormField label="CIN / Passeport" error={errors.driver_cin_number} required name="driver_cin_number">
                    <AdaptiveInput register={register} name="driver_cin_number" icon={<Hash size={18} />} />
                  </FormField>
                  <FormField label="Adresse" error={errors.driver_address} required name="driver_address" className="md:col-span-2">
                    <AdaptiveInput register={register} name="driver_address" placeholder="Adresse de résidence complète" icon={<Home size={18} />} />
                  </FormField>
                  <FormField label="Téléphone" error={errors.driver_phone} required name="driver_phone">
                    <AdaptiveInput register={register} name="driver_phone" type="tel" icon={<Phone size={18} />} />
                  </FormField>
                  <FormField label="Email" error={errors.driver_email} required name="driver_email">
                    <AdaptiveInput register={register} name="driver_email" type="email" icon={<Mail size={18} />} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* STEP 2: FINANCIALS */}
            {currentStep === 2 && (
              <motion.div
                key="step-financials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <SectionTitle title="Finances" subtitle="Caution, franchise et paiement" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <FormField label="Caution" error={errors.deposit_amount} required name="deposit_amount">
                      <AdaptiveInput register={register} name="deposit_amount" type="number" icon={<ShieldCheck size={18} />} />
                    </FormField>

                    <FormField label="Franchise" error={errors.insurance_deductible} required name="insurance_deductible">
                      <AdaptiveInput register={register} name="insurance_deductible" type="number" icon={<AlertCircle size={18} />} />
                    </FormField>

                    <FormField label="Mode de Paiement" error={errors.payment_method} required name="payment_method">
                      <AdaptiveSelect 
                        register={register} 
                        name="payment_method"
                        icon={<CreditCard size={18} />}
                        options={[
                          { value: "CASH", label: "Espèces" },
                          { value: "CARD", label: "Carte Bancaire" },
                          { value: "TRANSFER", label: "Virement" },
                          { value: "CHEQUE", label: "Chèque" },
                        ]}
                      />
                    </FormField>

                    <div className="flex items-center gap-4 p-5 bg-[var(--color-bg)] rounded-2xl">
                      <input 
                        type="checkbox" 
                        {...register("is_paid")} 
                        className="w-5 h-5 accent-[var(--color-secondary)] rounded-lg cursor-pointer"
                      />
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer">
                        Paiement intégral reçu
                      </label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-[var(--color-bg)] rounded-[2rem]">
                      <div className="flex items-center justify-between mb-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conducteur Secondaire</label>
                        <button
                          type="button"
                          onClick={() => setValue("has_second_driver", !hasSecondDriver)}
                          className={`w-12 h-6 rounded-full transition-all relative ${hasSecondDriver ? "bg-[var(--color-secondary)]" : "bg-gray-200"}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${hasSecondDriver ? "left-7" : "left-1"}`} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {hasSecondDriver && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <AdaptiveInput register={register} name="second_driver_first_name" placeholder="PRÉNOM" icon={<User size={14} />} />
                            <AdaptiveInput register={register} name="second_driver_last_name" placeholder="NOM" icon={<User size={14} />} />
                            <AdaptiveInput register={register} name="second_driver_license_number" placeholder="N° PERMIS" icon={<FileText size={14} />} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 blur-2xl" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Montant Total</p>
                      <h4 className="text-4xl font-black tracking-tighter">
                        {calculateTotalPrice().toLocaleString()} <span className="text-sm not-italic text-white/40 ml-2 uppercase">MAD</span>
                      </h4>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-auto px-12 py-5 bg-white text-[var(--color-primary)] rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      {initialData ? "Sauvegarder" : "Vérifier le contrat"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form Actions Footer */}
        <div className="bg-[var(--color-bg)] p-6 flex items-center justify-between">
          <button
            type="button"
            onClick={currentStep === 0 ? onCancel : prevStep}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            {currentStep === 0 ? "Fermer" : "Précédent"}
          </button>
          
          {currentStep < STEPS.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="px-10 py-4 bg-[var(--color-bg)] border border-gray-200 text-[var(--color-text)] rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-2 hover:border-[var(--color-secondary)] hover:shadow-lg transition-all"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </form>
        </>
      )}
    </div>
  );
}
