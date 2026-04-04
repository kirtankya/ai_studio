"use client";

import { useEffect, useRef } from "react";

export default function AdsenseBanner({ adSlot, adFormat = "auto", fullWidthResponsive = "true", adStyle = { display: "block" } }) {
  const adRef = useRef(null);

  useEffect(() => {
    // Prevent duplicate ad pushes in strict mode / re-renders
    if (adRef.current && adRef.current.children.length === 0) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("Adsense Error:", err);
      }
    }
  }, []);

  return (
    <div className="ad-banner-container">
      <div className="ad-label">Advertisement</div>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={adStyle}
          data-ad-client="ca-pub-2422158282423035"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive}
        ></ins>
      </div>
    </div>
  );
}
