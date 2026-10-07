import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardOverviewSection from "../components/sections/DashboardOverviewSection";

export default function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();

  const handleNavigate = (tab) => {
    switch (tab) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "manage-ads":
        navigate("/manage-ads");
        break;
      case "create-ads":
        navigate("/create-ads");
        break;
      case "create-campaign":
        navigate("/create-campaign");
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

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <DashboardOverviewSection user={user} onNavigate={handleNavigate} />
    </DashboardLayout>
  );
}
