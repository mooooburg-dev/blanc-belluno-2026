"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  timestamp: string;
}

const STORY_DURATION = 5000;
const VIDEO_DURATION = 15000;
const DISMISS_THRESHOLD = 120; // px — 이 이상 내리면 닫기

export default function StoryViewer({
  isOpen,
  onClose,
  stories: rawStories,
}: {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
}) {
  const stories = useMemo(() => [...rawStories].reverse(), [rawStories]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // 스와이프 다운 dismiss
  const [swipeY, setSwipeY] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const swipeStartRef = useRef<{ y: number; x: number } | null>(null);
  const swipeLockedRef = useRef<"vertical" | "horizontal" | null>(null);

  // 타이머 refs
  const rafRef = useRef(0);
  const timerStartRef = useRef(0);
  const savedElapsedRef = useRef(0);
  const isTouchRef = useRef(false);
  const touchStartRef = useRef(0);
  const generationRef = useRef(0);

  const currentIndexRef = useRef(currentIndex);
  const storiesLenRef = useRef(stories.length);
  const onCloseRef = useRef(onClose);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { storiesLenRef.current = stories.length; }, [stories.length]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // --- 핵심 함수들 ---

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const goTo = useCallback((index: number) => {
    stopAnimation();
    generationRef.current += 1;
    savedElapsedRef.current = 0;
    timerStartRef.current = 0;
    setProgress(0);
    setMediaLoaded(false);
    setPaused(false);
    setCurrentIndex(index);
  }, [stopAnimation]);

  const goNext = useCallback(() => {
    const next = currentIndexRef.current + 1;
    if (next < storiesLenRef.current) {
      goTo(next);
    } else {
      stopAnimation();
      goTo(0);
      onCloseRef.current();
    }
  }, [goTo, stopAnimation]);

  const goPrev = useCallback(() => {
    const prev = currentIndexRef.current - 1;
    goTo(prev >= 0 ? prev : 0);
  }, [goTo]);

  const handleClose = useCallback(() => {
    goTo(0);
    onCloseRef.current();
  }, [goTo]);

  // --- 타이머 ---

  useEffect(() => {
    if (!isOpen || paused || !mediaLoaded || stories.length === 0) return;

    const story = stories[currentIndex];
    if (!story) return;

    const duration = story.mediaType === "VIDEO" ? VIDEO_DURATION : STORY_DURATION;
    const startTime = performance.now() - savedElapsedRef.current;
    timerStartRef.current = startTime;

    const gen = generationRef.current;

    const tick = (now: number) => {
      if (gen !== generationRef.current) return;
      const elapsed = now - startTime;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);

      if (pct >= 1) {
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, currentIndex, paused, mediaLoaded, stories, goNext]);

  // 키보드
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, goNext, goPrev, handleClose]);

  // 스크롤 잠금 + pull-to-refresh 차단
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
  }, [isOpen]);

  // 프리로딩
  useEffect(() => {
    if (!isOpen || stories.length === 0) return;
    for (let i = 1; i <= 2; i++) {
      const idx = currentIndex + i;
      if (idx < stories.length && stories[idx].mediaType === "IMAGE") {
        const img = new window.Image();
        img.src = stories[idx].mediaUrl;
      }
    }
  }, [isOpen, currentIndex, stories]);

  // --- 스와이프 다운 dismiss ---

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      swipeStartRef.current = { y: touch.clientY, x: touch.clientX };
      swipeLockedRef.current = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!swipeStartRef.current) return;
      const touch = e.touches[0];
      const dy = touch.clientY - swipeStartRef.current.y;
      const dx = touch.clientX - swipeStartRef.current.x;

      // 방향 잠금: 최초 10px 이동으로 수직/수평 결정
      if (!swipeLockedRef.current) {
        if (Math.abs(dy) > 10 || Math.abs(dx) > 10) {
          swipeLockedRef.current = Math.abs(dy) > Math.abs(dx) ? "vertical" : "horizontal";
        } else {
          return;
        }
      }

      if (swipeLockedRef.current !== "vertical") return;

      // 아래로만 (위로 스와이프는 무시)
      if (dy <= 0) {
        setSwipeY(0);
        return;
      }

      e.preventDefault(); // 브라우저 pull-to-refresh 차단
      setSwiping(true);
      setSwipeY(dy);
    };

    const onTouchEnd = () => {
      if (swipeLockedRef.current === "vertical" && swipeY > DISMISS_THRESHOLD) {
        // 충분히 내렸으면 닫기
        handleClose();
      }
      setSwipeY(0);
      setSwiping(false);
      swipeStartRef.current = null;
      swipeLockedRef.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, swipeY, handleClose]);

  // --- 렌더 ---

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  if (!currentStory) return null;

  const timeAgo = getTimeAgo(new Date(currentStory.timestamp));

  const doPause = () => {
    savedElapsedRef.current = performance.now() - timerStartRef.current;
    setPaused(true);
  };

  const doResume = () => {
    setPaused(false);
  };

  const onMouseDown = () => {
    doPause();
    const onUp = () => {
      doResume();
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mouseup", onUp);
  };

  const onAreaTouchStart = () => {
    isTouchRef.current = true;
    touchStartRef.current = performance.now();
    doPause();
  };

  const onAreaTouchEnd = (side: "left" | "right") => {
    // 스와이프 중이면 탭 무시
    if (swiping || swipeLockedRef.current === "vertical") return;

    const duration = performance.now() - touchStartRef.current;
    if (duration < 200) {
      side === "left" ? goPrev() : goNext();
    } else {
      doResume();
    }
  };

  const onAreaClick = (side: "left" | "right") => {
    if (isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }
    side === "left" ? goPrev() : goNext();
  };

  // 스와이프 시각 효과
  const swipeProgress = Math.min(swipeY / DISMISS_THRESHOLD, 1);
  const overlayOpacity = swiping ? 0.95 - swipeProgress * 0.5 : 0.95;
  const contentTransform = swiping ? `translateY(${swipeY}px) scale(${1 - swipeProgress * 0.05})` : undefined;
  const contentTransition = swiping ? "none" : "transform 0.3s ease";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 100,
        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
        touchAction: "none",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative w-full h-full max-w-[420px] max-h-[90vh] mx-auto flex flex-col"
        style={{
          transform: contentTransform,
          transition: contentTransition,
        }}
      >
        {/* 진행 바 + 프로필 + 닫기 */}
        <div className="relative z-20 px-3 pt-3">
          <div className="flex gap-1 pb-2">
            {stories.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white rounded-full"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? `${progress * 100}%`
                          : "0%",
                    transition: "none",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2.5 pb-2">
            <Image
              src="/blanc_belluno_logo.jpg"
              alt="Blanc Belluno"
              width={32}
              height={32}
              className="rounded-full"
            />
            <a
              href="https://instagram.com/blanc_belluno"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs font-medium tracking-wide hover:underline"
            >
              blanc_belluno
            </a>
            <span className="text-white/50 text-xs">{timeAgo}</span>
            <button
              onClick={handleClose}
              className="ml-auto p-2 -mr-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 미디어 */}
        <div className="relative flex-1 overflow-hidden rounded-sm bg-black">
          {!mediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-5">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {currentStory.mediaType === "VIDEO" ? (
            <video
              key={currentStory.id}
              src={currentStory.mediaUrl}
              className={`w-full h-full object-contain transition-opacity duration-200 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
              autoPlay
              muted
              playsInline
              onLoadedData={() => setMediaLoaded(true)}
            />
          ) : (
            <Image
              key={currentStory.id}
              src={currentStory.mediaUrl}
              alt="Story"
              fill
              className={`object-contain transition-opacity duration-200 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="420px"
              priority
              onLoad={() => setMediaLoaded(true)}
            />
          )}

          {/* 좌측 탭 */}
          <div
            className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
            onClick={() => onAreaClick("left")}
            onMouseDown={onMouseDown}
            onTouchStart={onAreaTouchStart}
            onTouchEnd={() => onAreaTouchEnd("left")}
          />
          {/* 우측 탭 */}
          <div
            className="absolute right-0 top-0 w-2/3 h-full z-10 cursor-pointer"
            onClick={() => onAreaClick("right")}
            onMouseDown={onMouseDown}
            onTouchStart={onAreaTouchStart}
            onTouchEnd={() => onAreaTouchEnd("right")}
          />
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}분 전`;
  }
  return `${hours}시간 전`;
}
