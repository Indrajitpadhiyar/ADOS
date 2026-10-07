import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ManageAdsPage from "./pages/ManageAdsPage";
import CreateAdPage from "./pages/CreateAdPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import ManageAccountPage from "./pages/ManageAccountPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ados_user");
      return stored ? JSON.parse(stored) : { name: "Advertiser" };
    } catch {
      return { name: "Advertiser" };
    }
  });

  const handleLoginSuccess = (userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem("ados_user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ados_token");
    localStorage.removeItem("ados_user");
    setUser({ name: "Advertiser" });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication Page */}
        <Route
          path="/auth"
          element={<AuthPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Main Dashboard Overview */}
        <Route
          path="/dashboard"
          element={<DashboardPage user={user} onLogout={handleLogout} />}
        />

        {/* Manage Ads Page */}
        <Route
          path="/manage-ads"
          element={<ManageAdsPage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/dashboard/manage-ads"
          element={<ManageAdsPage user={user} onLogout={handleLogout} />}
        />

        {/* Create Ad Page */}
        <Route
          path="/create-ads"
          element={<CreateAdPage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/dashboard/create-ads"
          element={<CreateAdPage user={user} onLogout={handleLogout} />}
        />

        {/* Create Campaign Page */}
        <Route
          path="/create-campaign"
          element={<CreateCampaignPage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/dashboard/create-campaign"
          element={<CreateCampaignPage user={user} onLogout={handleLogout} />}
        />

        {/* Manage Connected Accounts & Team */}
        <Route
          path="/manage-account"
          element={<ManageAccountPage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/dashboard/manage-account"
          element={<ManageAccountPage user={user} onLogout={handleLogout} />}
        />

        {/* System Settings & API */}
        <Route
          path="/settings"
          element={<SettingsPage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/dashboard/settings"
          element={<SettingsPage user={user} onLogout={handleLogout} />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
