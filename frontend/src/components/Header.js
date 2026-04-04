"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
      </div>
    </nav>
  );
}
