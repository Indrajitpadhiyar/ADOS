import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Play,
  Volume2,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export default function AboutSection({ onOpenContact }) {
  const [activePlatform, setActivePlatform] = useState("meta");

  const [campaignData, setCampaignData] = useState({
    headline: "Transform Your Reach With Next-Gen AI",
    tagline:
      "One ad creative automatically optimized and distributed across all tier-1 ad platforms.",
    cta: "Start Free Trial",
    brandName: "ADOS AI",
  });

  const platforms = [
    {
      id: "meta",
      name: "Meta",
      sub: "Facebook & Instagram",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      ),
    },
    {
      id: "google",
      name: "Google Ads",
      sub: "Search, PMax & Display",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      ),
    },
    {
      id: "youtube",
      name: "YouTube",
      sub: "In-Stream & Shorts",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: "tiktok",
      name: "TikTok Ads",
      sub: "In-Feed & Spark Ads",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      sub: "B2B Sponsored Content",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-white border-t border-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            About ADOS &amp; The Omnichannel Cockpit
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111113]">
            One Ad Creative. Every Platform. Zero Friction.
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Stop juggling 5 different ad managers. Input your campaign objective once and ADOS generates,
            aspect-ratio adapts, and distributes high-converting variations across Meta, Google, YouTube, and TikTok.
          </p>
        </div>

        {/* Interactive Workspace Grid */}
        <div id="interactive-demo" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Campaign Input Editor */}
          <div className="lg:col-span-5 bg-[#fafbfc] p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Campaign Blueprint</h3>
                  <p className="text-xs text-slate-500">Universal creative source data</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Ready to Sync
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Brand / Product Name
                </label>
                <input
                  type="text"
                  value={campaignData.brandName}
                  onChange={(e) => setCampaignData({ ...campaignData, brandName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Ad Headline
                </label>
                <input
                  type="text"
                  value={campaignData.headline}
                  onChange={(e) => setCampaignData({ ...campaignData, headline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Body Copy / Value Proposition
                </label>
                <textarea
                  rows={3}
                  value={campaignData.tagline}
                  onChange={(e) => setCampaignData({ ...campaignData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Call To Action
                  </label>
                  <select
                    value={campaignData.cta}
                    onChange={(e) => setCampaignData({ ...campaignData, cta: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option>Start Free Trial</option>
                    <option>Shop Now</option>
                    <option>Book Demo</option>
                    <option>Claim 30% Off</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Target Audience
                  </label>
                  <div className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>E-comm & SaaS</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">AI Tuned</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenContact}
                className="w-full mt-4 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm tracking-wide hover:bg-black transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Deploy Campaign Everywhere
              </button>
            </div>
          </div>

          {/* Right Column: Live Multi-Platform Real-Time Previews */}
          <div className="lg:col-span-7 bg-[#fafbfc] p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col">
            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200">
              {platforms.map((p) => {
                const isActive = activePlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePlatform(p.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-black text-white shadow-sm"
                        : "bg-white text-slate-700 hover:text-black border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Platform Card Mockups */}
            <div className="relative min-h-[360px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {/* META / INSTAGRAM PREVIEW */}
                {activePlatform === "meta" && (
                  <motion.div
                    key="meta"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-4"
                  >
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center">
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xs font-extrabold text-black">
                            A
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-tight">
                            {campaignData.brandName.toLowerCase().replace(/\s+/g, "_")}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            Sponsored · Meta Ads Engine
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-black">•••</button>
                    </div>

                    <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white p-6 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />
                      <span className="text-[11px] font-bold tracking-widest text-sky-400 uppercase">
                        ADOS AUTOPILOT
                      </span>
                      <div>
                        <h4 className="text-xl font-bold leading-tight mb-2">
                          {campaignData.headline}
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {campaignData.tagline}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[11px] font-medium text-slate-400">ados.io/boost</span>
                        <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          {campaignData.cta}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 text-slate-700">
                      <div className="flex items-center gap-4">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
                        <MessageCircle className="w-5 h-5 cursor-pointer" />
                        <Share2 className="w-5 h-5 cursor-pointer" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">4,892 Likes</span>
                    </div>
                  </motion.div>
                )}

                {/* GOOGLE PREVIEW */}
                {activePlatform === "google" && (
                  <motion.div
                    key="google"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-md p-5 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                        Sponsored
                      </span>
                      <span className="text-xs text-slate-600">https://www.ados.io/ads</span>
                    </div>
                    <h4 className="text-lg font-semibold text-blue-800 hover:underline cursor-pointer leading-snug">
                      {campaignData.headline} | Official {campaignData.brandName}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {campaignData.tagline} Launch unified ad campaigns across Meta, Google, and YouTube with
                      machine-learning predictive bidding.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 hover:bg-slate-100 cursor-pointer">
                        <div className="text-xs font-bold text-blue-700">{campaignData.cta}</div>
                        <div className="text-[11px] text-slate-500">Instant 14-day access</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 hover:bg-slate-100 cursor-pointer">
                        <div className="text-xs font-bold text-blue-700">Omnichannel ROI Tool</div>
                        <div className="text-[11px] text-slate-500">Calculate revenue impact</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* YOUTUBE PREVIEW */}
                {activePlatform === "youtube" && (
                  <motion.div
                    key="youtube"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-lg bg-black text-white rounded-2xl overflow-hidden shadow-xl"
                  >
                    <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded">
                          Ad · 0:15
                        </span>
                        <span className="text-xs bg-black/60 backdrop-blur px-2.5 py-1 rounded text-slate-300">
                          Skip in 5s
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-t from-black/90 to-transparent p-3 -m-5 mt-0 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-white leading-tight">
                            {campaignData.headline}
                          </div>
                          <div className="text-[11px] text-slate-300">{campaignData.brandName}</div>
                        </div>
                        <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer">
                          {campaignData.cta}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TIKTOK PREVIEW */}
                {activePlatform === "tiktok" && (
                  <motion.div
                    key="tiktok"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-xs bg-slate-950 text-white rounded-3xl p-4 shadow-xl border border-slate-800"
                  >
                    <div className="relative aspect-[9/14] rounded-2xl bg-gradient-to-b from-indigo-900/60 to-black p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs font-bold text-white/80">
                        <span>Sponsored</span>
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-bold">@{campaignData.brandName.toLowerCase()}</div>
                          <p className="text-xs text-slate-200 mt-1 line-clamp-3">
                            {campaignData.tagline} #advertising #ai #growth
                          </p>
                        </div>
                        <button className="w-full py-2 bg-gradient-to-r from-[#ff0050] to-[#00f2fe] text-black font-extrabold text-xs rounded-xl cursor-pointer">
                          {campaignData.cta}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* LINKEDIN PREVIEW */}
                {activePlatform === "linkedin" && (
                  <motion.div
                    key="linkedin"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-md p-4 text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-extrabold text-base">
                        in
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{campaignData.brandName} Enterprise</div>
                        <div className="text-[10px] text-slate-500">Promoted · Global B2B Reach</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mb-3">{campaignData.tagline}</p>
                    <div className="w-full aspect-[16/9] rounded-xl bg-slate-900 text-white p-4 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-blue-400">HIGH-CONVERTING PIPELINE</span>
                      <h4 className="text-sm font-bold">{campaignData.headline}</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">ados.io/b2b</span>
                        <span className="bg-blue-600 px-3 py-1 rounded text-white font-bold cursor-pointer">
                          {campaignData.cta}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
