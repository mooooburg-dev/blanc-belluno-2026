"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableItem from "./SortableItem";

const CATEGORIES = ["WEDDING", "BABY SHOWER", "PARTY", "CORPORATE"] as const;
type Category = (typeof CATEGORIES)[number];

interface PortfolioItem {
  id: string;
  filename: string;
  originalName: string;
  order: number;
  category: Category;
  title: string;
  tag: string;
  imageUrl: string;
}

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

type Tab = "portfolio" | "hero" | "settings";

const TAB_CONFIG: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: "portfolio",
    label: "포트폴리오",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "hero",
    label: "히어로 슬라이드",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "사이트 설정",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("portfolio");

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-wide text-stone-900 uppercase">
                Blanc Belluno
              </h1>
              <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              사이트 보기
            </Link>
          </div>
          <nav className="flex gap-0 -mb-px">
            {TAB_CONFIG.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? "border-stone-900 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600 hover:border-stone-300"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {tab === "portfolio" ? (
          <PortfolioTab />
        ) : tab === "hero" ? (
          <HeroSlidesTab />
        ) : (
          <SettingsTab />
        )}
      </main>
    </div>
  );
}

/* ─── Portfolio Tab ─── */

function PortfolioTab() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadCategory, setUploadCategory] = useState<Category>("PARTY");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTag, setUploadTag] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "ALL">("ALL");
  const [dragOverUpload, setDragOverUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/portfolio");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", uploadCategory);
      formData.append("title", uploadTitle);
      formData.append("tag", uploadTag);
      await fetch("/api/portfolio", { method: "POST", body: formData });
    }
    await fetchItems();
    setUploading(false);
    setUploadTitle("");
    setUploadTag("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverUpload(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 이미지를 삭제하시겠습니까?")) return;
    await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchItems();
  };

  const handleUpdate = async (
    id: string,
    updates: Partial<Pick<PortfolioItem, "category" | "title" | "tag">>
  ) => {
    await fetch("/api/portfolio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    await fetchItems();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) }),
    });
  };

  const filteredItems =
    filterCategory === "ALL"
      ? items
      : items.filter((i) => i.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Upload section */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">이미지 업로드</h2>
            <p className="text-xs text-stone-400 mt-0.5">JPG, PNG, GIF, WebP (여러 장 선택 가능)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">카테고리</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as Category)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-shadow"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">제목 (선택)</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="Champagne Elegance"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">태그 (선택)</label>
            <input
              type="text"
              value={uploadTag}
              onChange={(e) => setUploadTag(e.target.value)}
              placeholder="Wedding Arch"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverUpload(true); }}
          onDragLeave={() => setDragOverUpload(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOverUpload
              ? "border-stone-900 bg-stone-50"
              : "border-stone-200 hover:border-stone-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
                <span className="text-sm text-stone-600">업로드 중...</span>
              </div>
            ) : (
              <>
                <p className="text-sm text-stone-500">
                  이미지를 드래그하거나{" "}
                  <label htmlFor="file-upload" className="text-stone-900 font-medium cursor-pointer hover:underline">
                    파일 선택
                  </label>
                </p>
                <p className="text-xs text-stone-400">업로드 시 위 카테고리/제목/태그가 적용됩니다</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-white rounded-lg border border-stone-200 p-1 shadow-sm">
          <FilterButton
            active={filterCategory === "ALL"}
            onClick={() => setFilterCategory("ALL")}
          >
            전체 ({items.length})
          </FilterButton>
          {CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <FilterButton
                key={cat}
                active={filterCategory === cat}
                onClick={() => setFilterCategory(cat)}
              >
                {cat} ({count})
              </FilterButton>
            );
          })}
        </div>
        {filteredItems.length > 0 && (
          <p className="text-xs text-stone-400">
            드래그하여 순서 변경 가능
          </p>
        )}
      </div>

      {/* Portfolio grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
          <p className="text-sm text-stone-400">불러오는 중...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-stone-400">
            {items.length === 0
              ? "아직 포트폴리오 이미지가 없습니다"
              : "해당 카테고리에 이미지가 없습니다"}
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredItems.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredItems.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
        active
          ? "bg-stone-900 text-white shadow-sm"
          : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Hero Slides Tab ─── */

interface HeroSlide {
  id: string;
  filename: string;
  originalName: string;
  order: number;
  objectPosition: string;
  imageUrl: string;
}

function HeroSlidesTab() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOverUpload, setDragOverUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchSlides = useCallback(async () => {
    const res = await fetch("/api/hero-slides");
    const data = await res.json();
    setSlides(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/hero-slides", { method: "POST", body: formData });
    }
    await fetchSlides();
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverUpload(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 슬라이드를 삭제하시겠습니까?")) return;
    await fetch("/api/hero-slides", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchSlides();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex((i) => i.id === active.id);
    const newIndex = slides.findIndex((i) => i.id === over.id);
    const newSlides = arrayMove(slides, oldIndex, newIndex);
    setSlides(newSlides);

    await fetch("/api/hero-slides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: newSlides.map((i) => i.id) }),
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload + 안내 */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">슬라이드 추가</h2>
            <p className="text-xs text-stone-400 mt-0.5">메인 화면 상단 배너에 표시됩니다</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-amber-200">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            권장: 1920 x 1080px (16:9)
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverUpload(true); }}
          onDragLeave={() => setDragOverUpload(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOverUpload
              ? "border-stone-900 bg-stone-50"
              : "border-stone-200 hover:border-stone-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="hero-file-upload"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
                <span className="text-sm text-stone-600">업로드 중...</span>
              </div>
            ) : (
              <p className="text-sm text-stone-500">
                이미지를 드래그하거나{" "}
                <label htmlFor="hero-file-upload" className="text-stone-900 font-medium cursor-pointer hover:underline">
                  파일 선택
                </label>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Slides header */}
      {!loading && slides.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-stone-700">
            슬라이드 목록
            <span className="ml-2 text-xs font-normal text-stone-400">총 {slides.length}장</span>
          </p>
          <p className="text-xs text-stone-400">드래그하여 순서 변경 가능</p>
        </div>
      )}

      {/* Slides grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
          <p className="text-sm text-stone-400">불러오는 중...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-sm text-stone-400">아직 히어로 슬라이드가 없습니다</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map((i) => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide, index) => (
                <HeroSortableItem
                  key={slide.id}
                  slide={slide}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function HeroSortableItem({
  slide,
  index,
  onDelete,
}: {
  slide: HeroSlide;
  index: number;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden bg-white shadow-sm border border-stone-200 transition-shadow hover:shadow-md ${
        isDragging ? "z-50 shadow-xl ring-2 ring-stone-900" : ""
      }`}
    >
      {/* 순서 번호 + Drag handle */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <div className="bg-white/90 backdrop-blur text-stone-900 text-xs font-bold rounded-lg w-7 h-7 flex items-center justify-center shadow-sm">
          {index + 1}
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing bg-white/90 backdrop-blur text-stone-500 rounded-lg p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          title="드래그하여 순서 변경"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.5" />
            <circle cx="11" cy="3" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="13" r="1.5" />
            <circle cx="11" cy="13" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Delete button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(slide.id)}
          className="bg-white/90 backdrop-blur hover:bg-red-500 hover:text-white text-stone-500 rounded-lg w-7 h-7 flex items-center justify-center shadow-sm transition-colors"
          title="삭제"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Image — 16:9 비율 프리뷰 */}
      <div className="aspect-video relative">
        <Image
          src={slide.imageUrl}
          alt={slide.originalName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Info */}
      <div className="px-3 py-2.5 border-t border-stone-100">
        <p className="text-xs text-stone-500 truncate">{slide.originalName}</p>
      </div>
    </div>
  );
}

/* ─── Settings Tab ─── */

function SettingsTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
        <p className="text-sm text-stone-400">불러오는 중...</p>
      </div>
    );
  }

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* SNS */}
      <SettingsSection
        title="SNS 계정"
        description="사이트에 표시되는 SNS 정보를 관리합니다"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
      >
        <SettingsField
          label="Instagram ID"
          value={settings.instagram}
          onChange={(v) => update("instagram", v)}
          placeholder="blancbelluno"
          prefix="@"
        />
        <SettingsField
          label="카카오 채널"
          value={settings.kakaoChannel}
          onChange={(v) => update("kakaoChannel", v)}
          placeholder="@blancbelluno"
        />
        <SettingsField
          label="네이버 블로그 URL"
          value={settings.naverBlog}
          onChange={(v) => update("naverBlog", v)}
          placeholder="https://blog.naver.com/blancbelluno"
        />
        <SettingsField
          label="네이버 스마트스토어 URL"
          value={settings.naverSmartStore}
          onChange={(v) => update("naverSmartStore", v)}
          placeholder="https://smartstore.naver.com/blancbelluno"
        />
      </SettingsSection>

      {/* 연락처 */}
      <SettingsSection
        title="연락처"
        description="문의 섹션과 푸터에 표시되는 연락처입니다"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        }
      >
        <SettingsField
          label="전화번호"
          value={settings.phone}
          onChange={(v) => update("phone", v)}
          placeholder="010-0000-0000"
        />
        <SettingsField
          label="이메일"
          value={settings.email}
          onChange={(v) => update("email", v)}
          placeholder="hello@blancbelluno.com"
        />
        <SettingsField
          label="영업시간"
          value={settings.businessHours}
          onChange={(v) => update("businessHours", v)}
          placeholder="Mon - Fri / 10:00 - 18:00"
        />
      </SettingsSection>

      {/* 브랜드 */}
      <SettingsSection
        title="브랜드"
        description="푸터에 표시되는 브랜드 소개 문구입니다"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        }
      >
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1.5">
            브랜드 소개
          </label>
          <textarea
            value={settings.brandDescription}
            onChange={(e) => update("brandDescription", e.target.value)}
            rows={3}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-shadow"
          />
        </div>
      </SettingsSection>

      {/* Save button - sticky */}
      <div className="sticky bottom-0 bg-linear-to-t from-stone-50 via-stone-50 to-stone-50/80 pt-4 pb-6 -mx-6 px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium rounded-lg px-6 py-2.5 hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                저장 중...
              </>
            ) : (
              "변경사항 저장"
            )}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium animate-in fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              저장되었습니다
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-stone-400">{icon}</span>
        <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
      </div>
      <p className="text-xs text-stone-400 mb-5 ml-[26px]">{description}</p>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function SettingsField({
  label,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">
        {label}
      </label>
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-sm text-stone-400 bg-stone-50 border border-r-0 border-stone-200 rounded-l-lg">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-stone-200 px-3 py-2 text-sm focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none transition-shadow ${
            prefix ? "rounded-r-lg" : "rounded-lg"
          }`}
        />
      </div>
    </div>
  );
}
