import React from "react";

export default function Footer({ onOpenContact }) {
  return (
    <footer className="w-full bg-[#111113] text-white py-16 border-t border-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src="/ados2.png" alt="ADOS" className="h-9 w-auto brightness-200" />
          <span className="font-extrabold text-xl tracking-tight text-white">ADOS</span>
          <span className="text-xs text-slate-400 ml-2">
            Adaptive Digital Operating System for Omnichannel Advertising
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
          <a href="#product" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#platforms" className="hover:text-white transition-colors">
            Supported Networks
          </a>
          <button
            onClick={onOpenContact}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact Sales
          </button>
          <span className="text-xs text-slate-500">© 2026 ADOS Inc.</span>
        </div>
      </div>
    </footer>
  );
}
