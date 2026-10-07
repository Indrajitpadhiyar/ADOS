import React from "react";
import { useNavigate } from "react-router-dom";
import FullPageAuth from "../components/FullPageAuth";

export default function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleSuccess = (userData) => {
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    } else {
      if (userData) {
        localStorage.setItem("ados_user", JSON.stringify(userData));
      }
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Quick Back to Landing Bar */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 transition-all hover:scale-105 cursor-pointer"
        >
          ← Back to Landing
        </button>
      </div>

      <FullPageAuth onLoginSuccess={handleSuccess} />
    </div>
  );
}
