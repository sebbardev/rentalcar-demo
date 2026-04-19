"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email.toLowerCase(), // Envoyer en minuscule
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants invalides");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
          {error}
        </div>
      )}

      {/* DEMO MODE: Show credentials */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-xs space-y-1">
        <p className="font-bold uppercase tracking-wider mb-2">🔑 Demo Credentials:</p>
        <p><span className="font-semibold">Email:</span> admin@car-rental.com</p>
        <p><span className="font-semibold">Password:</span> admin123</p>
      </div>

      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Professionnel</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-[var(--color-text-main)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
            placeholder="admin@car-rental.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-[var(--color-text-main)] rounded-2xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--color-primary)] hover:bg-[#055a7a] text-white font-black uppercase tracking-wider py-4 rounded-2xl transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Accéder au Dashboard"
        )}
      </button>
    </form>
  );
}
