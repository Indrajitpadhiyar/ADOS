import React from "react";

// Actual platform logo image files from src/assets/platform_logo
import metaLogo from "../../assets/platform_logo/meta.png";
import googleLogo from "../../assets/platform_logo/google.png";
import amazonLogo from "../../assets/platform_logo/amezon.png";
import youtubeLogo from "../../assets/platform_logo/youtube.png";
import linkedinLogo from "../../assets/platform_logo/linkedin.png";
import pinterestLogo from "../../assets/platform_logo/pintrest.png";
import snapLogo from "../../assets/platform_logo/snap.png";
import xLogo from "../../assets/platform_logo/x.png";

export const PLATFORM_LOGOS = {
  meta: metaLogo,
  facebook: metaLogo,
  instagram: metaLogo,
  google: googleLogo,
  gads: googleLogo,
  mcc: googleLogo,
  amazon: amazonLogo,
  amzn: amazonLogo,
  youtube: youtubeLogo,
  yt: youtubeLogo,
  dv360: youtubeLogo,
  linkedin: linkedinLogo,
  pinterest: pinterestLogo,
  pin: pinterestLogo,
  snapchat: snapLogo,
  snap: snapLogo,
  x: xLogo,
  x_ads: xLogo,
  twitter: xLogo,
};

export function getPlatformLogoUrl(platform = "") {
  const norm = (platform || "").toLowerCase();
  for (const [key, url] of Object.entries(PLATFORM_LOGOS)) {
    if (norm.includes(key)) return url;
  }
  return metaLogo;
}

const SIZE_MAP = {
  xs: {
    container: "w-5 h-5 rounded-md",
    img: "rounded-[3px]",
  },
  sm: {
    container: "w-7 h-7 rounded-xl",
    img: "rounded-lg",
  },
  md: {
    container: "w-10 h-10 rounded-2xl",
    img: "rounded-xl",
  },
  lg: {
    container: "w-14 h-14 rounded-3xl",
    img: "rounded-2xl",
  },
  xl: {
    container: "w-16 h-16 rounded-3xl",
    img: "rounded-2xl",
  },
};

/**
 * PlatformLogo component:
 * Renders the actual logos from src/assets/platform_logo
 * (Meta, Google, Amazon, YouTube, LinkedIn, Pinterest, Snapchat, X)
 */
export default function PlatformLogo({
  platform = "meta",
  size = "md",
  className = "",
  showBadge = true,
}) {
  const normPlatform = (platform || "").toLowerCase();
  const currentSize = SIZE_MAP[size] || SIZE_MAP.md;

  let logoSrc = metaLogo;
  let title = "Ad Platform";

  if (normPlatform.includes("meta") || normPlatform.includes("facebook") || normPlatform.includes("instagram")) {
    logoSrc = metaLogo;
    title = "Meta Ads";
  } else if (normPlatform.includes("google") || normPlatform.includes("gads") || normPlatform.includes("mcc")) {
    logoSrc = googleLogo;
    title = "Google Ads";
  } else if (normPlatform.includes("amazon") || normPlatform.includes("amzn")) {
    logoSrc = amazonLogo;
    title = "Amazon Ads";
  } else if (normPlatform.includes("youtube") || normPlatform.includes("yt") || normPlatform.includes("dv360")) {
    logoSrc = youtubeLogo;
    title = "YouTube Ads";
  } else if (normPlatform.includes("linkedin")) {
    logoSrc = linkedinLogo;
    title = "LinkedIn Ads";
  } else if (normPlatform.includes("pinterest") || normPlatform.includes("pin")) {
    logoSrc = pinterestLogo;
    title = "Pinterest Ads";
  } else if (normPlatform.includes("snapchat") || normPlatform.includes("snap")) {
    logoSrc = snapLogo;
    title = "Snapchat Ads";
  } else if (normPlatform.includes("x_ads") || normPlatform === "x" || normPlatform.includes("twitter")) {
    logoSrc = xLogo;
    title = "X Ads";
  } else {
    logoSrc = metaLogo;
    title = platform || "Ad Platform";
  }

  return (
    <div
      className={`${currentSize.container} flex items-center justify-center bg-white border border-slate-200/90 shadow-2xs p-0.5 shrink-0 overflow-hidden ${className}`}
      title={title}
    >
      <img
        src={logoSrc}
        alt={title}
        className={`w-full h-full object-contain ${currentSize.img}`}
        loading="lazy"
      />
    </div>
  );
}
