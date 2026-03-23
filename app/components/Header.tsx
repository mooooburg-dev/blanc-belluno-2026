"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import StoryViewer from "./StoryViewer";

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  timestamp: string;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#gallery" },
  { label: "Instagram", href: "#instagram" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [storyOpen, setStoryOpen] = useState(false);
  const [hasStories, setHasStories] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // 스토리 데이터 로드
  useEffect(() => {
    fetch("/api/instagram/stories")
      .then((res) => res.json())
      .then((data) => {
        if (data.stories && data.stories.length > 0) {
          setStories(data.stories);
          setHasStories(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (hasStories) {
      e.preventDefault();
      setStoryOpen(true);
    } else {
      handleNavClick("#home");
    }
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-blanc-champagne/40 shadow-sm py-2.5"
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo with Story Ring */}
        <div className="flex items-center group">
          <button
            onClick={handleLogoClick}
            className={`relative cursor-pointer rounded-full ${hasStories ? "story-ring" : ""}`}
            aria-label={hasStories ? "스토리 보기" : "홈으로 이동"}
          >
            <Image
              src="/blanc_belluno_logo.jpg"
              alt="Blanc Belluno"
              width={44}
              height={44}
              className="rounded-full md:w-11 md:h-11 w-9 h-9 relative z-1"
            />
          </button>
          <Link
            href="#home"
            onClick={() => handleNavClick("#home")}
            className="flex flex-col items-center justify-center ml-2.5"
          >
            <span className="font-display text-lg md:text-xl font-light tracking-[0.15em] text-blanc-text-primary group-hover:text-blanc-text-secondary transition-colors leading-none">
              BLANC
            </span>
            <span className="font-display text-[7px] md:text-[8px] tracking-[0.4em] text-blanc-gold font-light mt-0.5">
              BELLUNO
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-body text-[11px] tracking-[0.12em] text-blanc-text-secondary hover:text-blanc-text-primary transition-colors cursor-pointer uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-blanc-gold after:origin-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="font-body text-[11px] tracking-[0.12em] text-white bg-blanc-text-primary hover:bg-black px-5 py-2 transition-colors uppercase"
          >
            Inquire
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span
            className={`block absolute w-5 h-px bg-blanc-text-primary transition-transform duration-300 ease-in-out ${
              menuOpen ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`block absolute w-5 h-px bg-blanc-text-primary transition-opacity duration-300 ease-in-out ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block absolute w-5 h-px bg-blanc-text-primary transition-transform duration-300 ease-in-out ${
              menuOpen ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-0 bg-white/98 backdrop-blur-xl transition-all duration-400 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-body text-sm tracking-[0.2em] text-blanc-text-secondary hover:text-blanc-text-primary transition-colors uppercase"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="mt-4 font-body text-xs tracking-[0.15em] text-white bg-blanc-text-primary px-8 py-3 uppercase"
          >
            Inquire
          </button>
        </nav>
      </div>
    </header>

    <StoryViewer
      isOpen={storyOpen}
      onClose={() => setStoryOpen(false)}
      stories={stories}
    />
    </>
  );
}
