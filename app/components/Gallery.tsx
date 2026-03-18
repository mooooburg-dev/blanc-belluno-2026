"use client";

import { useState } from "react";

const categories = ["전체", "생일파티", "웨딩", "베이비샤워", "기업행사"];

// Placeholder gallery items with different aspect ratios and pastel colors
const galleryItems = [
  { id: 1, category: "생일파티", color: "#F8D7E3", accent: "#E8A0BF", title: "핑크 드림 생일파티", tag: "Birthday" },
  { id: 2, category: "웨딩", color: "#FFF0E0", accent: "#E8C49A", title: "골드 웨딩 포토존", tag: "Wedding", tall: true },
  { id: 3, category: "베이비샤워", color: "#E8F0FF", accent: "#A0B4E8", title: "블루 베이비샤워", tag: "Baby Shower" },
  { id: 4, category: "생일파티", color: "#F5E8FF", accent: "#C49AE8", title: "퍼플 홈파티", tag: "Birthday", tall: true },
  { id: 5, category: "기업행사", color: "#E8FFE8", accent: "#9AE8A0", title: "그린 기업 행사", tag: "Corporate" },
  { id: 6, category: "웨딩", color: "#FFE8E8", accent: "#E8A0A0", title: "로즈 웨딩 장식", tag: "Wedding" },
  { id: 7, category: "베이비샤워", color: "#FFEEE8", accent: "#E8C0A0", title: "피치 젠더리빌", tag: "Gender Reveal", tall: true },
  { id: 8, category: "생일파티", color: "#E8FFF8", accent: "#A0E8CC", title: "민트 키즈 파티", tag: "Birthday" },
  { id: 9, category: "기업행사", color: "#F0E8FF", accent: "#B4A0E8", title: "런칭 파티", tag: "Corporate" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered =
    activeCategory === "전체"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="gallery"
      className="section-padding"
      style={{ background: "#FFFAF8" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="font-display text-sm tracking-[0.35em] uppercase block mb-3"
            style={{ color: "#C9A96E" }}
          >
            Portfolio
          </span>
          <h2
            className="font-display text-4xl md:text-5xl font-light mb-5"
            style={{ color: "#4A2D3E" }}
          >
            블랑벨루노의 <span className="italic text-[#D4899A]">작품들</span>
          </h2>
          <div className="divider-gold" />
          <p
            className="font-body text-base mt-6 max-w-xl mx-auto leading-relaxed"
            style={{ color: "#7A5466" }}
          >
            직접 제작한 모든 장식에는 블랑벨루노만의 섬세함이 담겨있습니다.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="font-body text-sm px-5 py-2 rounded-full transition-all duration-200"
              style={
                activeCategory === cat
                  ? {
                      background: "linear-gradient(135deg, #D4899A, #C9A0BC)",
                      color: "white",
                      boxShadow: "0 3px 12px rgba(212, 137, 154, 0.35)",
                    }
                  : {
                      background: "white",
                      color: "#7A5466",
                      border: "1px solid #EDD5E1",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group rounded-2xl overflow-hidden cursor-pointer relative"
              style={{
                background: item.color,
                border: "1px solid rgba(201, 160, 188, 0.15)",
              }}
            >
              {/* Image placeholder */}
              <div
                className={`w-full flex items-center justify-center relative overflow-hidden ${
                  item.tall ? "h-72 md:h-80" : "h-52 md:h-60"
                }`}
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.accent}30)` }}
              >
                {/* Decorative balloon placeholder */}
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <span className="text-5xl">🎈</span>
                </div>

                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: "rgba(74, 45, 62, 0.5)" }}
                >
                  <div className="text-center text-white px-4">
                    <p className="font-display text-lg italic">{item.title}</p>
                    <span
                      className="font-body text-xs tracking-wider mt-1 block"
                      style={{ color: "#E8D5B0" }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3">
                <p className="font-body text-sm font-medium" style={{ color: "#4A2D3E" }}>
                  {item.title}
                </p>
                <span
                  className="font-body text-xs tracking-wider"
                  style={{ color: "#A8889A" }}
                >
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Upload notice */}
        <div
          className="mt-12 text-center p-6 rounded-2xl"
          style={{ background: "#FFF0F5", border: "1px dashed #EDD5E1" }}
        >
          <p className="font-body text-sm" style={{ color: "#A8889A" }}>
            실제 작업 사진을{" "}
            <code
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: "#EDD5E1", color: "#7A5466" }}
            >
              /public/gallery/
            </code>{" "}
            폴더에 업로드하면 자동으로 표시됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
