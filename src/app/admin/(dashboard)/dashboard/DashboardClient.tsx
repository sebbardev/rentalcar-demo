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
  PieChart
} from "lucide-react";
import { getAllCars, Car as CarType } from "@/services/carService";
import { useStatsDashboard, StatsDashboard } from "@/hooks/useStatsDashboard";
import { getExpenses, deleteExpense, Expense } from "@/services/expenseService";
import { toast } from "react-hot-toast";

// Import des composants existants
import AdminStatsClient from "../stats/AdminStatsClient";
import ExpenseAnalytics from "@/components/admin/expenses/ExpenseAnalytics";

type Period = "all" | "month" | "quarter" | "year" | "custom";
type TabType = "overview" | "expenses" | "advanced";

export default function UnifiedDashboardClient() {
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
          <Loader2 className="animate-spin mx-auto mb-4 text-[var(--color-primary)]" size={48} />
          <p className="admin-label">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres globaux */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="admin-header-title">
              Tableau de Bord <span className="text-[var(--color-primary)]">Unifié</span>
            </h1>
            <p className="admin-header-subtitle mt-1">
              Statistiques, charges et analyse en un seul endroit
            </p>
          </div>
        </div>

        {/* Filtres - Suite dans la version complète */}
        <div className="text-sm text-gray-500">
          Filtres: {selectedCarId ? `Voiture ${selectedCarId}` : 'Toutes'} | Période: {period}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "overview" as TabType, label: "Vue Globale", icon: BarChart3 },
          { id: "expenses" as TabType, label: "Charges", icon: Wallet },
          { id: "advanced" as TabType, label: "Analyse Avancée", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu - Simplifié pour éviter les erreurs */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && statsData && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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

        {activeTab === "expenses" && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="admin-card p-8 text-center">
              <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="admin-section-title mb-2">Gestion des Charges</h3>
              <p className="text-gray-500 mb-6">
                {loadingExpenses ? 'Chargement...' : `${expenses.length} charge(s) trouvée(s)`}
              </p>
              <div className="flex gap-3 justify-center">
                <button className="admin-btn-primary">
                  <Plus size={18} />
                  <span>Ajouter une charge</span>
                </button>
                <button onClick={handleExportCSV} className="admin-btn-secondary">
                  <Download size={18} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "advanced" && statsData && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="admin-card p-8 text-center">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="admin-section-title mb-2">Analyse Avancée</h3>
              <p className="text-gray-500">
                Revenus: {statsData.totalRevenue.toLocaleString()} DH | 
                Charges: {statsData.totalExpenses.toLocaleString()} DH |
                Net: {statsData.netGain.toLocaleString()} DH
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
