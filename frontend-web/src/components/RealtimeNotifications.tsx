"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Bell, X, AlertTriangle, MessageSquare, Sparkles } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "intervention";
  timestamp: Date;
}

export default function RealtimeNotifications({ token }: { token: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Connect to WebSocket Gateway
    const newSocket = io("http://localhost:3000", {
      auth: {
        token: token,
      },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Realtime Notification System");
    });

    newSocket.on("notification", (payload: any) => {
      console.log("New Notification Received:", payload);
      const newNotif: Notification = {
        id: Math.random().toString(36).substring(7),
        title: payload.title || "Pemberitahuan Baru",
        message: payload.message,
        type: payload.type || "info",
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setIsVisible(true);
      
      // Auto hide after 10s if not intervention
      if (newNotif.type !== "intervention") {
         setTimeout(() => {
            removeNotification(newNotif.id);
         }, 10000);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
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
