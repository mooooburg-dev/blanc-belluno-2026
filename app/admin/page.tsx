"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
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
} from "@dnd-kit/sortable";
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

type Tab = "portfolio" | "settings";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("portfolio");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold text-gray-900">
              Blanc Belluno Admin
            </h1>
            <nav className="flex gap-1">
              <TabButton
                active={tab === "portfolio"}
                onClick={() => setTab("portfolio")}
              >
                포트폴리오
              </TabButton>
              <TabButton
                active={tab === "settings"}
                onClick={() => setTab("settings")}
              >
                사이트 설정
              </TabButton>
            </nav>
          </div>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            사이트 보기 →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === "portfolio" ? <PortfolioTab /> : <SettingsTab />}
      </main>
    </div>
  );
}

function TabButton({
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
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
    <>
      {/* Upload section */}
      <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          이미지 업로드
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              카테고리
            </label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as Category)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              제목 (선택)
            </label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="ex) Champagne Elegance"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              태그 (선택)
            </label>
            <input
              type="text"
              value={uploadTag}
              onChange={(e) => setUploadTag(e.target.value)}
              placeholder="ex) Wedding Arch"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium rounded-md px-4 py-2 hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {uploading ? "업로드 중..." : "이미지 추가"}
            </label>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          JPG, PNG, GIF, WebP (여러 장 선택 가능). 업로드 시 위 카테고리/제목/태그가 적용됩니다.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
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
      </div>

      {/* Portfolio grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-20">로딩 중...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          {items.length === 0
            ? "아직 포트폴리오 이미지가 없습니다."
            : "해당 카테고리에 이미지가 없습니다."}
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-4">
            드래그하여 순서를 변경할 수 있습니다. 호버 시 편집 가능합니다.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredItems.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
        </>
      )}
    </>
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
      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
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
      <div className="text-center text-gray-500 py-20">로딩 중...</div>
    );
  }

  const update = (key: keyof SiteSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  return (
    <div className="max-w-2xl">
      {/* SNS & 연락처 */}
      <SettingsSection title="SNS 계정" description="사이트에 표시되는 SNS 정보를 관리합니다.">
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

      <SettingsSection title="연락처" description="문의 섹션과 푸터에 표시되는 연락처입니다.">
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

      <SettingsSection title="브랜드" description="푸터에 표시되는 브랜드 소개 문구입니다.">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            브랜드 소개
          </label>
          <textarea
            value={settings.brandDescription}
            onChange={(e) => update("brandDescription", e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </SettingsSection>

      {/* Save button */}
      <div className="sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 -mx-4 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-900 text-white text-sm font-medium rounded-md px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">
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
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-xs text-gray-500 mb-5">{description}</p>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            prefix ? "rounded-r-md" : "rounded-md"
          }`}
        />
      </div>
    </div>
  );
}
