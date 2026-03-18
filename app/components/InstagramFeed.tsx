// Instagram Feed Section
// 실제 연동 방법:
// 옵션 1 (추천): Elfsight Instagram Feed 위젯 사용 (유료, 간편)
//   → https://elfsight.com/instagram-feed-widget/
// 옵션 2: Instagram Basic Display API + 서버사이드 캐싱
//   → /api/instagram/route.ts 에서 fetchInstagramFeed() 구현
// 옵션 3: react-instagram-embed 패키지 사용

// 현재는 플레이스홀더 그리드로 구성되어 있습니다.
// 실제 사진이 준비되면 아래 placeholderPosts 배열을 실제 API 응답으로 교체하세요.

const INSTAGRAM_HANDLE = "blancbelluno"; // 실제 인스타그램 계정으로 변경

const placeholderPosts = [
  { id: 1, color: "#F8D7E3", accent: "#E8A0BF", emoji: "🎈" },
  { id: 2, color: "#FFF0E0", accent: "#E8C49A", emoji: "🎀" },
  { id: 3, color: "#E8F0FF", accent: "#A0B4E8", emoji: "🌸" },
  { id: 4, color: "#F5E8FF", accent: "#C49AE8", emoji: "✨" },
  { id: 5, color: "#FFE8F5", accent: "#E8A0CC", emoji: "🎊" },
  { id: 6, color: "#FFEEE8", accent: "#E8C0A0", emoji: "💕" },
  { id: 7, color: "#E8FFEE", accent: "#A0E8B4", emoji: "🎁" },
  { id: 8, color: "#FFF5E8", accent: "#E8D0A0", emoji: "🌷" },
  { id: 9, color: "#EEE8FF", accent: "#B4A0E8", emoji: "🦋" },
];

export default function InstagramFeed() {
  return (
    <section
      id="instagram"
      className="section-padding"
      style={{ background: "#FFF8FD" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span
            className="font-display text-sm tracking-[0.35em] uppercase block mb-3"
            style={{ color: "#C9A96E" }}
          >
            Instagram
          </span>
          <h2
            className="font-display text-4xl md:text-5xl font-light mb-5"
            style={{ color: "#4A2D3E" }}
          >
            인스타그램에서 <span className="italic text-[#D4899A]">만나요</span>
          </h2>
          <div className="divider-gold" />
          <p
            className="font-body text-base mt-6"
            style={{ color: "#7A5466" }}
          >
            매일 업데이트되는 블랑벨루노의 작업물을 팔로우하고 먼저 만나보세요.
          </p>
        </div>

        {/* Instagram handle badge */}
        <div className="flex justify-center mb-10">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              color: "white",
            }}
          >
            <InstagramIcon />
            <span className="font-body font-medium tracking-wide text-sm">
              @{INSTAGRAM_HANDLE}
            </span>
          </a>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {placeholderPosts.map((post) => (
            <a
              key={post.id}
              href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group aspect-square rounded-xl overflow-hidden relative cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${post.color}, ${post.accent}60)`,
                border: "1px solid rgba(201, 160, 188, 0.15)",
              }}
            >
              {/* Placeholder content */}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl md:text-5xl opacity-30">{post.emoji}</span>
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: "rgba(74, 45, 62, 0.55)" }}
              >
                <InstagramIcon className="text-white opacity-90" size={28} />
              </div>
            </a>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-10">
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <InstagramIcon size={16} />
            인스타그램 팔로우하기
          </a>
        </div>

        {/* Integration Note (dev only - 실제 배포 시 제거) */}
        <div
          className="mt-10 p-5 rounded-2xl text-left"
          style={{ background: "#FFF0F5", border: "1px dashed #EDD5E1" }}
        >
          <p className="font-body text-xs font-medium mb-2" style={{ color: "#C9A96E" }}>
            💡 Instagram 실시간 피드 연동 방법
          </p>
          <p className="font-body text-xs leading-relaxed" style={{ color: "#A8889A" }}>
            <strong style={{ color: "#7A5466" }}>옵션 1 (추천):</strong> <code>app/api/instagram/route.ts</code>에 Instagram Basic Display API 구현 후 이 컴포넌트에서 fetch<br />
            <strong style={{ color: "#7A5466" }}>옵션 2:</strong> Elfsight 위젯 임베드 (무설정, 유료)<br />
            <strong style={{ color: "#7A5466" }}>현재:</strong> 플레이스홀더 그리드 표시 중 — 실제 피드 연동 후 이 안내 박스는 삭제해주세요.
          </p>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
