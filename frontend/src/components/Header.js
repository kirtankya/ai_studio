"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Define navigation links centrally for easy management and cleaner JSX
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category/national", label: "National" },
  { href: "/category/international", label: "International" },
  { href: "/category/gujarat", label: "Gujarat" },
  { href: "/category/sports", label: "Sports" },
  { href: "/category/business", label: "Business" },
  { href: "/category/entertainment", label: "Entertainment" },
  { href: "/category/lifestyle", label: "Lifestyle" },
  { href: "/category/dharm-darshan", label: "Dharm" },
  { href: "/category/utility", label: "Utility" },
  { href: "/category/magazine", label: "Magazine" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState("default");
  const [scrolled, setScrolled] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // 1. Check and set initial notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    // 2. Set current formatted date
    const formattedDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);

    // 3. Handle scroll events to styling the navbar on scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // UI Handlers
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }
    
    const perm = await Notification.requestPermission();
    setPermission(perm);
    
    if (perm === "granted") {
      new Notification("Notifications Enabled!", {
        body: "You will now receive automatic updates for the latest news.",
        icon: "/favicon.ico",
      });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* Brand / Logo Section */}
      <div className="navbar-brand">
        <Link href="/" className="logo" onClick={closeMenu}>
          <span className="logo-text">Samachar <span className="logo-accent">Gujrati</span></span>
          <span className="logo-dot" aria-hidden="true"></span>
        </Link>
        
        {currentDate && <span className="nav-date">{currentDate}</span>}
        
        {/* Mobile Menu Toggle Button */}
        <button
          className={`menu-toggle ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Navigation Links Section */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        {/* Map over dynamic navigation links */}
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} onClick={closeMenu}>
            {label}
          </Link>
        ))}
        
        {/* Static live news link (usually styled differently) */}
        <Link href="/category/live-news" className="nav-live" onClick={closeMenu}>
          Live News
        </Link>

        {/* Notification Bell Action Button */}
        {permission !== "granted" && (
          <button
            onClick={requestNotificationPermission}
            title="Enable Notifications"
            className="nav-bell"
            aria-label="Enable Notifications"
          >
            🔔
          </button>
        )}
      </div>
    </nav>
  );
}
