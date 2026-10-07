import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Key,
  Bell,
  ShieldCheck,
  Cpu,
  Copy,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Sparkles,
  Zap,
} from "lucide-react";

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'api' | 'alerts' | 'pixel'
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  // Settings state
  const [attributionModel, setAttributionModel] = useState("data_driven");
  const [refreshRate, setRefreshRate] = useState("14ms");
  const [webhookUrl, setWebhookUrl] = useState("https://api.brand.com/v1/ados-webhooks");
  const [minRoasAlert, setMinRoasAlert] = useState(2.8);
  const [autoPauseFatigue, setAutoPauseFatigue] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);

  const rawKey = "ados_live_sec_894102938471029481729481";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(rawKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2500);
  };

  const handleSave = () => {
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Toast */}
      <AnimatePresence>
        {saveNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-[#111113] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences and settings saved successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 mb-2">
            <Settings className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>System Configurations & Automation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111113] tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure attribution logic, developer API webhooks, automated guardrails, and event tracking.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Save All Changes
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: "general", label: "General & Attribution" },
          { id: "api", label: "API Keys & Webhooks" },
          { id: "alerts", label: "Autonomous Alerts & Rules" },
          { id: "pixel", label: "Tracking Pixels & CAPI" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#111113] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL & ATTRIBUTION */}
      {activeTab === "general" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6 max-w-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Primary Multi-Touch Attribution Model
              </label>
              <select
                value={attributionModel}
                onChange={(e) => setAttributionModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900"
              >
                <option value="data_driven">ADOS Neural Data-Driven Attribution (Recommended)</option>
                <option value="7d_click_1d_view">7-Day Click / 1-Day View (Meta Standard)</option>
                <option value="last_touch">Last Interaction (Conservative)</option>
                <option value="first_touch">First Touch (Top of Funnel)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Data-driven attribution mathematically distributes ROAS credit across all touchpoints without bias.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Telemetry Stream Pacing
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "14ms", label: "14ms Sub-Second", note: "Real-time socket stream" },
                  { id: "5m", label: "Every 5 Minutes", note: "Standard sync" },
                  { id: "15m", label: "Every 15 Minutes", note: "Conserves network quota" },
                ].map((rate) => (
                  <button
                    key={rate.id}
                    type="button"
                    onClick={() => setRefreshRate(rate.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      refreshRate === rate.id
                        ? "border-[#ff4a22] bg-orange-50/20 text-[#111113]"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="text-xs font-extrabold">{rate.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rate.note}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API KEYS & WEBHOOKS */}
      {activeTab === "api" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-extrabold text-[#111113]">Developer API Credentials</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticate automated backend services and custom reporting scripts.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Live Production Secret Key
              </span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {showKey ? "Hide Secret" : "Reveal Secret"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type={showKey ? "text" : "password"}
                readOnly
                value={rawKey}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-4 py-2 bg-[#111113] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {apiKeyCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Outgoing Webhook Endpoint (POST)
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900"
            />
            <p className="text-[11px] text-slate-400">
              Receives instant JSON payloads whenever bid adjustments or fatigue warnings occur.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: ALERTS & RULES */}
      {activeTab === "alerts" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-extrabold text-[#111113]">Autonomous Rule Engine</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set guardrails that protect capital and notify your media buying team.
            </p>
          </div>

          <div className="space-y-4">
            {/* Rule 1: Auto Pause Fatigue */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">Auto-Pause Creative Fatigue</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Temporarily pause any ad creative when its 48h CTR decays by over 40%.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoPauseFatigue(!autoPauseFatigue)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  autoPauseFatigue ? "bg-[#ff4a22]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoPauseFatigue ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Rule 2: Minimum ROAS Guardrail */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Critical Minimum ROAS Alert Threshold</span>
                <span className="text-sm font-black text-[#ff4a22]">{minRoasAlert}x</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="5.0"
                step="0.1"
                value={minRoasAlert}
                onChange={(e) => setMinRoasAlert(Number(e.target.value))}
                className="w-full accent-[#ff4a22] cursor-pointer"
              />
              <div className="text-[11px] text-slate-400">
                Triggers immediate push notifications if campaign blended ROAS drops below this level.
              </div>
            </div>

            {/* Notification Channels */}
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Slack Notifications</span>
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#ff4a22] cursor-pointer"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Email Digest Alerts</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#ff4a22] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRACKING PIXELS & CAPI */}
      {activeTab === "pixel" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-extrabold text-[#111113]">Server-Side Tracking & CAPI</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              100% first-party cookies and cloud server-side event dispatching for iOS 14.5+ resilience.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "Meta Conversions API (CAPI Gateway)",
                status: "Operational",
                matchScore: "9.6 / 10 Event Quality",
              },
              {
                name: "Google Ads Enhanced Conversions (GTM)",
                status: "Operational",
                matchScore: "9.4 / 10 Match Rate",
              },
              {
                name: "LinkedIn Conversions API (CAPI Gateway)",
                status: "Operational",
                matchScore: "9.3 / 10 Match Rate",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-extrabold text-[#111113]">{p.name}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    {p.matchScore}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
