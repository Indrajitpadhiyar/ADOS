import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ManageAccountSection from "../components/sections/ManageAccountSection";

export default function ManageAccountPage({ user, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <ManageAccountSection />
    </DashboardLayout>
  );
}
