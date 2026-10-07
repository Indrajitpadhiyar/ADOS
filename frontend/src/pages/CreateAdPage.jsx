import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import CreateAdSection from "../components/sections/CreateAdSection";

export default function CreateAdPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <CreateAdSection onAdCreated={() => navigate("/manage-ads")} />
    </DashboardLayout>
  );
}
