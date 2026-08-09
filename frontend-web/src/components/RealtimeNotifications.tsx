"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Bell, X, AlertTriangle, MessageSquare, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "intervention";
  timestamp: Date;
}

export default function RealtimeNotifications({ token }: { token: string }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Connect to WebSocket Gateway
    const newSocket = io(API_BASE, {
      auth: {
        token: token,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      // Socket connected
    });

    newSocket.on("notification", (payload: Partial<Notification>) => {
      const newNotif: Notification = {
        id: Math.random().toString(36).substring(7),
        title: payload.title || t("notifications.new_notice"),
        message: payload.message || "",
        type: payload.type || "info",
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setIsVisible(true);
      
      // Auto hide after 10s if not intervention
      if (newNotif.type !== "intervention") {
         setTimeout(() => {
            setNotifications((prev) => {
              const updated = prev.filter((n) => n.id !== newNotif.id);
              if (updated.length === 0) setIsVisible(false);
              return updated;
            });
         }, 10000);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, t]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      if (updated.length === 0) setIsVisible(false);
      return updated;
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "intervention":
        return <MessageSquare className="w-5 h-5 text-red-400" />;
      case "success":
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 max-w-sm w-full">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-2xl rounded-2xl p-5 relative overflow-hidden animate-in slide-in-from-right-12 fade-in duration-300"
        >
          {notif.type === "intervention" && (
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          )}
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-white/5 shrink-0`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 pr-6">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{notif.title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {notif.message}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 font-medium">
                {notif.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => removeNotification(notif.id)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
