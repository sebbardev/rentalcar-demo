import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { Car } from "@/services/carService";
import { Fuel, Gauge, Users, Check, ArrowRight, Calendar, Tag } from "lucide-react";

interface CarCardProps {
  car: Car;
}

// OPTIMIZED: Wrap with memo to prevent unnecessary re-renders
const CarCard = memo(function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full relative">
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-highlight)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
      
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          quality={85}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg border border-white/30 group-hover:shadow-xl transition-all">
            <span className="text-[var(--color-primary)] font-black text-xl">{car.pricePerDay}</span>
            <span className="text-[var(--color-primary)] text-[10px] font-bold ml-1 uppercase">{car.currency}/jour</span>
          </div>
          {car.available && (
            <div className="bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
              <Check size={12} />
              Disponible
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur-xl text-[var(--color-primary)] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/30">
            {car.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 relative">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tighter mb-2 group-hover:text-[var(--color-secondary)] transition-colors">
            {car.brand} <span className="text-gray-400 group-hover:text-[var(--color-highlight)] transition-colors">{car.model}</span>
          </h3>
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-accent)] rounded-full" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{car.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg text-white shrink-0">
              <Fuel size={14} />
            </div>
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider truncate">{car.fuel}</span>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="p-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg text-white shrink-0">
              <Gauge size={14} />
            </div>
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider truncate">{car.transmission}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
          <Link 
            href={`/voitures/${car.id}`}
            className="flex-1 group/btn relative bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-highlight)] hover:from-[var(--color-highlight)] hover:to-[var(--color-accent)] text-white text-center font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-xl hover:shadow-[var(--color-highlight)]/30 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
              Réserver maintenant
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default CarCard;
