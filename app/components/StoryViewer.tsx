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
  stories,
}: {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      elapsedRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      elapsedRef.current = 0;
    }
  }, [currentIndex]);

  // 진행 바 타이머
  useEffect(() => {
    if (!isOpen || isPaused || stories.length === 0) return;

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
  }, [isOpen, currentIndex, isPaused, stories, goNext]);

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
      elapsedRef.current = 0;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const storyTime = new Date(currentStory.timestamp);
  const timeAgo = getTimeAgo(storyTime);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors cursor-pointer"
        aria-label="닫기"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative w-full h-full max-w-[420px] max-h-[90vh] mx-auto flex flex-col">
        {/* 상단 진행 바 */}
        <div className="flex gap-1 px-3 pt-3 pb-2 z-10">
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

        {/* 프로필 정보 */}
        <div className="flex items-center gap-2.5 px-3 pb-3 z-10">
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
        </div>

        {/* 스토리 미디어 */}
        <div
          className="relative flex-1 overflow-hidden rounded-sm bg-black"
          onMouseDown={() => {
            setIsPaused(true);
            elapsedRef.current = Date.now() - startTimeRef.current;
          }}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => {
            setIsPaused(true);
            elapsedRef.current = Date.now() - startTimeRef.current;
          }}
          onTouchEnd={() => setIsPaused(false)}
        >
          {currentStory.mediaType === "VIDEO" ? (
            <video
              key={currentStory.id}
              src={currentStory.mediaUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <Image
              key={currentStory.id}
              src={currentStory.mediaUrl}
              alt="Story"
              fill
              className="object-contain"
              sizes="420px"
              priority
            />
          )}

          {/* 좌/우 탭 영역 */}
          <button
            className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-10"
            onClick={goPrev}
            aria-label="이전 스토리"
          />
          <button
            className="absolute right-0 top-0 w-2/3 h-full cursor-pointer z-10"
            onClick={goNext}
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
