"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  Car, 
  Calendar, 
  Filter,
  Loader2,
  Download,
  Plus,
  AlertTriangle,
  Clock,
  PieChart,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  X,
  History as HistoryIcon
} from "lucide-react";
import { getAllCars, Car as CarType } from "@/services/carService";
import { useStatsDashboard } from "@/hooks/useStatsDashboard";
import { getExpenses, deleteExpense, Expense } from "@/services/expenseService";
import { toast } from "react-hot-toast";

// Import des composants existants
import AdminStatsClient from "../stats/AdminStatsClient";
import ExpenseAnalytics from "@/components/admin/expenses/ExpenseAnalytics";

type Period = "all" | "month" | "quarter" | "year" | "custom";
type TabType = "overview" | "expenses" | "advanced";

// Stat Card Component - Style identique à /admin
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  highlight = false 
}: { 
  label: string; 
  value: string; 
  icon: any; 
  trend?: string;
  highlight?: boolean;
}) {
  return (
    <div className="admin-card group admin-card-hover !p-6">
      {/* Cercle décoratif en arrière-plan */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
      
      <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
        <div className="admin-icon-container">
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        <div className={`h-1 w-8 rounded-full group-hover:w-16 transition-all duration-700 ${
          highlight ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-highlight)]'
        }`} />
      </div>
      
      <p className="admin-label mb-1 md:mb-2 relative z-10 text-[9px] md:text-[10px]">{label}</p>
      <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] tracking-tighter relative z-10">
        {value}
      </h3>
      
      {trend && (
        <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase mt-2 relative z-10">
          {trend}
        </p>
      )}
    </div>
  );
}

export default function UnifiedDashboard() {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;

  // État des filtres globaux
  const [period, setPeriod] = useState<Period>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedCarId, setSelectedCarId] = useState<string>("");
  const [cars, setCars] = useState<CarType[]>([]);

  // État des onglets
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // État pour les charges
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Charger les voitures
  useEffect(() => {
    getAllCars().then(setCars).catch(console.error);
  }, []);

  // Charger les stats globales
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useStatsDashboard({
    period,
    from: from || undefined,
    to: to || undefined,
    car_id: selectedCarId || undefined,
  });

  // Charger les charges quand l'onglet est actif
  useEffect(() => {
    if (activeTab === "expenses") {
      loadExpenses();
    }
  }, [activeTab, selectedCarId, from, to]);

  const loadExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const data = await getExpenses({
        car_id: selectedCarId || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setExpenses(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des charges");
    } finally {
      setLoadingExpenses(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!accessToken || !confirm("Supprimer cette charge ?")) return;
    const res = await deleteExpense(id, accessToken);
    if (res.success) {
      toast.success("Charge supprimée");
      loadExpenses();
    } else {
      toast.error(res.error || "Erreur lors de la suppression");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Véhicule,Type,Montant,Date,Note"];
    const rows = expenses.map(
      (e) =>
        `${e.car?.brand} ${e.car?.model},${e.type},${e.amount},${e.date},${e.note || ""}`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `charges_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exportation terminée");
  };

  const resetFilters = () => {
    setSelectedCarId("");
    setFrom("");
    setTo("");
    setPeriod("all");
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={30} />
          </div>
          <p className="admin-label animate-pulse">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Filters Card - Premium Enhanced Style */}
      <div className="bg-gradient-to-br from-white via-white to-gray-50/30 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 p-6 md:p-8 lg:p-10 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[var(--color-accent)]/5 to-transparent rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none" />
        
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="relative">
                <div className="p-3 md:p-4 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl text-white shadow-xl shadow-[var(--color-primary)]/20">
                  <Filter size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-highlight)] rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="admin-section-title text-xl md:text-2xl tracking-tight text-[var(--color-primary)] font-black">Filtres <span className="text-[var(--color-secondary)]">Globaux</span></h3>
                <p className="text-[11px] md:text-[12px] text-gray-500 font-semibold mt-1">Personnalisez l'affichage des données selon vos besoins</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[var(--color-highlight)] via-[var(--color-accent)] to-[var(--color-primary)] rounded-full hidden sm:block" />
              <div className="px-3 py-1.5 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-lg border border-[var(--color-primary)]/20">
                <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-wider">Actifs</span>
              </div>
            </div>
          </div>
          
          {/* All filters in one row on desktop */}
          <div className="flex flex-col lg:flex-row gap-5 md:gap-6 lg:gap-8">
            {/* Car Selector */}
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-[var(--color-primary)]/10 rounded-lg">
                  <Car size={14} className="text-[var(--color-primary)]" />
                </div>
                <span className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-wider">Véhicule</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Car size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-all duration-300 z-10" />
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="relative w-full pl-12 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-xl text-xs md:text-[11px] font-bold text-gray-700 cursor-pointer hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all duration-300 appearance-none shadow-sm hover:shadow-md"
                >
                  <option value="">Tous les véhicules</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-primary)] z-10">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Period Selector - Premium */}
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-[var(--color-accent)]/10 rounded-lg">
                  <Filter size={14} className="text-[var(--color-accent)]" />
                </div>
                <span className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-wider">Période</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "all", label: "Tout" },
                  { value: "month", label: "Mois" },
                  { value: "quarter", label: "Trimestre" },
                  { value: "year", label: "Année" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value as Period)}
                    className={`
                      relative px-3 py-3 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-wider
                      transition-all duration-300 ease-out overflow-hidden
                      ${period === p.value
                        ? "text-white shadow-lg scale-[1.05]"
                        : "bg-white text-gray-600 hover:text-[var(--color-primary)] border-2 border-gray-100 hover:border-[var(--color-primary)]/30 hover:shadow-md"
                      }
                    `}
                    style={period === p.value ? {
                      background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`,
                      boxShadow: `0 8px 16px -4px var(--color-primary)40`
                    } : {}}
                  >
                    {period === p.value && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                    <span className="relative z-10">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range - Premium */}
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-[var(--color-highlight)]/10 rounded-lg">
                  <Filter size={14} className="text-[var(--color-highlight)]" />
                </div>
                <span className="text-[11px] md:text-[12px] font-black text-gray-700 uppercase tracking-wider">Période Personnalisée</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 group">
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setPeriod("custom");
                    }}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl text-[11px] md:text-[12px] font-bold text-gray-700 hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
                <div className="p-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg text-white shadow-md">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                  </svg>
                </div>
                <div className="relative flex-1 group">
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setPeriod("custom");
                    }}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl text-[11px] md:text-[12px] font-bold text-gray-700 hover:border-[var(--color-primary)]/40 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button - Enhanced */}
          {(selectedCarId || from || to) && (
            <div className="mt-8 pt-6 border-t-2 border-gray-100">
              <button
                onClick={resetFilters}
                className="group flex items-center gap-2 px-5 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-50 hover:border-red-300 hover:shadow-lg transition-all duration-300"
              >
                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation - Premium Modern Design */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50 p-3 md:p-4 mb-8 md:mb-10">
        <div className="flex items-stretch gap-2 md:gap-3">
          {[
            { 
              id: "overview" as TabType, 
              label: "Vue Globale", 
              icon: BarChart3, 
              color: "var(--color-primary)",
              colorSecondary: "var(--color-secondary)",
              stat: statsData ? `${statsData.totalRevenue.toLocaleString()} DH` : "...",
              statLabel: "Revenue"
            },
            { 
              id: "expenses" as TabType, 
              label: "Charges", 
              icon: Wallet, 
              color: "#ef4444",
              colorSecondary: "#f87171",
              stat: statsData ? `${statsData.totalExpenses.toLocaleString()} DH` : "...",
              statLabel: "Dépenses"
            },
            { 
              id: "advanced" as TabType, 
              label: "Analyse Avancée", 
              icon: TrendingUp, 
              color: "var(--color-accent)",
              colorSecondary: "var(--color-highlight)",
              stat: statsData ? `${statsData.netGain.toLocaleString()} DH` : "...",
              statLabel: "Profit"
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5
                  flex-1 px-3 md:px-6 lg:px-8 py-3 md:py-4 rounded-2xl
                  transition-all duration-300 ease-out
                  overflow-hidden group
                  ${isActive
                    ? "shadow-xl scale-[1.02]"
                    : "hover:bg-white/60 hover:shadow-md"
                  }
                `}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${tab.color}, ${tab.colorSecondary || tab.color})`,
                  boxShadow: `0 12px 24px -6px ${tab.color}50`
                } : {}}
              >
                {/* Background decoration */}
                {isActive && (
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-full" />
                  </div>
                )}
                
                {/* Icon */}
                <div className={`
                  relative z-10 p-2 md:p-2.5 rounded-xl transition-all duration-300
                  ${isActive 
                    ? "bg-white/25 backdrop-blur-sm" 
                    : "bg-gray-100 group-hover:bg-gray-200"
                  }
                `}>
                  <Icon 
                    size={18} 
                    className={`
                      md:w-[20px] md:h-[20px] transition-all duration-300
                      ${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-800"}
                    `}
                  />
                </div>
                
                {/* Label */}
                <span className={`
                  relative z-10 font-black text-[9px] md:text-[10px] uppercase tracking-wider
                  transition-all duration-300 whitespace-nowrap
                  ${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-800"}
                `}>
                  {tab.label}
                </span>
                
                {/* Mini Stat */}
                <div className="relative z-10 text-center">
                  <span className={`
                    block font-black text-[10px] md:text-[11px] leading-tight
                    transition-all duration-300
                    ${isActive ? "text-white/95" : "text-gray-700"}
                  `}>
                    {tab.stat}
                  </span>
                  <span className={`
                    block text-[7px] md:text-[8px] uppercase tracking-wider mt-0.5
                    transition-all duration-300
                    ${isActive ? "text-white/75" : "text-gray-400"}
                  `}>
                    {tab.statLabel}
                  </span>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-2xl bg-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ONGLET 1: VUE GLOBALE */}
        {activeTab === "overview" && statsData && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminStatsClient initialStats={{
              totalCars: statsData.totalCars,
              activeBookings: statsData.activeBookings,
              pendingBookings: statsData.pendingBookings,
              completedBookings: statsData.completedBookings,
              totalRevenue: statsData.totalRevenue,
              totalExpenses: statsData.totalExpenses,
              netGain: statsData.netGain,
              monthlyData: statsData.monthlyData,
              expenseTypeStats: statsData.expenseTypeStats,
              carsProfit: statsData.carsProfit,
              recentBookings: statsData.recentBookings,
              pendingReturns: statsData.pendingReturns,
              carAvailability: statsData.carAvailability,
            }} />
          </motion.div>
        )}

        {/* ONGLET 2: CHARGES */}
        {activeTab === "expenses" && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toast.success("Formulaire d'ajout à implémenter")}
                  className="admin-btn-primary group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Plus size={20} className="relative z-10" />
                  <span className="relative z-10 text-xs">Enregistrer une charge</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="admin-btn-secondary"
                >
                  <Download size={18} />
                  <span className="text-xs">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Analytics des charges */}
            {statsData && (
              <ExpenseAnalytics dashboard={{
                summary: {
                  total_revenue: statsData.totalRevenue,
                  total_expenses: statsData.totalExpenses,
                  total_net_gain: statsData.netGain,
                  credit_total: 0,
                  break_even_ratio: statsData.totalExpenses > 0 
                    ? (statsData.totalRevenue / statsData.totalExpenses) * 100 
                    : 0,
                },
                per_car: statsData.carsProfit.map(car => ({
                  car_id: car.id,
                  brand: car.brand,
                  model: car.model,
                  total_revenue: car.total_revenue,
                  total_expenses: car.total_expenses,
                  credit_amount: 0,
                  maintenance_amount: car.total_expenses,
                  net_gain: car.profit,
                })),
                low_profit_cars: [],
                upcoming_expenses: [],
              }} />
            )}

            {/* Tableau des charges */}
            <div className="admin-table-container">
              <div className="overflow-x-auto admin-scroll-container">
                <table className="w-full text-left border-none">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="admin-table-th">Identification Véhicule</th>
                      <th className="admin-table-th">Catégorie de Charge</th>
                      <th className="admin-table-th">Impact Financier</th>
                      <th className="admin-table-th">Horodatage</th>
                      <th className="admin-table-th">Notes Opérationnelles</th>
                      <th className="admin-table-th text-right">Contrôles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {loadingExpenses ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-32 text-center">
                          <div className="relative inline-block">
                            <div className="w-20 h-20 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
                            <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={30} />
                          </div>
                          <p className="admin-label mt-8 animate-pulse">Synchronisation des archives...</p>
                        </td>
                      </tr>
                    ) : expenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-32 text-center">
                          <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
                            <Wallet size={40} className="text-gray-400 opacity-20" />
                          </div>
                          <p className="admin-label">Aucun enregistrement ne correspond à vos critères</p>
                        </td>
                      </tr>
                    ) : (
                      expenses.map((expense, idx) => (
                        <motion.tr
                          key={expense.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="admin-table-row group"
                        >
                          <td className="admin-table-td">
                            <div className="flex items-center gap-3">
                              {/* Image de la voiture */}
                              <div className="w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                                {expense.car?.image ? (
                                  <img 
                                    src={expense.car.image} 
                                    alt={`${expense.car.brand} ${expense.car.model}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] font-black text-[10px] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                                    {expense.car?.brand?.[0] || 'V'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="admin-table-primary-text">
                                  {expense.car?.brand} {expense.car?.model}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="admin-table-td">
                            <span className="admin-pill admin-pill-warning">
                              {expense.type}
                            </span>
                          </td>
                          <td className="admin-table-td">
                            <span className="text-red-500 font-black text-lg tracking-tight">
                              -{expense.amount.toLocaleString()} <span className="text-[10px] opacity-60">DH</span>
                            </span>
                          </td>
                          <td className="admin-table-td">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar size={14} />
                              <span className="text-xs font-bold">
                                {new Date(expense.date).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="admin-table-td max-w-xs truncate text-xs text-gray-500 font-bold">
                            {expense.note || "—"}
                          </td>
                          <td className="admin-table-td text-right">
                            <div className="admin-actions-container">
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="admin-btn-icon !text-red-500 hover:!bg-red-500"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ONGLET 3: ANALYSE AVANCÉE */}
        {activeTab === "advanced" && statsData && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="admin-card bg-white border-gray-100 shadow-sm p-6 md:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 md:p-4 bg-[var(--color-bg)] rounded-xl md:rounded-2xl border border-gray-50 text-[var(--color-secondary)] shadow-inner">
                      <PieChart size={18} className="md:w-5 md:h-5" />
                    </div>
                    <h3 className="admin-section-title text-lg md:text-xl tracking-tight text-[var(--color-primary)]">Répartition des <span className="text-[var(--color-secondary)]">Charges</span></h3>
                  </div>
                  <div className="h-1 w-20 bg-[var(--color-highlight)]/20 rounded-full hidden sm:block" />
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  {statsData.expenseTypeStats.length > 0 ? (
                    <div className="text-center">
                      <PieChart size={64} className="mx-auto text-gray-300 mb-4" />
                      <p className="admin-label">Graphique à intégrer</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <PieChart size={28} />
                      </div>
                      <p className="admin-label">Aucune donnée disponible</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-card bg-white border-gray-100 shadow-sm p-6 md:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 md:p-4 bg-[var(--color-bg)] rounded-xl md:rounded-2xl border border-gray-50 text-red-500 shadow-inner">
                      <AlertTriangle size={18} className="md:w-5 md:h-5" />
                    </div>
                    <h3 className="admin-section-title text-lg md:text-xl tracking-tight text-[var(--color-primary)]">Alertes <span className="text-red-500">Rentabilité</span></h3>
                  </div>
                  <div className="h-1 w-20 bg-[var(--color-highlight)]/20 rounded-full hidden sm:block" />
                </div>
                <div className="space-y-4">
                  {statsData.carsProfit
                    .filter(car => car.profit < 500)
                    .map(car => (
                      <div key={car.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-md transition-all group gap-4">
                        <div className="flex items-center gap-4">
                          <div className="admin-icon-container !bg-red-50 !border-red-100 !text-red-500">
                            <AlertTriangle size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-wider">{car.brand} {car.model}</p>
                            <p className="admin-label mt-0.5 text-gray-400 text-[8px]">
                              {car.profit < 0 ? "Charges > Revenus" : "Faible rentabilité"}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-black text-red-500 tracking-tighter">
                          {car.profit.toLocaleString()} <span className="text-[10px] opacity-60">DH</span>
                        </p>
                      </div>
                    ))}
                  {statsData.carsProfit.filter(car => car.profit < 500).length === 0 && (
                    <div className="py-16 md:py-24 text-center">
                      <div className="bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-400">
                        <CheckCircle2 size={28} />
                      </div>
                      <p className="admin-label">Aucune alerte - Tout est optimal</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Échéancier */}
            <div className="admin-card bg-white border-gray-100 shadow-sm p-6 md:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 md:p-4 bg-[var(--color-bg)] rounded-xl md:rounded-2xl border border-gray-50 text-[var(--color-secondary)] shadow-inner">
                    <Clock size={18} className="md:w-5 md:h-5" />
                  </div>
                  <h3 className="admin-section-title text-lg md:text-xl tracking-tight text-[var(--color-primary)]">Échéancier à <span className="text-[var(--color-secondary)]">Venir</span></h3>
                </div>
                <div className="h-1 w-20 bg-[var(--color-highlight)]/20 rounded-full hidden sm:block" />
              </div>
              <div className="py-16 md:py-24 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <Clock size={28} />
                </div>
                <p className="admin-label">Fonctionnalité à venir</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
