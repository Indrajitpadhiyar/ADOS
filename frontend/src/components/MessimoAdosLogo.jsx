import React from 'react';

/**
 * MessimoAdosLogo Component
 * Recreates the exact brand emblem from the reference:
 * A friendly lime-green badge/chat bubble with modern typography.
 */
export default function MessimoAdosLogo({ brandName = "ados", className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Lime Green Chat Bubble Emblem with Plus / Cross Cutout */}
      <div className="relative w-7 h-7 rounded-lg bg-[#9ed84f] flex items-center justify-center shadow-sm">
        {/* Chat tail notch */}
        <div className="absolute -bottom-1 left-1.5 w-2 h-2 bg-[#9ed84f] rotate-45" />
        {/* Inner white cross */}
        <svg 
          viewBox="0 0 16 16" 
          fill="none" 
          className="w-3.5 h-3.5 text-white z-10"
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        >
          <line x1="8" y1="3" x2="8" y2="13" />
          <line x1="3" y1="8" x2="13" y2="8" />
        </svg>
      </div>

      {/* Brand Text */}
      <span className="text-2xl font-bold tracking-tight text-[#1f2d24] font-['Outfit','Poppins',sans-serif]">
        {brandName}
      </span>
    </div>
  );
}
