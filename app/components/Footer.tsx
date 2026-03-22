"use client";

import Link from "next/link";
import Image from "next/image";

interface SiteSettings {
  instagram: string;
  kakaoChannel: string;
  naverBlog: string;
  naverSmartStore: string;
  phone: string;
  email: string;
  businessHours: string;
  brandDescription: string;
}

export default function Footer({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-blanc-text-primary text-blanc-champagne">
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-14">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <Link href="#home" className="inline-flex items-center gap-3 mb-5 group">
              <Image
                src="/blanc_belluno_logo.jpg"
                alt="Blanc Belluno"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-display text-2xl font-light tracking-[0.25em] text-white leading-none group-hover:text-blanc-champagne transition-colors">
                  BLANC
                </p>
                <p className="font-display text-[9px] tracking-[0.4em] text-blanc-gold mt-1 pl-0.5">
                  BELLUNO
                </p>
              </div>
            </Link>
            <p className="font-body text-sm font-light leading-loose text-blanc-champagne/60 mb-6 max-w-xs whitespace-pre-line">
              {settings.brandDescription}
            </p>
            <div className="flex items-center gap-4">
              {settings.instagram && (
                <SocialLink
                  href={`https://instagram.com/${settings.instagram}`}
                  label="Instagram"
                >
                  IG
                </SocialLink>
              )}
              {settings.kakaoChannel && (
                <SocialLink href="https://pf.kakao.com" label="KakaoTalk">
                  KK
                </SocialLink>
              )}
              {settings.naverBlog && (
                <SocialLink href={settings.naverBlog} label="Naver Blog">
                  NB
                </SocialLink>
              )}
              {settings.naverSmartStore && (
                <SocialLink href={settings.naverSmartStore} label="Naver SmartStore">
                  NS
                </SocialLink>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase text-blanc-gold mb-6">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", href: "#home" },
                { label: "Portfolio", href: "#gallery" },
                { label: "Services", href: "#services" },
                { label: "Inquiry", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="font-body text-sm uppercase tracking-widest text-blanc-champagne/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <h4 className="font-display text-[10px] tracking-[0.3em] uppercase text-blanc-gold mb-6">
              Inquiries
            </h4>
            <ul className="flex flex-col gap-5">
              {settings.instagram && (
                <FooterContactItem
                  title="Instagram"
                  value={`@${settings.instagram}`}
                />
              )}
              {settings.kakaoChannel && (
                <FooterContactItem
                  title="Kakao"
                  value={settings.kakaoChannel}
                />
              )}
              {settings.phone && (
                <FooterContactItem title="Phone" value={settings.phone} />
              )}
              {settings.businessHours && (
                <FooterContactItem
                  title="Business Hours"
                  value={settings.businessHours}
                />
              )}
            </ul>
          </div>
        </div>

        {/* Border */}
        <div className="w-full h-px bg-blanc-champagne/10 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="font-body text-[10px] uppercase tracking-widest text-blanc-champagne/35">
            &copy; {currentYear} Blanc Belluno. All rights reserved.
          </p>
          <p className="font-display text-[11px] tracking-[0.15em] italic text-blanc-gold/50">
            Making every moment beautiful
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-blanc-champagne/15 flex items-center justify-center font-display text-[10px] tracking-widest text-blanc-champagne/60 hover:border-blanc-gold hover:text-blanc-gold hover:bg-white/5 transition-all duration-300"
    >
      {children}
    </a>
  );
}

function FooterContactItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <li>
      <p className="font-body text-[9px] uppercase tracking-[0.2em] text-blanc-champagne/35 mb-1">
        {title}
      </p>
      <p className="font-body text-sm text-blanc-champagne/80 tracking-wider">
        {value}
      </p>
    </li>
  );
}
