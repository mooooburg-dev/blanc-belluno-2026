"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

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
  linkUrl: string;
  imageUrl: string;
}

interface SortableItemProps {
  item: PortfolioItem;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<PortfolioItem, "category" | "title" | "tag" | "linkUrl">>
  ) => void;
}

export default function SortableItem({
  item,
  onDelete,
  onUpdate,
}: SortableItemProps) {
  const [editing, setEditing] = useState(false);
  const [editCategory, setEditCategory] = useState<Category>(item.category);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editTag, setEditTag] = useState(item.tag);
  const [editLinkUrl, setEditLinkUrl] = useState(item.linkUrl);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(item.id, {
      category: editCategory,
      title: editTitle,
      tag: editTag,
      linkUrl: editLinkUrl,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditCategory(item.category);
    setEditTitle(item.title);
    setEditTag(item.tag);
    setEditLinkUrl(item.linkUrl);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden bg-white shadow-sm border border-stone-200 transition-shadow hover:shadow-md ${
        isDragging ? "z-50 shadow-xl ring-2 ring-stone-900" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2.5 left-2.5 z-10 cursor-grab active:cursor-grabbing bg-white/90 backdrop-blur text-stone-500 rounded-lg p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* Action buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="bg-white/90 backdrop-blur hover:bg-stone-900 hover:text-white text-stone-500 rounded-lg w-7 h-7 flex items-center justify-center shadow-sm transition-colors"
          title="편집"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-white/90 backdrop-blur hover:bg-red-500 hover:text-white text-stone-500 rounded-lg w-7 h-7 flex items-center justify-center shadow-sm transition-colors"
          title="삭제"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square relative">
        <Image
          src={item.imageUrl}
          alt={item.originalName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
      </div>

      {/* Info / Edit */}
      {editing ? (
        <div className="p-3 flex flex-col gap-2 border-t border-stone-100">
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as Category)}
            className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="제목"
            className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
          />
          <input
            type="text"
            value={editTag}
            onChange={(e) => setEditTag(e.target.value)}
            placeholder="태그"
            className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
          />
          <input
            type="url"
            value={editLinkUrl}
            onChange={(e) => setEditLinkUrl(e.target.value)}
            placeholder="링크 URL (선택)"
            className="w-full border border-stone-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
          />
          <div className="flex gap-1.5">
            <button
              onClick={handleSave}
              className="flex-1 bg-stone-900 text-white text-xs font-medium rounded-lg px-2 py-1.5 hover:bg-stone-800 transition-colors"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-lg px-2 py-1.5 hover:bg-stone-200 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="px-2.5 py-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-block text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md">
              {item.category}
            </span>
            {item.linkUrl && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md"
                title={item.linkUrl}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                링크
              </span>
            )}
          </div>
          <p className="text-xs text-stone-700 truncate">
            {item.title || item.originalName}
          </p>
          {item.tag && (
            <p className="text-[10px] text-stone-400 truncate">{item.tag}</p>
          )}
        </div>
      )}
    </div>
  );
}
