import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Lock,
  Mail,
  User,
} from "lucide-react";
import MessimoAdosLogo from "./MessimoAdosLogo";
import ClockWidget from "./ClockWidget";
import characterImg from "../assets/ados-character.png";

export default function Playful3DAuth() {
  // 'signup' | 'login' (default to 'signup' matching reference image "Create account")
  const [mode, setMode] = useState("signup");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      triggerToast("error", "Please fill in your email and password.");
      return;
    }

    if (mode === "signup" && formData.password.length < 6) {
      triggerToast("error", "Password should have at least 6 characters.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === "signup") {
        triggerToast(
          "success",
          `Account created! Welcome to ADOS, ${formData.name || formData.email.split("@")[0]}!`,
        );
      } else {
        triggerToast("success", `Welcome back to ADOS! Connecting...`);
      }
    }, 1100);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      triggerToast("success", `Password recovery link sent to ${forgotEmail}`);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSubmitted(false);
        setForgotEmail("");
      }, 1000);
    }, 800);
  };

  return (
    <div className="w-full min-h-screen bg-[#cae89b] flex items-center justify-center p-3 sm:p-6 md:p-10 font-['Outfit','Poppins','Plus_Jakarta_Sans',sans-serif] selection:bg-[#9ed84f] selection:text-[#18360d]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${
              toast.type === "success"
                ? "bg-slate-900/95 text-white border-[#9ed84f]/40"
                : "bg-rose-950/95 text-white border-rose-500/40"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#9ed84f] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TABLET DEVICE CONTAINER ================= */}
      <div className="relative w-full max-w-[1140px] bg-[#c3e69a] rounded-[36px] sm:rounded-[46px] md:rounded-[56px] border-[10px] sm:border-[14px] md:border-[18px] border-[#16261b] shadow-[0_30px_70px_-15px_rgba(25,50,30,0.38)] overflow-hidden flex flex-col lg:flex-row min-h-[640px] md:min-h-[700px]">
        {/* ================= LEFT SIDE: 3D CHARACTER WORKSPACE ================= */}
        <div className="relative w-full lg:w-[52%] xl:w-[50%] min-h-[340px] lg:min-h-full bg-[#c0e496] overflow-hidden flex flex-col justify-between p-6 sm:p-8 select-none">
          {/* Subtle Wall to Deep Forest Floor Split */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#c3e69b] via-[#bfe296] to-[#1e4429]" />

          {/* Wall Clock at Top Right of Left Room */}
          <div className="relative z-10 flex justify-end items-start pt-2 pr-2 sm:pr-4">
            <ClockWidget className="w-11 h-11 sm:w-14 sm:h-14" />
          </div>

          {/* 3D Clay Character Working at Desk Illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-2">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
            >
              <img
                src={characterImg}
                alt="ADOS Platform Character at Work"
                className="w-full h-full object-cover"
              />

              {/* Soft Ambient Corner Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Bottom Left Subtle Indicator */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#1e3d23] font-semibold px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1e4429]" />
              ADOS Studio Workspace
            </span>
            <span className="text-[11px] opacity-75">v2.4 Live</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: PURE WHITE THEMED CARD ================= */}
        <div className="relative flex-1 bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[44px] m-2 sm:m-3 md:m-4 p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between shadow-sm">
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between">
            <MessimoAdosLogo brandName="ados" />

            {/* Quick 1-click Demo Fill */}
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-[#5d8e25] hover:text-[#4a721d] flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1 rounded-full bg-[#f1f9e6] hover:bg-[#e7f4d5] border border-[#d6ecb7]"
              title="Auto-fill sample credentials"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#86bf3b]" />
              <span>Demo Fill</span>
            </button>
          </div>

          {/* Form Content Area */}
          <div className="my-auto py-6 max-w-[360px] w-full mx-auto">
            {/* Title */}
            <motion.h1
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold text-[#1a2b20] text-center tracking-tight mb-8 font-['Outfit','Poppins',sans-serif]"
            >
              {mode === "signup" ? "Create account" : "Welcome back"}
            </motion.h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Optional Name Field in Sign Up */}
              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="w-full px-5 py-3 rounded-full border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed84f] focus:ring-2 focus:ring-[#9ed84f]/25 transition-all bg-white"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full px-5 py-3 rounded-full border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed84f] focus:ring-2 focus:ring-[#9ed84f]/25 transition-all bg-white"
                />
              </div>

              {/* Password with Eye Toggle */}
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-5 py-3 pr-12 rounded-full border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#9ed84f] focus:ring-2 focus:ring-[#9ed84f]/25 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link in Login Mode */}
              {mode === "login" && (
                <div className="flex justify-end pr-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-slate-500 hover:text-[#5d8e25] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Primary Lime Green Pill Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] active:bg-[#7ebd30] text-[#1c3a0e] font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-[#1c3a0e] border-t-transparent rounded-full"
                    />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <span>
                    {mode === "signup" ? "Create account" : "Sign in"}
                  </span>
                )}
              </motion.button>
            </form>

            {/* Social Divider */}
            <div className="text-center my-6">
              <span className="text-xs font-normal text-slate-400">
                {mode === "signup" ? "or sign up with" : "or sign in with"}
              </span>
            </div>

            {/* Social Login Round Buttons */}
            <div className="flex items-center justify-center gap-3">
              {/* Google */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() =>
                  triggerToast("success", "Google authentication initiated")
                }
                className="w-10 h-10 rounded-full bg-[#eef7e1] hover:bg-[#e2f2ce] flex items-center justify-center text-[#213b14] font-bold text-sm transition-colors cursor-pointer"
                title="Sign in with Google"
              >
                G
              </motion.button>

              {/* Microsoft / Windows */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() =>
                  triggerToast("success", "Microsoft single sign-on initiated")
                }
                className="w-10 h-10 rounded-full bg-[#eef7e1] hover:bg-[#e2f2ce] flex items-center justify-center text-[#213b14] font-bold text-sm transition-colors cursor-pointer"
                title="Sign in with Microsoft"
              >
                <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                  <span className="bg-[#213b14] rounded-[1px]" />
                  <span className="bg-[#213b14] rounded-[1px]" />
                  <span className="bg-[#213b14] rounded-[1px]" />
                  <span className="bg-[#213b14] rounded-[1px]" />
                </div>
              </motion.button>

              {/* GitHub */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() =>
                  triggerToast("success", "GitHub authentication initiated")
                }
                className="w-10 h-10 rounded-full bg-[#eef7e1] hover:bg-[#e2f2ce] flex items-center justify-center text-[#213b14] font-bold text-sm transition-colors cursor-pointer"
                title="Sign in with GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </motion.button>
            </div>

            {/* Terms and Privacy Disclaimer */}
            <div className="text-center mt-6 text-[11px] leading-relaxed text-slate-500 font-normal">
              By creating an account you agree to ADOS's{" "}
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("success", "Terms of Services clicked");
                }}
                className="text-[#5b8c24] font-semibold hover:underline"
              >
                Terms of Services
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("success", "Privacy Policy clicked");
                }}
                className="text-[#5b8c24] font-semibold hover:underline"
              >
                Privacy Policy
              </a>
              .
            </div>
          </div>

          {/* Bottom Switch Mode Toggle */}
          <div className="text-center pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {mode === "signup"
                ? "Have an account? "
                : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-xs font-bold text-[#5b8c24] hover:text-[#456b19] hover:underline cursor-pointer transition-colors"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#5b8c24]" />
                  Reset your Password
                </h3>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                account password.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@ados.io"
                  className="w-full px-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-[#9ed84f] focus:ring-2 focus:ring-[#9ed84f]/25 transition-all"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitted}
                    className="px-6 py-2.5 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] text-[#1c3a0e] font-bold text-xs shadow-sm cursor-pointer transition-colors"
                  >
                    {forgotSubmitted ? "Sending..." : "Send reset link"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
