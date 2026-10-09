import React, { useState } from 'react';
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
  Compass,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import MountainLogo from './MountainLogo';

export default function AuthCard({ mountainBg }) {
  // Modes: 'login' | 'signup'
  const [mode, setMode] = useState('login');
  
  // Form fields
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
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // List of countries for selector
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

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-400' };
    if (score === 2 || score === 3) return { score: 2, text: 'Medium', color: 'bg-amber-400' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
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
    }, 4000);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      triggerToast('error', 'Please fill in all required fields.');
      return;
    }

    if (mode === 'signup') {
      if (!formData.name) {
        triggerToast('error', 'Please enter your full name.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        triggerToast('error', 'Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        triggerToast('error', 'Password must be at least 6 characters.');
        return;
      }
    }

    setIsLoading(true);

    // Simulate backend auth latency
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        triggerToast('success', `Welcome back to ADOS, ${formData.email.split('@')[0]}!`);
      } else {
        triggerToast('success', `Account successfully created! Welcome to ADOS, ${formData.name}.`);
      }
    }, 1200);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      triggerToast('success', `Password reset link sent to ${forgotEmail}`);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSubmitted(false);
        setForgotEmail('');
      }, 1000);
    }, 800);
  };

  return (
    <div className="relative w-full max-w-[960px] mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 animate-bounce-short ${
          toast.type === 'success' 
            ? 'bg-slate-900/90 text-white border border-emerald-500/40' 
            : 'bg-rose-950/90 text-white border border-rose-500/40'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Unified Split Card */}
      <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] overflow-hidden flex flex-col md:flex-row min-h-[580px] border border-slate-100 transition-all duration-500">
        
        {/* ================= LEFT SIDE: BRAND / MOUNTAIN ATMOSPHERE ================= */}
        <div className="relative md:w-5/12 overflow-hidden flex flex-col justify-between p-8 md:p-10 text-white select-none">
          {/* Alpine Background underlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ 
              backgroundImage: `url(${mountainBg})`,
            }}
          />
          
          {/* Soft Slate-Blue Atmospheric Frosted Overlay (faithful to reference image) */}
          <div className="absolute inset-0 bg-[#6587a8]/70 backdrop-blur-[3px] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#7396b8]/50 via-[#507293]/60 to-[#2c4763]/85" />
          
          {/* Subtle Ambient Glow Light */}
          <div className="absolute -top-16 -left-16 w-52 h-52 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Brand & Mountain Icon Area */}
          <div className="relative z-10 flex flex-col items-center text-center mt-3">
            {/* Mountain Peak Icon (Recreation of reference design) */}
            <div className="p-3 mb-2 transition-transform duration-500 hover:scale-105">
              <MountainLogo className="w-24 h-20 text-white/95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]" />
            </div>

            {/* Welcome Typography */}
            <h2 className="text-3xl font-normal tracking-wide text-white drop-shadow-sm font-['Plus_Jakarta_Sans']">
              Welcome
            </h2>
            <p className="text-white/80 text-xs md:text-sm font-light mt-1.5 tracking-wide max-w-[240px]">
              This's your guide to magical places
            </p>
          </div>

          {/* Middle/Bottom: Interactive Feature Highlights with Hollow Rings */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-center gap-3.5 group cursor-default">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/80 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-white group-hover:scale-110 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
              </span>
              <span className="text-xs md:text-sm font-light text-white/90 tracking-wide group-hover:text-white transition-colors">
                Create your track calendar
              </span>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/80 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-white group-hover:scale-110 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
              </span>
              <span className="text-xs md:text-sm font-light text-white/90 tracking-wide group-hover:text-white transition-colors">
                Discover beautiful places
              </span>
            </div>

            <div className="flex items-center gap-3.5 group cursor-default">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/80 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-white group-hover:scale-110 shadow-sm">
                <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
              </span>
              <span className="text-xs md:text-sm font-light text-white/90 tracking-wide group-hover:text-white transition-colors">
                Share with friends
              </span>
            </div>
          </div>

          {/* Bottom Branding Tag */}
          <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 font-light">
            <span>ADOS Ecosystem v2.4</span>
            <span className="flex items-center gap-1 text-white/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-200" /> Enterprise Secured
            </span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: PURE WHITE THEME FORM ================= */}
        <div className="relative md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-between">
          
          <div>
            {/* Top Navigation & Switcher (Faithful to Reference "Login / Sign up") */}
            <div className="flex items-center justify-between pb-8">
              <div className="flex items-center text-2xl font-light tracking-wide">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`transition-all duration-300 font-semibold cursor-pointer pb-1 ${
                    mode === 'login'
                      ? 'text-[#486588] text-2xl border-b-2 border-[#486588]'
                      : 'text-slate-400 hover:text-slate-600 text-xl font-normal'
                  }`}
                >
                  Login
                </button>
                <span className="mx-2 text-slate-300 font-light select-none">/</span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`transition-all duration-300 cursor-pointer pb-1 ${
                    mode === 'signup'
                      ? 'text-[#486588] text-2xl font-semibold border-b-2 border-[#486588]'
                      : 'text-slate-400 hover:text-slate-600 text-xl font-normal'
                  }`}
                >
                  Sign up
                </button>
              </div>

              {/* Top right prompt */}
              <div className="text-right">
                <span className="text-xs text-slate-400 font-light">
                  {mode === 'login' ? "Don't have an " : 'Already have an '}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#486588] underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {mode === 'login' ? 'account?' : 'account?'}
                </button>
              </div>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* FIELD: YOUR NAME (Only in Sign up mode with smooth expansion) */}
              {mode === 'signup' && (
                <div className="space-y-1.5 transition-all duration-300 animate-fadeIn">
                  <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    YOUR NAME
                  </label>
                  <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full py-2 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              )}

              {/* FIELD: COUNTRY (In Sign up mode, or customized for reference) */}
              {mode === 'signup' && (
                <div className="space-y-1.5 transition-all duration-300 animate-fadeIn">
                  <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
                    COUNTRY
                  </label>
                  <div className="relative animated-underline-input border-b border-slate-200 hover:border-slate-300 transition-colors">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full py-2 text-sm text-slate-800 bg-transparent focus:outline-none focus:ring-0 cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className="text-slate-800">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* FIELD: EMAIL */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
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
                    className="w-full py-2 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* FIELD: PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
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
                    className="w-full py-2 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0 pr-8"
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

                {/* Password Strength Meter (In Sign Up mode) */}
                {mode === 'signup' && formData.password && (
                  <div className="pt-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Password strength:</span>
                      <span className="font-semibold text-slate-700">{strength.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                      <div className={`h-full flex-1 transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* FIELD: CONFIRM PASSWORD (Sign up mode) */}
              {mode === 'signup' && (
                <div className="space-y-1.5 transition-all duration-300 animate-fadeIn">
                  <label className="block text-[11px] font-bold tracking-wider text-slate-600 uppercase">
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
                      className="w-full py-2 text-sm text-slate-800 placeholder-slate-300 bg-transparent focus:outline-none focus:ring-0 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* REMEMBER ME / TERMS */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-slate-300 text-[#486588] focus:ring-0 cursor-pointer accent-[#486588]"
                  />
                  <span className="text-xs text-slate-500 font-normal">
                    {mode === 'login' ? 'Remember this session' : 'I agree to the Terms of Service & Privacy Policy'}
                  </span>
                </label>

                {/* Quick 1-click Demo Fill */}
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-medium text-slate-400 hover:text-[#486588] flex items-center gap-1 transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-slate-50"
                  title="Auto-fill with sample credentials for rapid review"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Quick Fill
                </button>
              </div>

              {/* ACTION BUTTON & SOCIAL LOGIN ROW (Faithful to Reference Image) */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                {/* Soft Pill Primary Button matching the reference screenshot */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto min-w-[130px] px-8 py-2.5 rounded-full bg-[#c0d4e6] hover:bg-[#b0cbe0] active:scale-95 text-[#2c4b72] font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#2c4b72] border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{mode === 'login' ? 'LOGIN' : 'SIGN UP'}</span>
                  )}
                </button>

                {/* Social Login Section */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-light">
                    Or {mode === 'login' ? 'login' : 'sign up'} with
                  </span>

                  {/* Google (G+) */}
                  <button
                    type="button"
                    onClick={() => triggerToast('success', 'Google authentication connected')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#e05244] hover:bg-rose-50 transition-all duration-200 active:scale-90 font-bold text-sm border border-transparent hover:border-rose-200 cursor-pointer"
                    title="Sign in with Google"
                  >
                    G+
                  </button>

                  {/* Twitter / X (t) */}
                  <button
                    type="button"
                    onClick={() => triggerToast('success', 'Twitter / X authentication connected')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#4da6e9] hover:bg-sky-50 transition-all duration-200 active:scale-90 font-bold text-sm border border-transparent hover:border-sky-200 cursor-pointer"
                    title="Sign in with Twitter / X"
                  >
                    t
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    onClick={() => triggerToast('success', 'GitHub authentication connected')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all duration-200 active:scale-90 font-bold text-xs border border-transparent hover:border-slate-300 cursor-pointer"
                    title="Sign in with GitHub"
                  >
                    gh
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom Security Assurance Note */}
          <div className="pt-8 text-center sm:text-left text-[11px] text-slate-400 border-t border-slate-100 mt-6">
            <span>ADOS Cloud Platform · 256-Bit SSL Protection · Need assistance? </span>
            <a href="#support" onClick={(e) => { e.preventDefault(); triggerToast('success', 'Support desk opened at support@ados.io'); }} className="text-[#486588] font-medium hover:underline">
              Contact Support
            </a>
          </div>

        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
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
              Enter your registered email address below. We'll send a secure one-time verification link to reset your account password.
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
                  placeholder="your.email@ados.io"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#486588] transition-colors"
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
                <button
                  type="submit"
                  disabled={forgotSubmitted}
                  className="px-5 py-2 rounded-full bg-[#c0d4e6] hover:bg-[#b0cbe0] text-[#2c4b72] font-semibold text-xs transition-all shadow-sm cursor-pointer"
                >
                  {forgotSubmitted ? 'Sending Link...' : 'Send Recovery Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
