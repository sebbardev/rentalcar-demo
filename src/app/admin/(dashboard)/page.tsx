import { getStats } from "@/services/statsService";
import ReturnIntakePanel from "@/components/admin/ReturnIntakePanel";
import { 
  Car, 
  CalendarCheck, 
  Users, 
  TrendingUp,
  AlertCircle,
  History as HistoryIcon
} from "lucide-react";

export default async function AdminDashboard() {
  // Récupération des statistiques réelles depuis l'API Laravel
  const stats = await getStats();

  const cards = [
    { label: "Total Véhicules", value: stats.totalCars, icon: Car, color: "blue" },
    { label: "Réservations Actives", value: stats.activeBookings, icon: CalendarCheck, color: "green" },
    { label: "Demandes en attente", value: stats.pendingBookings, icon: AlertCircle, color: "yellow" },
    { label: "Revenu Total", value: `${stats.totalRevenue.toLocaleString()} MAD`, icon: TrendingUp, color: "purple" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="admin-header-title">Tableau de <span className="text-[var(--color-primary)]">Bord</span></h1>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full" />
          <p className="admin-header-subtitle">Vue d'ensemble de votre parc automobile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <div key={i} className="admin-card group admin-card-hover !p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
            <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
              <div className="admin-icon-container">
                <card.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="h-1 w-8 bg-[var(--color-highlight)] rounded-full group-hover:w-16 transition-all duration-700" />
            </div>
            <p className="admin-label mb-1 md:mb-2 relative z-10 text-[9px] md:text-[10px]">{card.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--color-primary)] tracking-tighter relative z-10">{card.value}</h3>
          </div>
        ))}
      </div>

      <ReturnIntakePanel pendingReturns={stats.pendingReturns ?? []} />

      {/* Graphiques et activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <div className="admin-card bg-white border-gray-100 shadow-sm p-6 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 md:p-4 bg-[var(--color-bg)] rounded-xl md:rounded-2xl border border-gray-50 text-[var(--color-secondary)] shadow-inner">
                <HistoryIcon size={18} className="md:w-5 md:h-5" />
              </div>
              <h3 className="admin-section-title text-lg md:text-xl tracking-tight text-[var(--color-primary)]">Activités <span className="text-[var(--color-secondary)]">Récentes</span></h3>
            </div>
            <div className="h-1 w-20 bg-[var(--color-highlight)]/20 rounded-full hidden sm:block" />
          </div>
          
          {stats.recentBookings.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {stats.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-gray-50/50 rounded-[1.5rem] md:rounded-[2rem] border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-md transition-all group gap-4">
                  <div className="flex items-center gap-4 md:gap-5">
                    {/* Car Image - Rectangular */}
                    <div className="w-24 h-16 md:w-32 md:h-20 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm group-hover:shadow-md transition-all">
                      {booking.car?.image ? (
                        <img 
                          src={booking.car.image} 
                          alt={`${booking.car.brand} ${booking.car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-primary)] font-black text-xs md:text-sm group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                          {booking.car?.brand?.[0] || 'V'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] md:text-xs font-black text-[var(--color-primary)] uppercase tracking-wider truncate">{booking.car?.brand} {booking.car?.model}</p>
                      <p className="admin-label mt-0.5 text-gray-400 text-[8px] md:text-[9px] truncate">Client: {booking.user_name || booking.user?.name || 'Inconnu'}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                    <p className="text-xs md:text-sm font-black text-[var(--color-accent)] tracking-tighter">{booking.total_price} MAD</p>
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase">{new Date(booking.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 md:py-24 text-center">
              <div className="bg-gray-50 w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-4 md:mb-6 text-gray-200">
                <HistoryIcon size="28" className="md:w-8 md:h-8" />
              </div>
              <p className="admin-label text-[9px] md:text-[10px]">Aucune activité archivée</p>
            </div>
          )}
        </div>

        <div className="admin-card bg-white border-gray-100 shadow-sm p-6 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 md:p-4 bg-[var(--color-bg)] rounded-xl md:rounded-2xl border border-gray-50 text-[var(--color-secondary)] shadow-inner">
                <TrendingUp size={18} className="md:w-5 md:h-5" />
              </div>
              <h3 className="admin-section-title text-lg md:text-xl tracking-tight text-[var(--color-primary)]">Disponibilité <span className="text-[var(--color-secondary)]">Flotte</span></h3>
            </div>
            <div className="h-1 w-20 bg-[var(--color-highlight)]/20 rounded-full hidden sm:block" />
          </div>

          <div className="space-y-8 md:space-y-10 px-2 md:px-4">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Véhicules Disponibles</span>
                <span className="text-xl md:text-2xl font-black text-[var(--color-accent)] tracking-tighter">{stats.carAvailability.available} <span className="text-[8px] md:text-[10px] not-italic text-gray-400 ml-1 uppercase">Unités</span></span>
              </div>
              <div className="w-full bg-gray-100 h-3 md:h-4 rounded-full overflow-hidden border border-gray-50 shadow-inner p-0.5 md:p-1">
                <div 
                  className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${(stats.carAvailability.available / (stats.totalCars || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">En Location / Maintenance</span>
                <span className="text-xl md:text-2xl font-black text-orange-400 tracking-tighter">{stats.carAvailability.unavailable} <span className="text-[8px] md:text-[10px] not-italic text-gray-400 ml-1 uppercase">Unités</span></span>
              </div>
              <div className="w-full bg-gray-100 h-3 md:h-4 rounded-full overflow-hidden border border-gray-50 shadow-inner p-0.5 md:p-1">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-yellow-300 h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${(stats.carAvailability.unavailable / (stats.totalCars || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1">Taux d'utilisation</p>
                <p className="text-3xl md:text-4xl font-black text-[var(--color-primary)] tracking-tighter">
                  {Math.round((stats.carAvailability.unavailable / (stats.totalCars || 1)) * 100)}%
                </p>
              </div>
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-[var(--color-bg)] border border-gray-50 flex items-center justify-center text-[var(--color-highlight)] shadow-inner">
                <TrendingUp size={24} className="md:w-7 md:h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
