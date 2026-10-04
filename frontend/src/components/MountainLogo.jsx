import React from 'react';

/**
 * MountainLogo Component
 * Recreates the exact stylized mountain peaks and road icon from the reference design.
 */
export default function MountainLogo({ className = "w-24 h-24 text-white" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 90" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Mountain Ridges */}
      <path d="M12 75 C 18 68, 25 45, 36 32 C 42 25, 48 30, 52 38 C 58 20, 68 8, 76 10 C 84 12, 88 26, 92 36 C 98 32, 102 42, 108 75" />
      
      {/* Alpine Switchback Roads / Inner Paths */}
      <path d="M26 75 L 34 42" strokeDasharray="1 0" />
      <path d="M42 75 L 48 46" />
      <path d="M58 75 L 64 26" />
      <path d="M72 75 L 75 22" />
      <path d="M84 75 L 82 46" />
      <path d="M96 75 L 90 42" />
      
      {/* Road / Horizontal Plateau Strata */}
      <path d="M20 72 Q 60 76 100 72" strokeWidth="2" />
      <path d="M30 52 Q 60 55 90 52" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
    </svg>
  );
}
