import React, { useState, useEffect } from 'react';

/**
 * Minimalist wall clock matching the reference image.
 */
export default function ClockWidget({ className = "w-12 h-12" }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate angles
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;

  return (
    <div className={`relative rounded-full bg-white border-[2.5px] border-[#1f2d24] shadow-sm flex items-center justify-center ${className}`}>
      {/* Center Pivot */}
      <div className="w-1.5 h-1.5 rounded-full bg-[#1f2d24] z-20" />

      {/* Hour Hand */}
      <div 
        className="absolute w-[2px] h-[30%] bg-[#1f2d24] rounded-full origin-bottom z-10"
        style={{ 
          bottom: '50%',
          transform: `rotate(${hourAngle}deg)`,
          transformOrigin: 'bottom center'
        }}
      />

      {/* Minute Hand */}
      <div 
        className="absolute w-[1.5px] h-[38%] bg-[#1f2d24] rounded-full origin-bottom z-10"
        style={{ 
          bottom: '50%',
          transform: `rotate(${minuteAngle}deg)`,
          transformOrigin: 'bottom center'
        }}
      />
    </div>
  );
}
