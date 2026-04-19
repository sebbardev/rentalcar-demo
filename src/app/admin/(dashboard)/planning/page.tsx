import { getAllCars } from "@/services/carService";
import PlanningBoard from "@/components/admin/PlanningBoard";

export default async function AdminPlanningPage() {
  const cars = await getAllCars();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="admin-header-title">Planning des <span className="text-[var(--color-primary)]">Réservations</span></h1>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full" />
          <p className="admin-header-subtitle">Vue agenda par véhicule (réservations + indisponibilités)</p>
        </div>
      </div>

      <div className="admin-card border-none bg-transparent shadow-none">
        <PlanningBoard cars={cars} />
      </div>
    </div>
  );
}

