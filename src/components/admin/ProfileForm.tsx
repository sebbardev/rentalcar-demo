"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, CheckCircle } from "lucide-react";

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-100 text-green-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 shadow-sm">
          <div className="p-2 bg-green-100 rounded-xl">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Profil mis à jour avec succès</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300 shadow-sm">
          <div className="p-2 bg-red-100 rounded-xl">
            <Lock size={20} className="text-red-600" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Informations de base */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="h-2 w-2 bg-[var(--color-highlight)] rounded-full animate-pulse" />
            <h3 className="admin-section-title">Informations Générales</h3>
          </div>
          
          <div className="space-y-2">
            <label className="admin-label ml-2">Nom Complet</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="admin-input"
                placeholder="VOTRE NOM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="admin-label ml-2">Email Professionnel</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="admin-input"
                placeholder="VOTRE@EMAIL.COM"
              />
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="h-2 w-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
            <h3 className="admin-section-title">Sécurité & Mot de passe</h3>
          </div>
          
          <div className="space-y-2">
            <label className="admin-label ml-2">Mot de passe actuel</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
              <input
                type="password"
                name="currentPassword"
                placeholder="MOT DE PASSE ACTUEL"
                value={formData.currentPassword}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="admin-label ml-2">Nouveau mot de passe</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="admin-input pl-6"
                placeholder="NOUVEAU"
              />
            </div>
            <div className="space-y-2">
              <label className="admin-label ml-2">Confirmer</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="admin-input pl-6"
                placeholder="CONFIRMER"
              />
            </div>
          </div>
          
          {/* Security hint */}
          <div className="bg-[var(--color-bg)] border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
            <Lock size={16} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
            <p className="text-[9px] text-gray-400 font-bold leading-relaxed">
              Le mot de passe doit contenir au moins 8 caractères. Laissez vide si vous ne souhaitez pas le modifier.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="admin-btn-primary"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              TRAITEMENT...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              ENREGISTRER LES MODIFICATIONS
            </>
          )}
        </button>
      </div>
    </form>
  );
}
