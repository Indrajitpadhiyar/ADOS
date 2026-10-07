import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ManageAdsSection from "../components/sections/ManageAdsSection";

export default function ManageAdsPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <ManageAdsSection onCreateAdClick={() => navigate("/create-ads")} />
    </DashboardLayout>
  );
}
