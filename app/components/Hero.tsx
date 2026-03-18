"use client";

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #FFF0F5 0%, #FAF0F8 30%, #F5E8F5 60%, #FFF5E8 100%)",
      }}
    >
      {/* Decorative background circles */}
      <div
        className="absolute top-[-10%] right-[-8%] w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, #EDD5E1 0%, #F8E8EE 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-5%] left-[-8%] w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, #E8D5B0 0%, #FAF0E8 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[20%] left-[5%] w-[250px] h-[250px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, #EDD5E1 0%, transparent 70%)",
        }}
      />

      {/* Floating balloons (decorative SVG-based) */}
      <div className="absolute top-[15%] right-[12%] animate-float" style={{ animationDelay: "0s" }}>
        <BalloonDecor color="#EDD5E1" size={48} />
      </div>
      <div className="absolute top-[30%] right-[6%] animate-float" style={{ animationDelay: "1s" }}>
        <BalloonDecor color="#E8D5B0" size={36} />
      </div>
      <div className="absolute bottom-[25%] left-[8%] animate-float" style={{ animationDelay: "0.5s" }}>
        <BalloonDecor color="#F0D5E8" size={44} />
      </div>
      <div className="absolute top-[55%] left-[4%] animate-float" style={{ animationDelay: "1.5s" }}>
        <BalloonDecor color="#EDD5E1" size={28} />
      </div>
      <div className="absolute bottom-[35%] right-[18%] animate-float" style={{ animationDelay: "2s" }}>
        <BalloonDecor color="#D4C5E8" size={32} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #C9A96E)" }} />
          <span
            className="font-display text-sm tracking-[0.3em] uppercase"
            style={{ color: "#C9A96E" }}
          >
            Balloon Decoration & Event Styling
          </span>
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #C9A96E, transparent)" }} />
        </div>

        {/* Main Headline */}
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-4 animate-fade-in-up"
          style={{ color: "#4A2D3E", animationDelay: "0.2s" }}
        >
          Blanc
          <span className="italic text-[#D4899A]"> Belluno</span>
        </h1>

        {/* Korean Tagline */}
        <p
          className="font-body text-xl md:text-2xl font-light tracking-wide mt-4 mb-3 animate-fade-in-up"
          style={{ color: "#7A5466", animationDelay: "0.35s" }}
        >
          당신의 특별한 날을 더욱 빛나게
        </p>
        <p
          className="font-body text-sm md:text-base tracking-wider animate-fade-in-up"
          style={{ color: "#A8889A", animationDelay: "0.45s" }}
        >
          생일파티 · 웨딩 · 돌잔치 · 베이비샤워 · 기업행사
        </p>

        {/* Gold Divider */}
        <div className="divider-gold my-8 animate-fade-in-up" style={{ animationDelay: "0.55s" }} />

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.65s" }}
        >
          <button
            onClick={() => handleScroll("#gallery")}
            className="btn-primary w-full sm:w-auto"
          >
            <span>✦</span> 포트폴리오 보기
          </button>
          <button
            onClick={() => handleScroll("#contact")}
            className="btn-outline w-full sm:w-auto"
          >
            상담 신청하기
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16 flex flex-col items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "0.9s" }}
        >
          <span className="font-body text-xs tracking-[0.25em] uppercase" style={{ color: "#A8889A" }}>
            Scroll
          </span>
          <div className="w-px h-10 relative overflow-hidden" style={{ background: "#EDD5E1" }}>
            <div
              className="absolute top-0 left-0 w-full h-1/2"
              style={{
                background: "#C9A96E",
                animation: "scrollDown 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}

function BalloonDecor({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 40 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      opacity="0.7"
    >
      {/* Balloon body */}
      <ellipse cx="20" cy="18" rx="16" ry="18" fill={color} />
      {/* Highlight */}
      <ellipse cx="14" cy="11" rx="5" ry="6" fill="white" opacity="0.4" />
      {/* Knot */}
      <path d="M18 36 Q20 38 22 36" stroke={color} strokeWidth="1.5" fill="none" />
      {/* String */}
      <path d="M20 37 Q18 44 20 52" stroke="#C9A0BC" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}
