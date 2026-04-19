import { useState, useEffect, useRef } from "react";
import { Bell, Search, User, Menu, X, Calendar, Car, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface HeaderProps {
  session: any;
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  type: "BOOKING" | "CONTRACT" | "EXPENSE" | "SYSTEM";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function Header({ session, onMenuClick }: HeaderProps) {
  const { data: sessionData } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Get auth token from session
  const getToken = () => {
    return (sessionData?.user as any)?.accessToken || (session?.user as any)?.accessToken;
  };

  // Fetch notifications and unread count from API
  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No auth token available");
      return;
    }

    try {
      const [notificationsRes, unreadCountRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/notifications?per_page=3", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/api/notifications/unread-count", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
      ]);

      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        // Transform backend notifications to Header format
        const transformedNotifications: Notification[] = (data.data || []).map((notif: any) => ({
          id: notif.id.toString(),
          type: notif.type as "BOOKING" | "CONTRACT" | "EXPENSE" | "SYSTEM",
          title: notif.title,
          message: notif.message,
          time: formatDistanceToNow(new Date(notif.created_at), { locale: fr, addSuffix: true }),
          read: notif.is_read,
          link: notif.data?.booking_id ? "/admin/reservations" : 
                notif.data?.message_id ? "/admin/messages" : "#"
        }));
        setNotifications(transformedNotifications);
      }

      if (unreadCountRes.ok) {
        const data = await unreadCountRes.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) {
      console.warn("No auth token available");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh notifications
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BOOKING": return <Calendar className="text-blue-500" size={16} />;
      case "CONTRACT": return <CheckCircle2 className="text-green-500" size={16} />;
      case "SYSTEM": return <AlertCircle className="text-orange-500" size={16} />;
      default: return <Bell className="text-gray-400" size={16} />;
    }
  };

  return (
    <header className="h-24 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-10 shadow-sm z-50 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-gray-50 rounded-2xl text-[var(--color-primary)] hover:bg-gray-100 transition-all shadow-sm"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-8">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl transition-all shadow-sm group ${
              showNotifications ? "bg-[var(--color-primary)] text-white" : "bg-gray-50 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-100"
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[var(--color-highlight)] rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Pop-up */}
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60]">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[var(--color-primary)] uppercase tracking-tight">Notifications</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{unreadCount} non lues</p>
                </div>
                <button 
                  onClick={markAllAsRead}
                  className="text-[9px] font-black text-[var(--color-highlight)] uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  Tout marquer lu
                </button>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto admin-scroll-container">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <Bell size={24} className="text-gray-300 animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chargement...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <Link 
                      key={notif.id} 
                      href={notif.link || "#"}
                      onClick={() => setShowNotifications(false)}
                      className={`flex gap-4 p-5 border-b border-gray-50 hover:bg-gray-50/80 transition-all group/notif ${!notif.read ? "bg-blue-50/20" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/notif:scale-110 ${
                        notif.read ? "bg-gray-50 text-gray-400" : "bg-white text-[var(--color-primary)]"
                      }`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-[11px] font-black uppercase tracking-tight truncate ${notif.read ? "text-gray-500" : "text-[var(--color-primary)]"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[8px] font-bold text-gray-400 uppercase whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className={`text-[10px] leading-relaxed line-clamp-2 ${notif.read ? "text-gray-400" : "text-gray-600 font-medium"}`}>
                          {notif.message}
                        </p>
                      </div>
                      <div className="flex items-center opacity-0 group-hover/notif:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-[var(--color-highlight)]" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                      <Bell size={24} className="text-gray-200" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aucune notification</p>
                  </div>
                )}
              </div>
              
              <Link 
                href="/admin/notifications" 
                className="block p-4 bg-gray-50/50 text-center text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:bg-gray-50 transition-colors"
                onClick={() => setShowNotifications(false)}
              >
                Voir tout l'historique
              </Link>
            </div>
          )}
        </div>

        <div className="h-10 w-px bg-gray-100 hidden md:block"></div>

        <div className="flex items-center gap-3 md:gap-5 bg-gray-50/50 p-1.5 md:p-2 md:pl-6 rounded-2xl md:rounded-[2rem] border border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest">{session.user?.name}</p>
            <p className="text-[9px] text-[var(--color-highlight)] font-black uppercase tracking-[0.3em] mt-1">
              {session.user?.role}
            </p>
          </div>
          <div className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border border-gray-100 text-[var(--color-primary)] shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
