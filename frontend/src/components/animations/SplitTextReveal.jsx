import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * React Bits inspired SplitText & Scroll Reveal Component
 * Uses GSAP ScrollTrigger for buttery 60fps scroll-linked character/word staggering.
 */
export default function SplitTextReveal({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.04,
  duration = 0.8,
  triggerHook = "top 85%",
  scrub = false,
  as: Component = "h2",
  children,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".split-word");
    if (!words.length) return;

    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 40,
          rotateX: -20,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: scrub
            ? {
                trigger: el,
                start: triggerHook,
                end: "bottom 60%",
                scrub: 1,
              }
            : {
                trigger: el,
                start: triggerHook,
                toggleActions: "play none none reverse",
              },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, delay, stagger, duration, triggerHook, scrub]);

  // If text string is passed, split into words
  if (text) {
    const words = text.split(" ");
    return (
      <Component ref={containerRef} className={`perspective-1000 ${className}`}>
        {words.map((word, i) => (
          <span
            key={i}
            className={`split-word inline-block mr-[0.28em] will-change-transform ${wordClassName}`}
          >
            {word}
          </span>
        ))}
      </Component>
    );
  }

  // If custom children are provided
  return (
    <Component ref={containerRef} className={`perspective-1000 ${className}`}>
      {children}
    </Component>
  );
}
