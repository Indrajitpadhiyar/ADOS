import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import {
  Target,
  Rocket,
  Sliders,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  PieChart,
  Users,
  Layers,
} from "lucide-react";

const OBJECTIVES = [
  {
    id: "sales",
    title: "Conversions & Sales",
    desc: "Maximize ROAS, cart checkouts, and high-ticket customer acquisitions.",
    icon: TrendingUp,
    badge: "Most Popular",
  },
  {
    id: "traffic",
    title: "Qualified Traffic",
    desc: "Drive hyper-engaged visitors to your landing page or digital storefront.",
    icon: Globe,
    badge: "High Volume",
  },
  {
    id: "leads",
    title: "Lead Generation",
    desc: "Capture qualified enterprise demo requests, signups, and email subscribers.",
    icon: Users,
    badge: "B2B / SaaS",
  },
  {
    id: "awareness",
    title: "Brand Awareness",
    desc: "Mass reach video views and impression frequency across Tier-1 audiences.",
    icon: Zap,
    badge: "Scale Reach",
  },
];

const CAMPAIGN_PLATFORMS = [
  {
    id: "meta",
    name: "Meta Ads",
    sub: "Instagram & Facebook",
    desc: "Advantage+ shopping & Reels",
    defaultSelected: true,
    share: 35,
    color: "#1877F2",
    estRoas: "4.35x",
  },
  {
    id: "google",
    name: "Google Ads",
    sub: "Search & PMax",
    desc: "Intent search & Performance Max",
    defaultSelected: true,
    share: 25,
    color: "#0F9D58",
    estRoas: "4.15x",
  },
  {
    id: "amazon",
    name: "Amazon Ads",
    sub: "Sponsored Brands & DSP",
    desc: "Marketplace high-intent checkout",
    defaultSelected: true,
    share: 15,
    color: "#d97706",
    estRoas: "5.10x",
  },
  {
    id: "youtube",
    name: "YouTube Video",
    sub: "Shorts & In-Stream",
    desc: "High retention video streams",
    defaultSelected: true,
    share: 10,
    color: "#DC2626",
    estRoas: "3.60x",
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    sub: "Sponsored InFeed & B2B",
    desc: "B2B decision makers & Lead Gen",
    defaultSelected: true,
    share: 15,
    color: "#0A66C2",
    estRoas: "3.90x",
  },
  {
    id: "pinterest",
    name: "Pinterest Ads",
    sub: "Idea Pins & Catalogs",
    desc: "Inspirational shopping discovery",
    defaultSelected: false,
    share: 10,
    color: "#E60023",
    estRoas: "3.80x",
  },
  {
    id: "snapchat",
    name: "Snapchat Ads",
    sub: "Spotlight & Stories",
    desc: "Fast Gen-Z vertical engagement",
    defaultSelected: false,
    share: 10,
    color: "#eab308",
    estRoas: "3.70x",
  },
];

export default function CreateCampaignSection({ onCampaignCreated }) {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("sales");
  const [campaignName, setCampaignName] = useState("Q4_Global_Scale_Omnichannel_Hero");
  const [dailyBudget, setDailyBudget] = useState(3500);
  const [autoOptimized, setAutoOptimized] = useState(true);
  const [targetRegion, setTargetRegion] = useState("United States, United Kingdom, Canada, Australia");

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    meta: true,
    google: true,
    amazon: true,
    youtube: true,
    linkedin: true,
    pinterest: false,
    snapchat: false,
  });

  const [channels, setChannels] = useState({
    meta: 35,
    google: 25,
    amazon: 15,
    youtube: 10,
    linkedin: 15,
    pinterest: 10,
    snapchat: 10,
  });

  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedNotice, setLaunchedNotice] = useState(false);

  // Toggle platform selection
  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (prev[id] && activeCount <= 1) return prev;
      return { ...prev, [id]: !prev[id] };
    });
  };

  const handleChannelChange = (network, val) => {
    setChannels((prev) => ({
      ...prev,
      [network]: Math.max(5, Math.min(80, Number(val))),
    }));
  };

  // Active channels calculation
  const activePlatforms = CAMPAIGN_PLATFORMS.filter((p) => selectedPlatforms[p.id]);
  const activeWeightsSum = activePlatforms.reduce(
    (sum, p) => sum + (channels[p.id] || 10),
    0
  ) || 1;

  const budgetBreakdown = activePlatforms.map((p) => {
    const weight = channels[p.id] || 10;
    const sharePct = Math.round((weight / activeWeightsSum) * 100);
    const dailyAmt = Math.round((dailyBudget * weight) / activeWeightsSum);
    const monthlyAmt = dailyAmt * 30;
    return {
      ...p,
      sharePct,
      dailyAmt,
      monthlyAmt,
    };
  });

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setLaunchedNotice(true);
      setTimeout(() => {
        setLaunchedNotice(false);
        if (onCampaignCreated) onCampaignCreated();
      }, 2600);
    }, 1400);
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Launch Celebration Modal */}
      <AnimatePresence>
        {launchedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                🚀
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-[#111113]">Campaign Launched!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  "{campaignName}" is live and actively balancing capital across {activePlatforms.length} networks.
                </p>
              </div>

              {/* Total Daily Budget */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spend</span>
                  <div className="text-lg font-black text-[#111113]">${dailyBudget.toLocaleString()}/day</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Total</span>
                  <div className="text-sm font-extrabold text-emerald-600">${(dailyBudget * 30).toLocaleString()}/mo</div>
                </div>
              </div>

              {/* Platform Breakdown List */}
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-slate-700 block">Assigned Platform Budgets:</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {budgetBreakdown.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <PlatformLogo platform={item.id} size="xs" />
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-[10px] text-slate-400">({item.sharePct}%)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#111113]">${item.dailyAmt}/day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 mb-2">
            <Rocket className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>Autonomous Omnichannel Campaign Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111113] tracking-tight">
            Create Campaign
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deploy unified multi-channel ad campaigns with automatic budget routing and cross-network telemetry.
          </p>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                step === num
                  ? "bg-[#111113] text-white shadow-xs"
                  : step > num
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span>Step {num}</span>
              {step > num && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: CAMPAIGN OBJECTIVE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#111113]">1. Select Campaign Objective</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ADOS AI bid allocator trains algorithms specifically for your selected primary conversion metric.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OBJECTIVES.map((obj) => {
              const Icon = obj.icon;
              const isSelected = objective === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#ff4a22] bg-orange-50/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-[#ff4a22] text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {obj.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#111113]">{obj.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{obj.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
            >
              <span>Next: Campaign Parameters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SETUP & AUDIENCE */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#111113]">2. Campaign Parameters & Targeting</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define naming conventions and target audiences across connected ad accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Target Geographies (Global / Regional)
              </label>
              <input
                type="text"
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Unified Attribution Layer</span>
            </div>
            <p className="text-xs text-slate-500">
              ADOS will automatically attach cross-network tracking tokens (UTMs & server-side Click IDs) to eliminate duplicate conversions between Meta and Google Ads.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-all"
            >
              <span>Next: Multi-Channel Budget & AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BUDGET ALLOCATION & AI OPTIMIZER */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#111113]">
              3. Multi-Network Budget Allocation & Autonomous AI
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control your aggregate daily spend and allow ADOS to dynamically route capital to top performers.
            </p>
          </div>

          {/* Daily Budget Slider */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Total Daily Spend Limit
                </span>
                <p className="text-xs text-slate-400">Blended cap across all 5 active ad networks</p>
              </div>
              <div className="text-2xl font-black text-[#111113]">${dailyBudget.toLocaleString()}/day</div>
            </div>
            <input
              type="range"
              min="500"
              max="25000"
              step="250"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value))}
              className="w-full accent-[#ff4a22] cursor-pointer"
            />
          </div>

          {/* Autonomous AI Toggle */}
          <div className="p-5 bg-gradient-to-r from-orange-50/50 to-amber-50/30 rounded-2xl border border-orange-200/80 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff4a22]" />
                <span className="text-xs font-extrabold text-[#111113]">ADOS Autonomous Bid Optimizer</span>
                <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-[#ff4a22] text-white rounded-full">
                  AI Active
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                Automatically redistributes budget every 15 minutes to whichever channel generates the highest ROAS at lowest CPA.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoOptimized(!autoOptimized)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                autoOptimized ? "bg-[#ff4a22]" : "bg-slate-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoOptimized ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* ================= WHERE TO RUN ADS (TARGET PLATFORMS) ================= */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                  Select Target Ad Networks (Where to Run Ads)
                </span>
                <p className="text-xs text-slate-500">
                  Choose which ad networks to launch on. ADOS automatically synchronizes cross-channel audiences.
                </p>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    const allSelected = {};
                    CAMPAIGN_PLATFORMS.forEach((p) => { allSelected[p.id] = true; });
                    setSelectedPlatforms(allSelected);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Select All (7)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatforms({
                      meta: true,
                      google: true,
                      amazon: true,
                      youtube: false,
                      linkedin: false,
                      pinterest: false,
                      snapchat: false,
                    });
                  }}
                  className="px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-[#ff4a22] text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Top 3 ROAS
                </button>
              </div>
            </div>

            {/* Platform Selection Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {CAMPAIGN_PLATFORMS.map((plat) => {
                const isSelected = !!selectedPlatforms[plat.id];
                return (
                  <div
                    key={plat.id}
                    onClick={() => togglePlatform(plat.id)}
                    className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                      isSelected
                        ? "bg-orange-50/30 border-[#ff4a22] shadow-2xs ring-1 ring-[#ff4a22]/20"
                        : "bg-slate-50/60 border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <PlatformLogo platform={plat.id} size="sm" />
                    <span className="text-[11px] font-extrabold text-slate-800 truncate max-w-full">
                      {plat.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-[#ff4a22] text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isSelected ? "Active" : "Off"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capital Distribution Segmented Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Capital Distribution Across {activePlatforms.length} Active Networks:</span>
              <span>100% Allocated (${dailyBudget.toLocaleString()}/day)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
              {budgetBreakdown.map((item) => (
                <div
                  key={item.id}
                  style={{ width: `${item.sharePct}%`, backgroundColor: item.color }}
                  className="h-full transition-all duration-300"
                  title={`${item.name}: ${item.sharePct}% ($${item.dailyAmt}/day)`}
                />
              ))}
            </div>
          </div>

          {/* Budgets of Every Platform Cards */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Assigned Budgets of Every Platform
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {budgetBreakdown.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/90 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformLogo platform={item.id} size="sm" />
                      <div>
                        <div className="text-xs font-extrabold text-[#111113]">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Est. {item.estRoas}
                    </span>
                  </div>

                  {/* Daily & Monthly Spend */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-white rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Daily Budget
                      </span>
                      <div className="text-sm font-black text-slate-900">
                        ${item.dailyAmt.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal"> / day</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Monthly Spend
                      </span>
                      <div className="text-xs font-bold text-slate-700">
                        ${item.monthlyAmt.toLocaleString()} / mo
                      </div>
                    </div>
                  </div>

                  {/* Weight Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span>Budget Share Weight:</span>
                      <span className="text-slate-900 font-black">{item.sharePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      step="5"
                      value={channels[item.id] || 10}
                      onChange={(e) => handleChannelChange(item.id, e.target.value)}
                      className="w-full accent-[#ff4a22] cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="px-8 py-3 rounded-full bg-[#ff4a22] hover:bg-[#e03d17] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              {isLaunching ? (
                <span>Synchronizing {activePlatforms.length} Ad Networks...</span>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>
                    🚀 Launch Campaign Across {activePlatforms.length} Networks (${dailyBudget.toLocaleString()}/day)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
