import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Globe, 
  Sparkles, 
  AlertCircle,
  X,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import MountainLogo from './MountainLogo';
import AdosLogo from './AdosLogo';
import mountainBg from '../assets/mountain-bg.jpg';

export default function FullSizeAuth() {
  // 'login' | 'signup'
  const [mode, setMode] = useState('login');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    country: 'United States',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true,
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const countries = [
    'United States',
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia',
    'India',
    'Japan',
    'Singapore',
    'France',
    'Switzerland'
  ];

  // Password Strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-400' };
    if (score === 2 || score === 3) return { score: 2, text: 'Good', color: 'bg-amber-400' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      triggerToast('error', 'Please fill in all required fields.');
      return;
    }

    if (mode === 'signup') {
      if (!formData.name) {
        triggerToast('error', 'Please provide your full name.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        triggerToast('error', 'Password confirmation does not match.');
        return;
      }
      if (formData.password.length < 6) {
        triggerToast('error', 'Password must be at least 6 characters.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        triggerToast('success', `Welcome back, ${formData.email.split('@')[0]}! Redirecting to ADOS dashboard...`);
      } else {
        triggerToast('success', `Account created successfully! Welcome to ADOS, ${formData.name}.`);
      }
    }, 1100);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      triggerToast('success', `A password reset link has been dispatched to ${forgotEmail}`);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSubmitted(false);
        setForgotEmail('');
      }, 1000);
    }, 800);
  };

  // Motion variants for smooth transitions
  const formVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } 
    },
    exit: { 
      opacity: 0, 
      y: -15, 
      transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  const fieldVariant = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginBottom: 24,
      transition: { duration: 0.3, ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginBottom: 0,
      transition: { duration: 0.2, ease: 'easeIn' } 
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen overflow-hidden flex flex-col lg:flex-row bg-white selection:bg-[#c2d7e9] selection:text-[#27456d]">
      
      {/* ================= TOAST NOTIFICATION (Framer Motion) ================= */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-white border-emerald-500/40'
                : 'bg-rose-950/95 text-white border-rose-500/40'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium tracking-wide">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= LEFT SIDE: FULL HEIGHT BRAND PANEL ================= */}
      <div className="relative w-full lg:w-[46%] xl:w-[42%] h-[280px] sm:h-[340px] lg:h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white overflow-hidden select-none shrink-0">
        
        {/* Scenic Alpine Mountain Image Underlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${mountainBg})` }}
        />

        {/* Soft Slate-Blue Atmosphere Overlays (Faithful to Reference Image) */}
        <div className="absolute inset-0 bg-[#6588aa]/75 mix-blend-multiply backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7397b9]/60 via-[#537699]/70 to-[#274462]/90" />

        {/* Top: ADOS Brand Logo + Title */}
        <div className="relative z-10 flex flex-col items-center text-center mt-2 lg:mt-6">
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="mb-3"
          >
            <AdosLogo className="w-20 h-20 sm:w-24 sm:h-24 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-normal tracking-wide text-white drop-shadow-sm font-['Plus_Jakarta_Sans']"
          >
            Welcome to ADOS
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/85 text-xs sm:text-sm font-light mt-1.5 tracking-wide max-w-[320px] leading-relaxed"
          >
            Intelligent Operations & Autonomous Digital Platform
          </motion.p>
        </div>

        {/* Middle: 3 Characteristic Hollow-Ring Bullet Points (ADOS Operations) */}
        <div className="relative z-10 my-4 lg:my-0 space-y-4 max-w-sm mx-auto lg:mx-0">
          {[
            { id: 1, text: 'Automated Workflow & Task Orchestration' },
            { id: 2, text: 'Real-Time Telemetry & Smart Analytics' },
            { id: 3, text: 'Zero-Trust Enterprise Access & Security' },
          ].map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + idx * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3.5 group cursor-default transition-all"
            >
              <span className="w-4 h-4 rounded-full border-2 border-white/80 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-white group-hover:scale-110 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
              </span>
              <span className="text-xs sm:text-sm font-light text-white/90 tracking-wide group-hover:text-white transition-colors">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 pt-4 border-t border-white/20 hidden lg:flex items-center justify-between text-xs text-white/70 font-light">
          <span>ADOS Core OS v2.4</span>
          <span className="flex items-center gap-1.5 text-white/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-200" /> Enterprise Secured
          </span>
        </div>

      </div>

      {/* ================= RIGHT SIDE: FULL HEIGHT PURE WHITE THEME ================= */}
      <div className="flex-1 h-full bg-white flex flex-col justify-between overflow-y-auto px-6 py-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        
        {/* Subtle Top Breadcrumb & Status */}
        <div className="w-full max-w-[480px] mx-auto flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            {/* <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wider uppercase text-slate-400">
              ADOS Secure Gateway
            </span> */}
          </div>

          {/* Quick Demo Pre-fill button */}
          {/* <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-medium text-slate-400 hover:text-[#416287] flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-full hover:bg-slate-50 border border-slate-200/60"
            title="Auto-fill with demo credentials"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Fill</span>
          </button> */}
        </div>

        {/* Centered Form Area */}
        <div className="w-full max-w-[480px] mx-auto my-auto py-4">
          
          {/* Header Switcher: Login / Sign up (Faithful to Reference Design) */}
          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center text-2xl sm:text-3xl font-light tracking-wide">
              {/* Login Tab */}
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`relative transition-all duration-300 cursor-pointer pb-1.5 ${
                  mode === 'login'
                    ? 'text-[#486588] font-bold text-2xl sm:text-3xl'
                    : 'text-slate-400 hover:text-slate-600 text-xl sm:text-2xl font-normal'
                }`}
              >
                Login
                {mode === 'login' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#486588] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>

              <span className="mx-2.5 text-slate-300 font-light select-none text-2xl">/</span>

              {/* Sign up Tab */}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`relative transition-all duration-300 cursor-pointer pb-1.5 ${
                  mode === 'signup'
                    ? 'text-[#486588] font-bold text-2xl sm:text-3xl'
                    : 'text-slate-400 hover:text-slate-600 text-xl sm:text-2xl font-normal'
                }`}
              >
                Sign up
                {mode === 'signup' && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#486588] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Prompt on the right */}
            <div className="text-right">
              <span className="text-xs text-slate-400 font-light hidden sm:inline">
                {mode === 'login' ? "Don't have an " : 'Already have an '}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-xs font-semibold text-slate-600 hover:text-[#486588] underline underline-offset-2 transition-colors cursor-pointer"
              >
                account?
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Animated Field: YOUR NAME (Only in Sign up mode) */}
            <AnimatePresence initial={false}>
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  variants={fieldVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    YOUR NAME
                  </label>
                  <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated Field: COUNTRY (Only in Sign up mode) */}
            <AnimatePresence initial={false}>
              {mode === 'signup' && (
                <motion.div
                  key="country-field"
                  variants={fieldVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    COUNTRY
                  </label>
                  <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full py-2.5 text-sm text-slate-800 bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className="text-slate-800">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FIELD: EMAIL */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                EMAIL
              </label>
              <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* FIELD: PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  PASSWORD
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Forgot <span className="font-medium text-slate-500">password?</span>
                  </button>
                )}
              </div>

              <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength animated meter in Sign up */}
              <AnimatePresence>
                {mode === 'signup' && formData.password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Security strength:</span>
                      <span className="font-semibold text-slate-700">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Animated Field: CONFIRM PASSWORD (Only in Sign up mode) */}
            <AnimatePresence initial={false}>
              {mode === 'signup' && (
                <motion.div
                  key="confirm-password-field"
                  variants={fieldVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Checkbox terms / remember session */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-300 text-[#486588] focus:ring-0 cursor-pointer accent-[#486588]"
                />
                <span className="text-xs text-slate-500 font-normal">
                  {mode === 'login' ? 'Remember this session' : 'I accept the Platform Terms & Policies'}
                </span>
              </label>
            </div>

            {/* Action Button & Social Login Row (Faithful to Reference Design) */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-5">
              
              {/* Soft Pill Primary Button with Framer Motion Spring */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto min-w-[140px] px-9 py-2.5 rounded-full bg-[#c0d4e6] hover:bg-[#b0cbe0] active:bg-[#a0bfd7] text-[#2c4b72] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-[#2c4b72] border-t-transparent rounded-full" 
                    />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'LOGIN' : 'SIGN UP'}</span>
                )}
              </motion.button>

              {/* Social Login Section */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-light">
                  Or {mode === 'login' ? 'login' : 'sign up'} with
                </span>

                {/* Google G+ */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => triggerToast('success', 'Google Single Sign-On initiated')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#e05244] hover:bg-rose-50 transition-colors font-bold text-sm cursor-pointer"
                  title="Sign in with Google"
                >
                  G+
                </motion.button>

                {/* Twitter / X (t) */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => triggerToast('success', 'Twitter / X authorization initiated')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#4da6e9] hover:bg-sky-50 transition-colors font-bold text-sm cursor-pointer"
                  title="Sign in with Twitter / X"
                >
                  t
                </motion.button>

                {/* GitHub (gh) */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => triggerToast('success', 'GitHub OAuth initiated')}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors font-bold text-xs cursor-pointer"
                  title="Sign in with GitHub"
                >
                  gh
                </motion.button>
              </div>
            </div>

          </form>

        </div>

        {/* Footer Note */}
        <div className="w-full max-w-[480px] mx-auto pt-6 text-center sm:text-left text-[11px] text-slate-400 border-t border-slate-100">
          <span>&copy; {new Date().getFullYear()} ADOS Cloud Platform · Need help? </span>
          <a 
            href="#support" 
            onClick={(e) => { e.preventDefault(); triggerToast('success', 'Support ticketing initiated at support@ados.io'); }}
            className="text-[#486588] font-medium hover:underline"
          >
            Contact support
          </a>
        </div>

      </div>

      {/* ================= FORGOT PASSWORD MODAL (Framer Motion) ================= */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#486588]" />
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
                Provide your ADOS account email. We'll send you an encrypted verification link to create a new password.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@ados.io"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#486588] transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={forgotSubmitted}
                    className="px-5 py-2 rounded-full bg-[#c0d4e6] hover:bg-[#b0cbe0] text-[#2c4b72] font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    {forgotSubmitted ? 'Sending...' : 'Send Recovery Link'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        
    </div>
  );
}
