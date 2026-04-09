"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "sg_cookie_consent_v2";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (stored) {
        const { timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp < ONE_YEAR_MS) {
          return; // Already accepted within 1 year
        }
      }
    } catch (e) {
      // corrupted localStorage, show banner
    }
    // Show popup after a slight delay for UX
    const timer = setTimeout(() => {
      setVisible(true);
      // Trigger animation after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({ accepted: true, timestamp: Date.now() })
    );
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <>
      {/* Full-screen overlay — blocks ALL interaction */}
      <div
        className={`cookie-overlay ${animateIn ? "cookie-overlay--active" : ""}`}
        aria-hidden="true"
      />
      {/* Cookie Banner */}
      <div
        className={`cookie-banner ${animateIn ? "cookie-banner--active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie Consent"
      >
        <div className="cookie-banner__inner">
          {/* Shield icon */}
          <div className="cookie-banner__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z" fill="url(#shield-grad)" opacity="0.15"/>
              <path d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z" stroke="url(#shield-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M9 12L11 14L15 10" stroke="url(#shield-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="shield-grad" x1="3" y1="2" x2="21" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D32F2F"/>
                  <stop offset="1" stopColor="#FF6659"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Text content */}
          <div className="cookie-banner__content">
            <h4 className="cookie-banner__title">🍪 We Use Cookies</h4>
            <p className="cookie-banner__desc">
              This website uses cookies to enhance your browsing experience,
              serve personalized ads via Google AdSense, and analyze site traffic.
              By accepting, you agree to our use of cookies for <strong>1 year</strong>.
              Read our{" "}
              <Link href="/privacy-policy" className="cookie-banner__link">
                Privacy Policy
              </Link>{" "}
              for more details.
            </p>
          </div>

          {/* Accept button — ONLY option (compulsory) */}
          <button
            className="cookie-banner__accept"
            onClick={handleAccept}
            id="cookie-accept-btn"
          >
            <span className="cookie-banner__accept-icon">✓</span>
            Accept All Cookies
          </button>
        </div>

        {/* Bottom note */}
        <p className="cookie-banner__note">
          You must accept cookies to continue using this website.
        </p>
      </div>
    </>
  );
}
