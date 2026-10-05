import React, { useEffect, useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/sections/HeroSection";
import OmnichannelShowcaseSection from "../../components/sections/OmnichannelShowcaseSection";
import StrategicBentoSection from "../../components/sections/StrategicBentoSection";
import DeviceShowcaseSection from "../../components/sections/DeviceShowcaseSection";
import MaximizeEfficiencySection from "../../components/sections/MaximizeEfficiencySection";
import AboutSection from "../../components/sections/AboutSection";
import ContactModal from "../../components/common/ContactModal";

export default function Home({ onOpenAuth }) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Initialize smooth scrolling with Locomotive Scroll (Lenis v5)
  useEffect(() => {
    let locomotiveScroll;
    try {
      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          wrapper: window,
          content: document.documentElement,
          lerp: 0.08,
          duration: 1.2,
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1.0,
        },
      });

      // Synchronize ScrollTrigger
      ScrollTrigger.refresh();
    } catch (e) {
      console.warn("LocomotiveScroll fallback:", e);
    }

    return () => {
      if (locomotiveScroll && typeof locomotiveScroll.destroy === "function") {
        locomotiveScroll.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#fafbfc] text-[#121214] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-slate-900 selection:text-white overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAuth={onOpenAuth}
      />

      {/* Page 1: Hero Section */}
      <HeroSection onOpenContact={() => setIsContactOpen(true)} />

      {/* Page 2: Omnichannel Showcase (Letter-by-Letter Reveal & Centered Badges) */}
      <OmnichannelShowcaseSection />

      {/* Page 3: Strategic Bento Section (Exact Ditto Copy of Reference) */}
      <StrategicBentoSection />

      {/* Page 4: Device Showcase & Giant ADOS */}
      <DeviceShowcaseSection onOpenContact={() => setIsContactOpen(true)} />

      {/* Page 5: Maximize Efficiency */}
      <MaximizeEfficiencySection
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAuth={onOpenAuth}
      />

      {/* About & Interactive Simulator */}
      <AboutSection onOpenContact={() => setIsContactOpen(true)} />

      {/* Footer */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />

      {/* Contact & Demo Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
