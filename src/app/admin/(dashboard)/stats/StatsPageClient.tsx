"use client";

import { useState, useEffect } from "react";
import AdminStatsClient from "./AdminStatsClient";
import { useStatsDashboard, StatsDashboard } from "@/hooks/useStatsDashboard";
import { Loader2, Calendar, Car, Filter } from "lucide-react";
import { getAllCars, Car as CarType } from "@/services/carService";

type Period = "all" | "month" | "quarter" | "year" | "custom";

// Adapter StatsDashboard to Stats interface
function adaptStatsToStatsInterface(data: StatsDashboard) {
  return {
    totalCars: data.totalCars,
    activeBookings: data.activeBookings,
    pendingBookings: data.pendingBookings,
    completedBookings: data.completedBookings,
    totalRevenue: data.totalRevenue,
    totalExpenses: data.totalExpenses,
    netGain: data.netGain,
    monthlyData: data.monthlyData,
    expenseTypeStats: data.expenseTypeStats,
    carsProfit: data.carsProfit,
    recentBookings: data.recentBookings,
    pendingReturns: data.pendingReturns,
    carAvailability: data.carAvailability,
  };
}

export default function AdminStatsPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [cars, setCars] = useState<CarType[]>([]);

  // Charger la liste des voitures
  useEffect(() => {
    getAllCars().then(setCars).catch(console.error);
  }, []);

  const { data, loading, error, refetch } = useStatsDashboard({
    period,
    from: from || undefined,
    to: to || undefined,
    car_id: selectedCarId || undefined,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-[var(--color-primary)]" size={48} />
          <p className="admin-label">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="admin-label text-red-500 mb-4">Erreur: {error || "Données non disponibles"}</p>
          <button
            onClick={refetch}
            className="admin-btn-secondary"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const adaptedStats = adaptStatsToStatsInterface(data);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Car Selector */}
          <div className="flex items-center gap-2">
            <Car size={18} className="text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Véhicule:</span>
          </div>
          
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:border-gray-400 transition-colors min-w-[200px]"
          >
            <option value="">Tous les véhicules</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.model}
              </option>
            ))}
          </select>

          <div className="h-8 w-px bg-gray-300 mx-2" />

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[var(--color-primary)]" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Période:</span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "Tout" },
              { value: "month", label: "Ce mois" },
              { value: "quarter", label: "Ce trimestre" },
              { value: "year", label: "Cette année" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value as Period)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  period === p.value
                    ? "bg-[var(--color-primary)] text-[#1C2942]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPeriod("custom");
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm [color-scheme:dark]"
            />
            <span className="text-gray-400">→</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPeriod("custom");
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm [color-scheme:dark]"
            />
          </div>

          {/* Reset Filters */}
          {(selectedCarId || from || to) && (
            <button
              onClick={() => {
                setSelectedCarId("");
                setFrom("");
                setTo("");
                setPeriod("all");
              }}
              className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Filter size={14} />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedCarId || from || to) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Filtres actifs:</span>
            {selectedCarId && (
              <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-bold">
                {cars.find(c => c.id === selectedCarId)?.brand} {cars.find(c => c.id === selectedCarId)?.model}
              </span>
            )}
            {from && to && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                {new Date(from).toLocaleDateString('fr-FR')} → {new Date(to).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats Content */}
      <AdminStatsClient initialStats={adaptedStats} />
    </div>
  );
}
