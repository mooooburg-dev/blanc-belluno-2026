"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface SlideData {
  id: string;
  imageUrl: string;
  originalName: string;
  objectPosition: string;
}

const FALLBACK_SLIDES: SlideData[] = [
  {
    id: "fallback-1",
    imageUrl: "/hero/slide-1.jpeg",
    originalName: "졸업식 풍선 아치 데코레이션",
    objectPosition: "center 40%",
  },
  {
    id: "fallback-2",
    imageUrl: "/hero/slide-2.jpeg",
    originalName: "기업 종무식 포토존 풍선 장식",
    objectPosition: "center 30%",
  },
  {
    id: "fallback-3",
    imageUrl: "/hero/slide-3.jpeg",
    originalName: "실버 크롬 풍선 시퀘인 월 데코",
    objectPosition: "center center",
  },
  {
    id: "fallback-4",
    imageUrl: "/hero/slide-4.jpeg",
    originalName: "VOGUE 컨셉 웨딩 풍선 장식",
    objectPosition: "center 40%",
  },
  {
    id: "fallback-5",
    imageUrl: "/hero/slide-5.jpeg",
    originalName: "어린이집 꽃풍선 데코레이션",
    objectPosition: "center 60%",
  },
];

const INTERVAL = 5000;

interface HeroProps {
  slides?: SlideData[];
}

export default function Hero({ slides }: HeroProps) {
  const activeSlides =
    slides && slides.length > 0 ? slides : FALLBACK_SLIDES;

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 1000);
    },
    [current, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % activeSlides.length);
  }, [current, goTo, activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next, activeSlides.length]);

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home">
      {/* 헤더 높이만큼 여백 */}
      <div className="h-[72px] md:h-[68px] bg-blanc-base" />

      {/* 배너 슬라이드 + 하단 오버랩 카드 */}
      <div className="relative">
        {/* 이미지 배너 */}
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          {activeSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
              aria-hidden={i !== current}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.originalName}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: slide.objectPosition }}
              />
            </div>
          ))}

          {/* 슬라이드 인디케이터 */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`슬라이드 ${i + 1}`}
                  className="group relative h-8 flex items-center justify-center"
                >
                  <div
                    className={`h-[2px] transition-all duration-500 ${
                      i === current
                        ? "w-8 bg-white"
                        : "w-4 bg-white/40 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 텍스트 카드 — 이미지 하단에 걸쳐서 올라옴 */}
        <div className="relative z-10 -mt-16 md:-mt-20 mx-4 md:mx-auto max-w-3xl">
          <div className="bg-blanc-base px-6 py-12 md:px-12 md:py-16 text-center shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
            {/* Eyebrow */}
            <div
              className="mb-8 opacity-0 animate-fade-up flex items-center justify-center gap-4"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-8 h-px bg-blanc-gold/40" />
              <span className="font-display text-[11px] md:text-xs tracking-[0.3em] uppercase text-blanc-gold">
                Premium Event Styling
              </span>
              <div className="w-8 h-px bg-blanc-gold/40" />
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-8 tracking-tight text-blanc-text-primary whitespace-nowrap">
              <div
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                Blanc{" "}
                <span className="italic text-blanc-text-secondary/80">
                  Belluno
                </span>
              </div>
            </h1>

            {/* Description Text */}
            <div
              className="max-w-md mx-auto opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <p className="font-body text-base md:text-lg font-light tracking-wide text-blanc-text-secondary leading-relaxed">
                섬세하고 고급스러운 감각으로
                <br /> 당신의 특별한 날을 완성합니다.
              </p>
              <div className="flex justify-center items-center gap-x-4 text-[11px] md:text-xs tracking-[0.15em] text-blanc-text-muted mt-8 whitespace-nowrap">
                <span>WEDDING</span>
                <span className="w-1 h-1 rounded-full bg-blanc-sand shrink-0" />
                <span>BABY SHOWER</span>
                <span className="w-1 h-1 rounded-full bg-blanc-sand shrink-0" />
                <span>PARTY & EVENT</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                onClick={() => handleScroll("#gallery")}
                className="btn-primary w-full sm:w-auto min-w-[180px]"
              >
                PORTFOLIO
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="btn-outline w-full sm:w-auto min-w-[180px]"
              >
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
