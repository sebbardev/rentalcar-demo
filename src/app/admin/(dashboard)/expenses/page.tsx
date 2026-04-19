"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, getAllCars } from "@/services/carService";
import {
  Expense,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseDashboard,
  ExpenseDashboard,
} from "@/services/expenseService";
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Car as CarIcon,
  X,
  Loader2,
  AlertTriangle,
  History,
  Calendar,
  Tag,
  FileText,
  Keyboard,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import ExpenseAnalytics from "@/components/admin/expenses/ExpenseAnalytics";

const EXPENSE_CATEGORIES = [
  { id: "PONCTUELLE", label: "Ponctuelle", types: ["vidange", "pneu", "amende", "lavage", "réparation"] },
  { id: "RECURRENTE", label: "Récurrente (Fixe)", types: ["assurance", "vignette", "visite technique"] },
  { id: "CREDIT", label: "Crédit / Financement", types: ["crédit"] },
];

const ALL_TYPES = EXPENSE_CATEGORIES.flatMap(c => c.types);

export default function ExpensesPage() {
  const { data: session } = useSession();
  const accessToken = (session?.user as any)?.accessToken as string | undefined;

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [dashboard, setDashboard] = useState<ExpenseDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filterCarId, setFilterCarId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expData, carsData, dashData] = await Promise.all([
        getExpenses({
          car_id: filterCarId,
          type: filterType,
          from: filterFrom,
          to: filterTo,
        }),
        getAllCars(),
        getExpenseDashboard({ 
          car_id: filterCarId,
          from: filterFrom,
          to: filterTo,
        }),
      ]);
      setExpenses(expData);
      setCars(carsData);
      setDashboard(dashData);
    } catch (err) {
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [filterCarId, filterType, filterFrom, filterTo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "n") {
          e.preventDefault();
          setSelectedExpense(null);
          setShowFormModal(true);
        }
        if (e.key === "e") {
          e.preventDefault();
          handleExport();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expenses]);

  const handleDelete = async (id: string) => {
    if (!accessToken || !confirm("Êtes-vous sûr de vouloir supprimer cette charge ?")) return;
    const res = await deleteExpense(id, accessToken);
    if (res.success) {
      toast.success("Charge supprimée");
      loadData();
    } else {
      toast.error(res.error || "Erreur lors de la suppression");
    }
  };

  const handleExport = () => {
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
    a.download = `charges_automobiles_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Exportation terminée");
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${exp.car?.brand} ${exp.car?.model}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 p-2 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-header-title">
            Gestion des <span className="text-[var(--color-primary)]">Charges</span>
          </h1>
          <p className="admin-header-subtitle mt-1">
            Enregistrez et suivez toutes vos dépenses opérationnelles
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="admin-btn-secondary"
          >
            <Download size={16} />
            Exporter CSV
          </button>
          <button
            onClick={() => {
              setSelectedExpense(null);
              setShowFormModal(true);
            }}
            className="admin-btn-primary"
          >
            <Plus size={18} />
            Ajouter une charge
          </button>
        </div>
      </div>

      {/* Analytics */}
      {dashboard && <ExpenseAnalytics dashboard={dashboard} />}

      {/* Expenses Table */}
      <div className="admin-table-container">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="animate-spin mx-auto mb-4" size={40} />
              <p className="admin-label">Chargement...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="admin-label">Aucune charge trouvée</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="admin-table-th">Véhicule</th>
                  <th className="admin-table-th">Type</th>
                  <th className="admin-table-th">Montant</th>
                  <th className="admin-table-th">Date</th>
                  <th className="admin-table-th">Note</th>
                  <th className="admin-table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="admin-table-row">
                    <td className="admin-table-td">
                      {expense.car?.brand} {expense.car?.model}
                    </td>
                    <td className="admin-table-td">
                      <span className="admin-pill admin-pill-warning">{expense.type}</span>
                    </td>
                    <td className="admin-table-td">
                      <span className="text-red-500 font-bold">-{expense.amount.toLocaleString()} DH</span>
                    </td>
                    <td className="admin-table-td">
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="admin-table-td">{expense.note || "—"}</td>
                    <td className="admin-table-td text-right">
                      <button
                        onClick={() => {
                          setSelectedExpense(expense);
                          setShowFormModal(true);
                        }}
                        className="admin-btn-icon mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="admin-btn-icon !text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
