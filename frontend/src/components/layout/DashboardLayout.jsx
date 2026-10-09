import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  LogOut,
  Bell,
  Menu,
  Plus,
  Rocket,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  // Determine active tab from URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("manage-ads")) return "manage-ads";
    if (path.includes("create-ads")) return "create-ads";
    if (path.includes("manage-account")) return "manage-account";
    if (path.includes("settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  const handleNavigateTab = (tabId) => {
    switch (tabId) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "manage-ads":
        navigate("/manage-ads");
        break;
      case "create-ads":
        navigate("/create-ads");
        break;
      case "manage-account":
        navigate("/manage-account");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/dashboard");
    }
  };

  // Notifications mock
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "LinkedIn ROAS Surge",
      desc: "B2B Decision Makers Campaign hit 5.2x ROAS in the last 60 minutes.",
      time: "12m ago",
      unread: true,
    },
    {
      id: "n-2",
      title: "Autonomous Budget Reallocation",
      desc: "Shifted $450 daily budget from YouTube to Meta Advantage+.",
      time: "1h ago",
      unread: true,
    },
    {
      id: "n-3",
      title: "Attribution Sync Verified",
      desc: "5/5 ad networks synchronized with 0 duplicate conversion flags.",
      time: "3h ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Consolidated Dashboard";
      case "manage-ads":
        return "Manage Ads";
      case "create-ads":
        return "Create Ads";
      case "manage-account":
        return "Manage Account";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("ados_token");
      localStorage.removeItem("ados_user");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fafbfc] text-[#111113] font-['Plus_Jakarta_Sans',sans-serif] flex selection:bg-slate-900 selection:text-white">
      {/* 1. SIDEBAR NAVIGATION */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        onBackToWebsite={() => navigate("/")}
        onLogout={handleLogoutAction}
        user={user || { name: "Advertiser" }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN APP CANVAS */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* TOP APP BAR */}
        <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200/80 transition-all">
          <div className="px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-400">
                  ADOS Portal
                </span>
                <span className="hidden sm:inline text-xs text-slate-300">/</span>
                <span className="text-sm font-extrabold text-[#111113]">
                  {getBreadcrumbTitle()}
                </span>
              </div>
            </div>

            {/* Center: Live Sync Tag */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 tracking-wide">
                5 Networks Active • Autonomous AI Sync
              </span>
            </div>

            {/* Right: Quick "+ New", Notification Bell, Back to Landing, User & Sign Out */}
            <div className="flex items-center gap-2.5">
              {/* Quick "+ Create Ad" Button */}
              <button
                onClick={() => navigate("/create-ads")}
                className="px-3.5 py-2 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-[#ff4a22]" />
                <span className="hidden sm:inline">Create Ad</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 relative cursor-pointer transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff4a22] animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#111113]">
                            Telemetry Alerts
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#ff4a22] text-white text-[10px] font-black">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[10px] text-[#ff4a22] font-bold hover:underline cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border text-xs transition-colors ${
                              n.unread
                                ? "bg-orange-50/40 border-orange-200/80"
                                : "bg-slate-50/60 border-slate-100"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[#111113]">
                              <span>{n.title}</span>
                              <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">{n.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Back to Website Button */}
              <button
                onClick={() => navigate("/")}
                className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Landing Page</span>
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-1 sm:pl-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#ff4a22] to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name || "User"} className="w-full h-full object-cover" />
                  ) : user?.name ? (
                    user.name.slice(0, 2).toUpperCase()
                  ) : (
                    "AD"
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-[#111113] truncate max-w-[120px]">
                    {user?.name || "Advertiser"}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {user?.role ? (user.role === "admin" ? "Workspace Admin" : user.role) : "Workspace Admin"}
                  </span>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleLogoutAction}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-8 lg:p-10">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="py-6 bg-white border-t border-slate-200/80 text-xs text-slate-500">
          <div className="max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111113]">ADOS Autonomous Ad Operating System</span>
              <span>•</span>
              <span>Version 2.4-enterprise</span>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">API Status: Operational</span>
              <span className="hover:text-slate-600 cursor-pointer">Security: SOC2 Certified</span>
              <span className="hover:text-slate-600 cursor-pointer">Live Sync: 14ms latency</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
