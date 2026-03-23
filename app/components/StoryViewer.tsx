"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  timestamp: string;
}

const STORY_DURATION = 5000; // 5초

export default function StoryViewer({
  isOpen,
  onClose,
  stories: rawStories,
}: {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
}) {
  // 오래된 스토리부터 보여주기 (인스타그램 방식)
  const stories = [...rawStories].reverse();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);
  const longPressRef = useRef(false);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchRef = useRef(false);

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      setMediaLoaded(false);
      elapsedRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      setMediaLoaded(false);
      elapsedRef.current = 0;
    }
  }, [currentIndex]);

  // 진행 바 타이머 — 미디어 로드 후 시작
  useEffect(() => {
    if (!isOpen || isPaused || !mediaLoaded || stories.length === 0) return;

    const currentStory = stories[currentIndex];
    const duration =
      currentStory?.mediaType === "VIDEO" ? 15000 : STORY_DURATION;

    startTimeRef.current = Date.now() - elapsedRef.current;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);

      if (pct >= 1) {
        goNext();
      }
    }, 30);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, currentIndex, isPaused, mediaLoaded, stories, goNext]);

  // 키보드 네비게이션
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goNext, goPrev, onClose]);

  // 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setCurrentIndex(0);
      setProgress(0);
      setMediaLoaded(false);
      elapsedRef.current = 0;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 다음 2개 이미지 프리로딩
  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    for (let offset = 1; offset <= 2; offset++) {
      const nextIndex = currentIndex + offset;
      if (nextIndex < stories.length) {
        const nextStory = stories[nextIndex];
        if (nextStory.mediaType === "IMAGE") {
          const img = new window.Image();
          img.src = nextStory.mediaUrl;
        }
      }
    }
  }, [isOpen, currentIndex, stories]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const storyTime = new Date(currentStory.timestamp);
  const timeAgo = getTimeAgo(storyTime);

  const pauseTimer = () => {
    setIsPaused(true);
    elapsedRef.current = Date.now() - startTimeRef.current;
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  // 모바일 터치: 길게 누르면 일시정지, 짧게 탭하면 이전/다음
  const handleTouchStart = () => {
    isTouchRef.current = true;
    longPressRef.current = false;
    touchTimerRef.current = setTimeout(() => {
      longPressRef.current = true;
      pauseTimer();
    }, 150);
  };

  const handleTouchEnd = (side: "left" | "right") => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (longPressRef.current) {
      resumeTimer();
    } else {
      side === "left" ? goPrev() : goNext();
    }
    longPressRef.current = false;
  };

  // PC에서만 onClick 처리 (터치 디바이스에서는 무시)
  const handleClick = (side: "left" | "right") => {
    if (isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }
    side === "left" ? goPrev() : goNext();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={(e) => {
        // PC: 검정 배경(콘텐츠 영역 바깥) 클릭 시 닫기
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 메인 콘텐츠 영역 */}
      <div className="relative w-full h-full max-w-[420px] max-h-[90vh] mx-auto flex flex-col">
        {/* 상단: 진행 바 + 프로필 + 닫기 버튼 */}
        <div className="relative z-20 px-3 pt-3">
          {/* 진행 바 */}
          <div className="flex gap-1 pb-2">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-none"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? `${progress * 100}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* 프로필 + 닫기 */}
          <div className="flex items-center gap-2.5 pb-2">
            <Image
              src="/blanc_belluno_logo.jpg"
              alt="Blanc Belluno"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-white text-xs font-medium tracking-wide">
              blancbelluno
            </span>
            <span className="text-white/50 text-xs">{timeAgo}</span>
            <button
              onClick={onClose}
              className="ml-auto p-2 -mr-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 스토리 미디어 */}
        <div className="relative flex-1 overflow-hidden rounded-sm bg-black">
          {/* 로딩 스피너 */}
          {!mediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-[5]">
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

          {/* 좌측 탭 영역 */}
          <div
            className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
            onClick={() => handleClick("left")}
            onMouseDown={pauseTimer}
            onMouseUp={resumeTimer}
            onTouchStart={handleTouchStart}
            onTouchEnd={() => handleTouchEnd("left")}
            aria-label="이전 스토리"
          />
          {/* 우측 탭 영역 */}
          <div
            className="absolute right-0 top-0 w-2/3 h-full z-10 cursor-pointer"
            onClick={() => handleClick("right")}
            onMouseDown={pauseTimer}
            onMouseUp={resumeTimer}
            onTouchStart={handleTouchStart}
            onTouchEnd={() => handleTouchEnd("right")}
            aria-label="다음 스토리"
          />
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}분 전`;
  }
  return `${hours}시간 전`;
}
