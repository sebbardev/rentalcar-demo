"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  CalendarDays, 
  Clock, 
  FileText, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  MessageSquare,
  Bell
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Car, label: "Véhicules", href: "/admin/voitures" },
  { icon: Users, label: "Clients", href: "/admin/customers" },
  { icon: CalendarDays, label: "Réservations", href: "/admin/reservations" },
  { icon: Clock, label: "Planning", href: "/admin/planning" },
  { icon: FileText, label: "Contrats", href: "/admin/contracts" },
  { icon: BarChart3, label: "Dashboard Unifié", href: "/admin/dashboard" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex flex-col gap-1 group">
            <h2 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tighter leading-none">
              Premium<span className="text-[var(--color-secondary)]">CarRental</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-8 bg-[var(--color-highlight)] rounded-full" />
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Admin Panel</p>
            </div>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-[var(--color-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 admin-scroll-container">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-blue-900/10 -translate-x-1" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-[var(--color-primary)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} className={isActive ? "text-white" : "group-hover:text-[var(--color-primary)]"} />
                  <span className="font-black uppercase text-[10px] tracking-widest">{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-50 bg-gray-50/30">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-4 px-4 py-4 w-full text-red-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
