"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Car
} from "lucide-react";
import StatsCharts from "@/components/admin/StatsCharts";
import { Stats, CarProfitDetail } from "@/services/statsService";

export default function AdminStatsClient({ initialStats }: { initialStats: Stats }) {
  const [selectedCar, setSelectedCar] = useState<CarProfitDetail | null>(null);

  // Trier par date décroissante pour afficher les plus récents en premier
  const sortedRevenues = selectedCar 
    ? [...selectedCar.revenue_details].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  const sortedExpenses = selectedCar 
    ? [...selectedCar.expense_details].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const limitedRevenues = sortedRevenues.slice(0, 3);
  const limitedExpenses = sortedExpenses.slice(0, 3);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">Tableau de Bord <span className="text-[var(--color-primary)]">Analytique</span></h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full" />
            <p className="admin-header-subtitle">Analyse de performance et rentabilité flote</p>
          </div>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Chiffre d'Affaires" 
          value={`${initialStats.totalRevenue.toLocaleString()} DH`} 
          icon={TrendingUp} 
          iconColor="text-green-400"
          trend="Revenu brut total"
          suppressHydrationWarning
        />
        <StatCard 
          label="Charges Totales" 
          value={`${initialStats.totalExpenses.toLocaleString()} DH`} 
          icon={TrendingDown} 
          iconColor="text-red-400"
          trend="Dépenses enregistrées"
          suppressHydrationWarning
        />
        <StatCard 
          label="Bénéfice Net" 
          value={`${initialStats.netGain.toLocaleString()} DH`} 
          icon={DollarSign} 
          trend="Profit réel généré"
          highlight
          suppressHydrationWarning
        />
        <StatCard 
          label="Taux d'Occupation" 
          value={`${Math.round((initialStats.activeBookings / (initialStats.totalCars || 1)) * 100)}%`} 
          icon={CheckCircle2} 
          iconColor="text-blue-400"
          trend={`${initialStats.activeBookings} voitures louées`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue vs Expenses Chart */}
        <div className="admin-card min-h-[450px]">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl text-white shadow-lg">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="admin-section-title tracking-tight">Performance <span className="text-[var(--color-primary)]">Mensuelle</span></h3>
                  <p className="text-[9px] text-[var(--color-highlight)] font-black uppercase tracking-[0.3em] mt-1">ADMIN</p>
                </div>
              </div>
           </div>
           <StatsCharts 
            type="bar" 
            labels={initialStats.monthlyData.map((d: any) => d.name)} 
            datasets={[
              {
                label: "Revenus",
                data: initialStats.monthlyData.map((d: any) => d.revenue),
                backgroundColor: "rgba(6, 102, 140, 0.2)", // primary blue with opacity
                borderColor: "#06668C", // Navy Blue - primary
                borderWidth: 2,
              },
              {
                label: "Charges",
                data: initialStats.monthlyData.map((d: any) => d.expenses),
                backgroundColor: "rgba(103, 148, 54, 0.2)", // forest green with opacity
                borderColor: "#679436", // Forest Green - accent
                borderWidth: 2,
              },
              {
                label: "Profit",
                data: initialStats.monthlyData.map((d: any) => d.profit),
                backgroundColor: "rgba(164, 189, 1, 0.35)", // lime green with opacity
                borderColor: "#A4BD01", // Lime Green - highlight
                borderWidth: 2,
              }
            ]} 
           />
        </div>

        {/* Expense Breakdown */}
        <div className="admin-card min-h-[450px]">
           <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                <PieChart className="text-[var(--color-primary)]" size={20} />
              </div>
              <h3 className="admin-section-title tracking-tight">Répartition des <span className="text-[var(--color-primary)]">Charges</span></h3>
           </div>
           <StatsCharts 
            type="pie" 
            labels={initialStats.expenseTypeStats.map((d: any) => d.type.toUpperCase())} 
            datasets={[{
              label: "Montant (DH)",
              data: initialStats.expenseTypeStats.map((d: any) => d.amount),
            }]} 
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car Profitability Ranking */}
        <div className="lg:col-span-1 admin-card">
           <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                <TrendingUp className="text-[var(--color-primary)]" size={20} />
              </div>
              <h3 className="admin-section-title tracking-tight">Top <span className="text-[var(--color-primary)]">Rentabilité</span></h3>
           </div>
           <div className="space-y-4">
              {initialStats.carsProfit.map((car: CarProfitDetail, index: number) => (
                <button 
                  key={`${car.brand}-${car.model}`} 
                  onClick={() => setSelectedCar(car)}
                  className="w-full flex items-center justify-between p-5 bg-gray-50 border border-gray-200 rounded-2xl group hover:border-[var(--color-primary)]/50 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    {/* Image de la voiture - Style rectangulaire comme /admin */}
                    <div className="w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                      {car.image ? (
                        <img 
                          src={car.image} 
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] font-black text-xs group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                          {car.brand?.[0] || 'V'}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-black ${index < 3 ? "text-[var(--color-primary)]" : "text-gray-600"}`}>
                        #{index + 1}
                      </span>
                      <p className="text-xs font-black text-[var(--color-text-main)] uppercase tracking-tight mt-1">{car.brand} {car.model}</p>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Gain Net</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-black ${car.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {car.profit.toLocaleString()} <span className="text-[10px] not-italic text-gray-600 ml-1">DH</span>
                    </span>
                    <ChevronRight size={14} className="text-gray-700 group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 admin-table-container">
           <div className="flex items-center gap-3 p-8 border-b border-gray-50/50">
              <div className="admin-table-icon-container bg-blue-50 text-blue-500">
                <Clock size={20} />
              </div>
              <h3 className="admin-section-title tracking-tight">Réservations <span className="text-[var(--color-primary)]">Récentes</span></h3>
           </div>
           <div className="overflow-x-auto admin-scroll-container">
             <table className="w-full text-left border-none">
               <thead>
                 <tr>
                   <th className="admin-table-th">Véhicule</th>
                   <th className="admin-table-th">Client</th>
                   <th className="admin-table-th">Période</th>
                   <th className="admin-table-th text-right">Impact</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50/50">
                 {initialStats.recentBookings.slice(0, 5).map((booking: any) => (
                   <tr key={booking.id} className="admin-table-row group">
                     <td className="admin-table-td">
                       <div className="flex items-center gap-3">
                         {/* Image de la voiture */}
                         <div className="w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                           {booking.car?.image ? (
                             <img 
                               src={booking.car.image} 
                               alt={`${booking.car.brand} ${booking.car.model}`}
                               className="w-full h-full object-cover"
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] font-black text-[10px] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                               {booking.car?.brand?.[0] || 'V'}
                             </div>
                           )}
                         </div>
                         <p className="admin-table-primary-text uppercase tracking-wider">{booking.car?.brand} {booking.car?.model}</p>
                       </div>
                     </td>
                     <td className="admin-table-td">
                       <p className="admin-table-secondary-text font-bold uppercase tracking-widest">{booking.first_name} {booking.last_name}</p>
                     </td>
                     <td className="admin-table-td">
                       <p className="admin-table-secondary-text font-bold uppercase tracking-widest">{new Date(booking.start_date).toLocaleDateString("fr-FR")} → {new Date(booking.end_date).toLocaleDateString("fr-FR")}</p>
                     </td>
                     <td className="admin-table-td text-right">
                       <p className="admin-table-price">+{booking.total_price.toLocaleString()} <span className="admin-table-unit">DH</span></p>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           <div className="p-6 border-t border-gray-50/50 flex justify-center">
             <Link 
               href="/admin/reservations" 
               className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold text-sm rounded-xl hover:bg-[var(--color-primary)]/90 transition-all shadow-sm hover:shadow-md"
             >
               Voir plus
               <ExternalLink size={16} />
             </Link>
           </div>
        </div>
      </div>

      {/* Modal Détails Rentabilité */}
      {selectedCar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedCar(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] border border-gray-200 shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div>
                <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                  Détails Rentabilité • {selectedCar.brand} {selectedCar.model}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight size={14} className="text-green-400" />
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                      Revenus: {selectedCar.total_revenue.toLocaleString()} DH
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ArrowDownRight size={14} className="text-red-400" />
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                      Charges: {selectedCar.total_expenses.toLocaleString()} DH
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full">
                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                      Gain Net: {selectedCar.profit.toLocaleString()} DH
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCar(null)}
                className="p-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 admin-scroll-container grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne Revenus */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-green-400" />
                  <h4 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Historique des Revenus</h4>
                </div>
                <div className="space-y-2">
                  {limitedRevenues.length === 0 ? (
                    <p className="text-xs text-gray-500">Aucun revenu enregistré.</p>
                  ) : (
                    limitedRevenues.map((rev) => (
                      <div key={rev.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-[var(--color-text-main)] uppercase">{rev.customer}</p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">{new Date(rev.date).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <p className="text-xs font-black text-green-400">+{rev.amount.toLocaleString()} DH</p>
                      </div>
                    ))
                  )}
                </div>
                {sortedRevenues.length > 3 && (
                  <Link 
                    href={`/admin/stats/cars/${selectedCar.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl hover:bg-[var(--color-primary)]/10 transition-all"
                  >
                    Voir l'historique complet
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>

              {/* Colonne Charges */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={18} className="text-red-400" />
                  <h4 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-wider">Historique des Charges</h4>
                </div>
                <div className="space-y-2">
                  {limitedExpenses.length === 0 ? (
                    <p className="text-xs text-gray-500">Aucune charge enregistrée.</p>
                  ) : (
                    limitedExpenses.map((exp) => (
                      <div key={exp.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black text-[var(--color-text-main)] uppercase">{exp.type}</p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">{new Date(exp.date).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <p className="text-xs font-black text-red-400">-{exp.amount.toLocaleString()} DH</p>
                      </div>
                    ))
                  )}
                </div>
                {sortedExpenses.length > 3 && (
                  <Link 
                    href={`/admin/stats/cars/${selectedCar.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-400/5 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-all"
                  >
                    Voir tout le détail
                    <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  iconColor,
  trend, 
  highlight,
  suppressHydrationWarning 
}: { 
  label: string; 
  value: string; 
  icon: any; 
  iconColor?: string;
  trend: string;
  highlight?: boolean;
  suppressHydrationWarning?: boolean;
}) {
  const Icon = icon;
  return (
    <div className={`admin-card group admin-card-hover !p-6 ${highlight ? 'bg-[var(--color-primary)] !border-none' : 'bg-white border-gray-100'}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ${highlight ? 'bg-white/10' : 'bg-gray-50/10'}`}></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={highlight ? 'admin-icon-container-highlight' : 'admin-icon-container'}>
          <Icon size={20} className={`md:w-6 md:h-6 ${iconColor || ''}`} />
        </div>
        <div className={`h-1 w-8 rounded-full group-hover:w-16 transition-all duration-700 ${highlight ? 'bg-white/40' : 'bg-[var(--color-highlight)]'}`}></div>
      </div>
      <p className={`admin-label mb-1 relative z-10 ${highlight ? 'text-white/60' : ''}`}>{label}</p>
      <h3 className={`text-2xl md:text-3xl font-black tracking-tighter relative z-10 ${highlight ? 'text-white' : 'text-[var(--color-primary)]'}`} suppressHydrationWarning={suppressHydrationWarning}>
        {value}
      </h3>
      <p className={`text-[8px] font-black uppercase tracking-widest mt-2 relative z-10 ${highlight ? 'text-white/40' : 'text-gray-400'}`}>
        {trend}
      </p>
    </div>
  );
}
