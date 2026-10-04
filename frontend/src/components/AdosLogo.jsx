import React from 'react';

/**
 * AdosLogo Component
 * Premium, futuristic brand mark for ADOS (Adaptive Digital Operating System)
 * Features an interlocking geometric 'A' emblem with high-precision lines.
 */
export default function AdosLogo({ className = "w-20 h-20 text-white" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="adosGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#c3dcf2" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="adosAccent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Structure */}
      <polygon 
        points="50,6 88,28 88,72 50,94 12,72 12,28" 
        stroke="url(#adosGlow)" 
        strokeWidth="2.5" 
        fill="rgba(255, 255, 255, 0.04)"
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Modern Stylized 'A' Core */}
      <path 
        d="M50 20 L28 68 L40 68 L45 56 L55 56 L60 68 L72 68 Z" 
        fill="url(#adosGlow)"
        fillRule="evenodd"
      />

      {/* Inner Dynamic Horizontal Core Beam */}
      <path 
        d="M47 48 L53 48 L50 40 Z" 
        fill="#294668" 
      />

      {/* Orbital Pulse Nodes */}
      <circle cx="50" cy="6" r="3" fill="#ffffff" />
      <circle cx="88" cy="28" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="88" cy="72" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="50" cy="94" r="3" fill="#ffffff" />
      <circle cx="12" cy="72" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="12" cy="28" r="2" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}
