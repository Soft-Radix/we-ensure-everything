"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Coverage Types", href: "/#categories" },
    // { label: "Find an Agent", href: "/find-agent" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex flex-col no-underline group">
          <Image
            src="/icons/header.png"
            alt="Logo"
            width={160}
            height={160}
            priority
          />
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] -mt-1 ml-0.5">
            A Nationwide Insurance Marketplace
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-brand-navy font-semibold text-sm transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/find-agent"
            className="bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded-full no-underline transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg border border-white/10"
          >
            Find an Agent
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-brand-navy rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-brand-navy rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-brand-navy rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-slate-600 hover:text-brand-navy font-medium text-base no-underline py-2 border-b border-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/find-agent"
            onClick={() => setMenuOpen(false)}
            className="bg-brand-navy text-white font-bold text-sm px-5 py-3 rounded-full no-underline text-center mt-2"
          >
            Find an Agent
          </Link>
        </div>
      )}
    </header>
  );
}
