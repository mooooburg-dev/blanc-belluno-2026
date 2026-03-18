"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "홈", href: "#home" },
  { label: "서비스", href: "#services" },
  { label: "포트폴리오", href: "#gallery" },
  { label: "인스타그램", href: "#instagram" },
  { label: "문의", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-18 md:h-20">
        {/* Logo */}
        <Link
          href="#home"
          onClick={() => handleNavClick("#home")}
          className="flex flex-col items-start leading-none group"
        >
          <span
            className="font-display text-2xl md:text-3xl font-light tracking-[0.2em] text-[#4A2D3E] group-hover:text-[#D4899A] transition-colors"
          >
            BLANC
          </span>
          <span
            className="font-display text-xs tracking-[0.35em] text-[#C9A96E] font-light mt-[-2px]"
          >
            BELLUNO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-body text-sm tracking-widest text-[#7A5466] hover:text-[#D4899A] transition-colors duration-200 cursor-pointer uppercase"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="btn-primary text-sm px-5 py-2.5"
          >
            상담 신청
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span
            className={`block w-6 h-0.5 bg-[#7A5466] transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#7A5466] transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#7A5466] transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white/98 backdrop-blur-md border-t border-[#EDD5E1] px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-body text-sm tracking-widest text-[#7A5466] hover:text-[#D4899A] transition-colors py-3 text-left uppercase border-b border-[#F8E8EE] last:border-0"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="btn-primary mt-2 text-sm w-full"
          >
            상담 신청
          </button>
        </nav>
      </div>
    </header>
  );
}
