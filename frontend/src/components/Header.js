"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState("default");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

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
      <div className="navbar-brand">
        <Link href="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">📰</span>
          <span className="logo-text">Samachar <span className="logo-accent">Gujrati</span></span>
        </Link>
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
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link href="/" onClick={closeMenu}>Home</Link>
        <Link href="/category/national" onClick={closeMenu}>National</Link>
        <Link href="/category/international" onClick={closeMenu}>International</Link>
        <Link href="/category/gujarat" onClick={closeMenu}>Gujarat</Link>
        <Link href="/category/sports" onClick={closeMenu}>Sports</Link>
        <Link href="/category/business" onClick={closeMenu}>Business</Link>
        <Link href="/category/entertainment" onClick={closeMenu}>Entertainment</Link>
        <Link href="/category/lifestyle" onClick={closeMenu}>Lifestyle</Link>
        <Link href="/category/dharm-darshan" onClick={closeMenu}>Dharm</Link>
        <Link href="/category/utility" onClick={closeMenu}>Utility</Link>
        <Link href="/category/magazine" onClick={closeMenu}>Magazine</Link>
        <Link href="/category/live-news" className="nav-live" onClick={closeMenu}>Live News</Link>
        
        {/* Notification Bell Button */}
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
