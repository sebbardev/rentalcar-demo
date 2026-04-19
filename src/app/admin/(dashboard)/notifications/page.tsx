"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Check, Trash2, Calendar, MessageSquare, AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: "BOOKING" | "CONTACT_MESSAGE" | "SYSTEM";
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/notifications", {
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.is_read;
    if (filter === "READ") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Calendar className="text-blue-500" size={20} />;
      case "CONTACT_MESSAGE":
        return <MessageSquare className="text-green-500" size={20} />;
      case "SYSTEM":
        return <AlertCircle className="text-orange-500" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case "BOOKING":
        return "bg-blue-50 border-blue-100";
      case "CONTACT_MESSAGE":
        return "bg-green-50 border-green-100";
      case "SYSTEM":
        return "bg-orange-50 border-orange-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <RefreshCw className="animate-spin text-[var(--color-primary)]" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Chargement des notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="admin-header-title">Centre de <span className="text-[var(--color-primary)]">Notifications</span></h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 bg-[var(--color-primary)] rounded-full" />
            <p className="admin-header-subtitle">
              {unreadCount > 0
                ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                : "Toutes les notifications ont été lues"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifications}
            className="admin-btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="admin-btn-primary flex items-center gap-2"
            >
              <Check size={16} />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-card !p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "ALL"
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              filter === "UNREAD"
                ? "bg-[var(--color-highlight)] text-white shadow-lg shadow-[var(--color-highlight)]/20"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Non lues
            {unreadCount > 0 && (
              <span className="bg-white text-[var(--color-highlight)] px-2 py-0.5 rounded-full text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("READ")}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "READ"
                ? "bg-gray-600 text-white shadow-lg shadow-gray-600/20"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Lues
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="admin-card !p-0 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 transition-all hover:bg-gray-50/50 cursor-pointer ${
                  notification.is_read
                    ? "bg-white"
                    : `${getTypeBg(notification.type)} border-l-4 border-l-[var(--color-primary)]`
                }`}
                onClick={() => setSelectedNotification(notification)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getTypeBg(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className={`text-sm font-black uppercase tracking-tight ${
                          notification.is_read ? "text-gray-500" : "text-[var(--color-primary)]"
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                          <Clock size={12} />
                          {formatDistanceToNow(new Date(notification.created_at), { locale: fr, addSuffix: true })}
                        </span>
                        {!notification.is_read && (
                          <span className="w-2.5 h-2.5 bg-[var(--color-highlight)] rounded-full animate-pulse"></span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="text-[9px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:opacity-70 transition-opacity flex items-center gap-1"
                      >
                        <Check size={12} />
                        Marquer comme lu
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-opacity flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
              <BellOff size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">
              Aucune notification
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {filter === "UNREAD"
                ? "Toutes les notifications ont été lues"
                : "Vous n'avez pas encore de notifications"}
            </p>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getTypeBg(selectedNotification.type)}`}>
                {getTypeIcon(selectedNotification.type)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[var(--color-primary)] uppercase tracking-tight">
                  {selectedNotification.title}
                </h2>
                <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest">
                  {format(new Date(selectedNotification.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {selectedNotification.message}
              </p>
            </div>

            {selectedNotification.data && (
              <div className="mb-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                  Données associées
                </h3>
                <pre className="bg-gray-50 rounded-xl p-4 text-xs overflow-auto border border-gray-100">
                  {JSON.stringify(selectedNotification.data, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex items-center gap-3">
              {selectedNotification.link && (
                <a
                  href={selectedNotification.link}
                  className="admin-btn-primary flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Accéder
                </a>
              )}
              {!selectedNotification.is_read && (
                <button
                  onClick={() => {
                    markAsRead(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="admin-btn-secondary flex items-center gap-2"
                >
                  <Check size={16} />
                  Marquer comme lu
                </button>
              )}
              <button
                onClick={() => setSelectedNotification(null)}
                className="admin-btn-icon ml-auto"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
