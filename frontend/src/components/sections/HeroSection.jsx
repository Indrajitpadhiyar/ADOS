import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

export default function HeroSection({ onOpenContact }) {
  const heroRef = useRef(null);
  const auroraLeftRef = useRef(null);
  const auroraRightRef = useRef(null);
  const auroraCenterRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);

  // Smooth & gentle ambient floating animation for the bottom aurora mesh
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(auroraLeftRef.current, {
        x: "+=35",
        y: "-=25",
        scale: 1.1,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(auroraRightRef.current, {
        x: "-=40",
        y: "+=30",
        scale: 1.12,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(auroraCenterRef.current, {
        y: "-=20",
        scale: 1.08,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Background Ambient Aurora Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Warm Amber / Tangerine Glow on the Bottom-Left */}
        <div
          ref={auroraLeftRef}
          className="absolute -bottom-24 -left-20 w-[420px] sm:w-[600px] md:w-[780px] h-[380px] sm:h-[500px] md:h-[620px] rounded-full bg-gradient-to-tr from-[#fbbf24] via-[#f97316] to-[#fb7185] opacity-40 sm:opacity-55 filter blur-[90px] sm:blur-[130px] mix-blend-multiply will-change-transform"
        />

        {/* Soft Rose / Peach Transition in the Center */}
        <div
          ref={auroraCenterRef}
          className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[380px] sm:w-[560px] md:w-[720px] h-[340px] sm:h-[460px] md:h-[560px] rounded-full bg-gradient-to-t from-[#f43f5e] via-[#fb7185] to-[#fbcfe8] opacity-30 sm:opacity-45 filter blur-[95px] sm:blur-[135px] mix-blend-multiply will-change-transform"
        />

        {/* Electric Sky Blue / Vivid Cyan Glow on the Bottom-Right */}
        <div
          ref={auroraRightRef}
          className="absolute -bottom-20 -right-20 w-[420px] sm:w-[620px] md:w-[820px] h-[380px] sm:h-[520px] md:h-[640px] rounded-full bg-gradient-to-tl from-[#06b6d4] via-[#38bdf8] to-[#60a5fa] opacity-40 sm:opacity-55 filter blur-[90px] sm:blur-[130px] mix-blend-multiply will-change-transform"
        />

        {/* Subtle Canvas Dot Grid for depth */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Center Main Text Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 text-center flex flex-col items-center my-auto">
        {/* Eyebrow / Subtitle above mega title */}
        <motion.p
          ref={subtitleRef}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-xl md:text-2xl font-normal text-slate-800 tracking-tight mb-2 sm:mb-3"
        >
          Improve your
        </motion.p>

        {/* Mega Display Headline: "Advertising with AI" */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.25rem] font-bold text-[#111113] tracking-[-0.04em] leading-[1.02] sm:leading-[1] select-none">
            Advertising
          </h1>
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] mt-1 sm:mt-2">
            with AI
          </span>
        </motion.div>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 sm:mt-8 max-w-xl sm:max-w-2xl text-sm sm:text-base md:text-[17px] text-slate-700 leading-relaxed font-normal"
        >
          Tailored digital solutions for high-growth modern brands. Create one ad
          creative and seamlessly launch, optimize, and scale campaigns across Meta,
          Google, YouTube, and TikTok simultaneously.
        </motion.p>

        {/* Center Dark Pill Button: "Contact" / "Launch Campaign" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 sm:mt-9 flex items-center gap-3.5"
        >
          <button
            onClick={onOpenContact}
            className="group relative px-9 py-3 sm:py-3.5 rounded-full bg-[#111113] text-white text-sm sm:text-[15px] font-semibold tracking-wide shadow-md hover:bg-black hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>Contact</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>

          <a
            href="#interactive-demo"
            className="px-6 py-3 sm:py-3.5 rounded-full bg-white/80 hover:bg-white text-slate-800 text-sm sm:text-[15px] font-semibold border border-slate-200/90 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
          >
            <span>Try Simulator</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom Platform Logos Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-12 sm:mt-16"
      >
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 pt-6 border-t border-slate-900/[0.06]">
          {/* Meta */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black opacity-80 hover:opacity-100 transition-all duration-200 group cursor-pointer">
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Meta Ads</span>
          </div>

          {/* Google */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black opacity-80 hover:opacity-100 transition-all duration-200 group cursor-pointer">
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Google Ads</span>
          </div>

          {/* YouTube */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black opacity-80 hover:opacity-100 transition-all duration-200 group cursor-pointer">
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">YouTube</span>
          </div>

          {/* TikTok */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black opacity-80 hover:opacity-100 transition-all duration-200 group cursor-pointer">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">TikTok Ads</span>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black opacity-80 hover:opacity-100 transition-all duration-200 group cursor-pointer">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">LinkedIn</span>
          </div>
        </div>
      </motion.div>

      {/* ================= REFINED SLIM BOTTOM BLUR FADE (DECREASED HEIGHT) ================= */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-10 sm:h-14 z-20 overflow-hidden">
        {/* Delicate Progressive Blur */}
        <div className="w-full h-full backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        {/* Delicate Gradient Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafbfc] to-transparent" />
      </div>
    </section>
  );
}
