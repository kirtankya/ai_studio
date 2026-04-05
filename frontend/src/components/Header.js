"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
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
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">📰</span> Samachar Gujrati
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
        <Link href="/category/live-news" className="nav-live" onClick={closeMenu}>Live News</Link>
        
        {/* Notification Bell Button */}
        {permission !== "granted" && (
          <button 
            onClick={requestNotificationPermission}
            title="Enable Notifications"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "0.2rem 0.5rem",
              marginLeft: "0.5rem"
            }}
          >
            🔔
          </button>
        )}
      </div>
    </nav>
  );
}
