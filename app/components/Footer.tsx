"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #4A2D3E 0%, #3A2030 100%)",
        color: "#E8C5D5",
      }}
    >
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p
                className="font-display text-3xl font-light tracking-[0.2em] text-white"
              >
                BLANC
              </p>
              <p
                className="font-display text-xs tracking-[0.35em] mt-[-2px]"
                style={{ color: "#C9A96E" }}
              >
                BELLUNO
              </p>
            </div>
            <p
              className="font-body text-sm leading-relaxed mb-5"
              style={{ color: "#C9A0BC" }}
            >
              당신의 특별한 날을 더욱 빛나게.<br />
              풍선 장식 & 이벤트 스타일링 전문 브랜드 블랑벨루노입니다.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <SocialLink href="https://instagram.com/blancbelluno" label="Instagram">
                <InstagramIcon size={18} />
              </SocialLink>
              <SocialLink href="https://pf.kakao.com" label="KakaoTalk">
                <KakaoIcon size={18} />
              </SocialLink>
              <SocialLink href="https://blog.naver.com" label="Naver Blog">
                <NaverIcon size={18} />
              </SocialLink>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-display text-sm tracking-[0.3em] uppercase mb-5"
              style={{ color: "#C9A96E" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "홈", href: "#home" },
                { label: "서비스 소개", href: "#services" },
                { label: "포트폴리오", href: "#gallery" },
                { label: "인스타그램 피드", href: "#instagram" },
                { label: "상담 신청", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="font-body text-sm transition-colors duration-200 cursor-pointer"
                    style={{ color: "#C9A0BC" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "#E8D5B0")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "#C9A0BC")
                    }
                  >
                    → {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-display text-sm tracking-[0.3em] uppercase mb-5"
              style={{ color: "#C9A96E" }}
            >
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <p className="font-body text-xs uppercase tracking-wider mb-1" style={{ color: "#A8889A" }}>
                  카카오채널
                </p>
                <a
                  href="https://pf.kakao.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm"
                  style={{ color: "#E8D5B0" }}
                >
                  @blancbelluno
                </a>
              </li>
              <li>
                <p className="font-body text-xs uppercase tracking-wider mb-1" style={{ color: "#A8889A" }}>
                  인스타그램
                </p>
                <a
                  href="https://instagram.com/blancbelluno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm"
                  style={{ color: "#E8D5B0" }}
                >
                  @blancbelluno
                </a>
              </li>
              <li>
                <p className="font-body text-xs uppercase tracking-wider mb-1" style={{ color: "#A8889A" }}>
                  운영 시간
                </p>
                <p className="font-body text-sm" style={{ color: "#E8D5B0" }}>
                  평일 10:00 – 18:00
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div
        className="h-px mx-auto"
        style={{
          background: "linear-gradient(90deg, transparent, #C9A96E40, transparent)",
          maxWidth: "600px",
        }}
      />

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          className="font-body text-xs"
          style={{ color: "#7A5466" }}
        >
          © {currentYear} Blanc Belluno. All rights reserved.
        </p>
        <p
          className="font-display text-xs tracking-[0.2em] italic"
          style={{ color: "#7A5466" }}
        >
          Making every moment beautiful ✦
        </p>
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
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "rgba(201, 160, 188, 0.15)",
        color: "#C9A0BC",
        border: "1px solid rgba(201, 160, 188, 0.2)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(201, 169, 110, 0.25)";
        (e.currentTarget as HTMLElement).style.color = "#C9A96E";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(201, 160, 188, 0.15)";
        (e.currentTarget as HTMLElement).style.color = "#C9A0BC";
      }}
    >
      {children}
    </a>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function KakaoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.71 2 11.307c0 2.946 1.786 5.54 4.5 7.042L5.4 22l4.35-2.58A11.6 11.6 0 0 0 12 19.614c5.523 0 10-3.71 10-8.307C22 6.71 17.523 3 12 3z" />
    </svg>
  );
}

function NaverIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
    </svg>
  );
}
