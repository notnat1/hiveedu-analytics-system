"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LineChart, Settings, LogOut, UserCircle, Users, BookOpen, History, CalendarDays, BarChart3, ShieldCheck, Sun, Moon, Menu, X, ArrowUp } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import OnboardingTour from "@/components/OnboardingTour";
import RealtimeNotifications from "@/components/RealtimeNotifications";

interface DecodedToken {
  sub: string;
  username: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("Platform User");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = () => {
    if (mainRef.current) {
      setShowScrollTop(mainRef.current.scrollTop > 50);
    }
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frameId: number | null = null;
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      router.push("/login");
    } else {
      setToken(currentToken);
      try {
        const decoded = jwtDecode<DecodedToken>(currentToken);
        frameId = window.requestAnimationFrame(() => {
          setUserRole(decoded.role);
          setUsername(decoded.username);
          setIsAuthenticated(true);
        });
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [router]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("hiveedu-theme");
    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("hiveedu-theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const adminNav = [
    { name: t("sidebar.overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.records"), href: "/dashboard/records", icon: BookOpen },
    { name: t("sidebar.attendance"), href: "/dashboard/attendance", icon: CalendarDays },
    { name: t("sidebar.analytics"), href: "/dashboard/analytics", icon: LineChart },
    { name: t("sidebar.tutors"), href: "/dashboard/tutors", icon: BarChart3 },
    { name: t("sidebar.users"), href: "/dashboard/users", icon: Users },
    { name: t("sidebar.audit"), href: "/dashboard/audit-logs", icon: ShieldCheck },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  const teacherNav = [
    { name: t("sidebar.overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.records"), href: "/dashboard/records", icon: BookOpen },
    { name: t("sidebar.attendance"), href: "/dashboard/attendance", icon: CalendarDays },
    { name: t("sidebar.tutors"), href: "/dashboard/tutors", icon: BarChart3 },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  const userNav = [
    { name: t("sidebar.overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.records"), href: "/dashboard/records", icon: BookOpen },
    { name: t("sidebar.attendance"), href: "/dashboard/attendance", icon: CalendarDays },
    { name: t("sidebar.history"), href: "/dashboard/history", icon: History },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  const navItems =
    userRole === "ADMIN"
      ? adminNav
      : userRole === "TEACHER"
        ? teacherNav
        : userNav;

  return (
    <div className="h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-blue-500/30 overflow-hidden">
      <OnboardingTour theme={theme} />
      {token && <RealtimeNotifications token={token} />}
      
      {/* Premium Full-Screen Loading Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-[100] bg-[#09090b]/60 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsating outer ring */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border border-blue-500/20 bg-blue-500/5 animate-ping"></div>
            {/* Spinning gradient ring */}
            <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-blue-500 border-r-violet-500 animate-spin"></div>
            {/* Inner glowing dot */}
            <div className="absolute w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
          </div>
          <p className="text-zinc-400 text-sm mt-8 font-medium animate-pulse tracking-widest uppercase">
            {t("components.synthesizing")}
          </p>
        </div>
      )}

      {/* Sidebar Navigation */}
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside id="tour-sidebar" className={`fixed md:static inset-y-0 left-0 w-64 border-r border-white/5 flex flex-col z-50 bg-[#0a0a0a] md:bg-black/20 md:backdrop-blur-2xl transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-medium text-zinc-100 tracking-tight flex items-center">
            HiveEdu <span className="ml-1 text-zinc-500 font-normal">Analytics</span>
          </h2>
          <button 
            className="md:hidden text-zinc-500 hover:text-zinc-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/10 to-transparent text-zinc-900 dark:text-white shadow-[inset_3px_0_0_0_rgba(6,182,212,1)] active-nav-link"
                    : "text-zinc-500 hover:bg-black/5 dark:hover:bg-white/[0.02] hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer in Sidebar */}
        <div className="p-4 md:p-6 border-t border-white/5">
          <div className="flex items-center px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-colors group">
            <UserCircle className="w-8 h-8 text-zinc-500 mr-3 group-hover:text-zinc-300 transition-colors" strokeWidth={1.5} />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-zinc-100 truncate group-hover:text-white transition-colors">{username}</p>
              <p className="text-[11px] text-zinc-500 truncate">{userRole ? userRole.toLowerCase() + "@hiveedu.app" : "user@hiveedu.app"}</p>
            </div>
            
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="md:hidden ml-2 text-zinc-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Mobile Top Bar */}
        <header className="mobile-topbar md:hidden h-16 border-b border-zinc-800 bg-[#09090b]/85 text-zinc-100 backdrop-blur-xl flex items-center justify-between px-4 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="text-zinc-400 hover:text-zinc-100 transition-colors p-1"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-medium text-zinc-100">
              {navItems.find((item) => item.href === pathname)?.name || t("components.dashboard_fallback")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {mounted && (
                <button
                  onClick={toggleTheme}
                  className="relative flex h-7 w-12 items-center rounded-full bg-white/5 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  role="switch"
                  aria-checked={theme === "light"}
                >
                  <span className="sr-only">{t("components.toggle_theme")}</span>
                  <span
                    className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-zinc-200 transition-transform duration-300 ease-in-out shadow-sm ${
                      theme === "light" ? "translate-x-6" : "translate-x-1"
                    }`}
                  >
                    {theme === "light" ? (
                      <Sun className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />
                    ) : (
                      <Moon className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
             )}
          </div>
        </header>

        {/* Desktop Topbar */}
        <header className="hidden md:flex h-20 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl items-center justify-between px-10 z-10 sticky top-0">
          <h1 className="text-sm font-medium text-zinc-400 tracking-widest uppercase opacity-70">
            {navItems.find((item) => item.href === pathname)?.name || t("components.dashboard_fallback")}
          </h1>
          <div className="flex items-center space-x-6 ml-auto">
            {/* Theme Toggle Switch */}
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10"
                  title={t("components.toggle_language")}
                >
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">{i18n.language === 'en' ? 'EN' : 'ID'}</span>
                </button>
              )}
              {mounted && (
                <button
                  id="tour-theme-toggle"
                  onClick={toggleTheme}
                  className="relative flex h-7 w-12 items-center rounded-full bg-white/5 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  role="switch"
                  aria-checked={theme === "light"}
                >
                  <span className="sr-only">{t("components.toggle_theme")}</span>
                  <span
                    className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-zinc-200 transition-transform duration-300 ease-in-out shadow-sm ${
                      theme === "light" ? "translate-x-6" : "translate-x-1"
                    }`}
                  >
                    {theme === "light" ? (
                      <Sun className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />
                    ) : (
                      <Moon className="h-3 w-3 text-zinc-900" strokeWidth={2.5} />
                    )}
                  </span>
                </button>
              )}
            </div>

            <button
              id="tour-logout"
              onClick={handleLogout}
              className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400 px-4 py-2 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group"
            >
              <LogOut className="w-4 h-4 mr-2.5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
              {t('sidebar.logout')}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto z-10 relative animate-in fade-in zoom-in-95 duration-500 ease-out"
        >
          {children}
        </main>
        
        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] dark:bg-cyan-500/20 dark:hover:bg-cyan-500/40 dark:border dark:border-cyan-500/30 dark:text-cyan-400 dark:backdrop-blur-md dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 transform ${
            showScrollTop ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
          }`}
          aria-label={t("components.scroll_to_top")}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </div>
  );
}
