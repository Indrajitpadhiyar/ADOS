import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import CreateCampaignSection from "../components/sections/CreateCampaignSection";

export default function CreateCampaignPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <CreateCampaignSection onCampaignCreated={() => navigate("/dashboard")} />
    </DashboardLayout>
  );
}
