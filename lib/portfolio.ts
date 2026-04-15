import { supabase, getStorageUrl } from "./supabase";

export const CATEGORIES = [
  "WEDDING",
  "BABY SHOWER",
  "PARTY",
  "CORPORATE",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface PortfolioItem {
  id: string;
  filename: string;
  originalName: string;
  order: number;
  category: Category;
  title: string;
  tag: string;
  linkUrl: string;
  createdAt: string;
  imageUrl: string;
}

interface PortfolioRow {
  id: string;
  filename: string;
  original_name: string;
  sort_order: number;
  category: string;
  title: string;
  tag: string;
  link_url: string | null;
  created_at: string;
}

function toPortfolioItem(row: PortfolioRow): PortfolioItem {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    order: row.sort_order,
    category: row.category as Category,
    title: row.title,
    tag: row.tag,
    linkUrl: row.link_url || "",
    createdAt: row.created_at,
    imageUrl: getStorageUrl(row.filename),
  };
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("belluno_portfolio")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch portfolio:", error.message);
    return [];
  }

  return (data as PortfolioRow[]).map(toPortfolioItem);
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, "order" | "imageUrl">
): Promise<PortfolioItem | null> {
  if (!supabase) return null;

  // 현재 최대 sort_order 조회
  const { data: maxRow } = await supabase
    .from("belluno_portfolio")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = maxRow ? maxRow.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("belluno_portfolio")
    .insert({
      id: item.id,
      filename: item.filename,
      original_name: item.originalName,
      sort_order: nextOrder,
      category: item.category,
      title: item.title,
      tag: item.tag,
      link_url: item.linkUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add portfolio item:", error.message);
    return null;
  }

  return toPortfolioItem(data as PortfolioRow);
}

export async function updatePortfolioItem(
  id: string,
  updates: Partial<Pick<PortfolioItem, "category" | "title" | "tag" | "linkUrl">>
): Promise<PortfolioItem | null> {
  if (!supabase) return null;

  const dbUpdates: Record<string, string | null> = {};
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
  if (updates.linkUrl !== undefined) dbUpdates.link_url = updates.linkUrl || null;

  const { data, error } = await supabase
    .from("belluno_portfolio")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update portfolio item:", error.message);
    return null;
  }

  return toPortfolioItem(data as PortfolioRow);
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  if (!supabase) return false;

  // 파일명 조회 (Storage 삭제용)
  const { data: item } = await supabase
    .from("belluno_portfolio")
    .select("filename")
    .eq("id", id)
    .single();

  if (!item) return false;

  // Storage에서 이미지 삭제
  await supabase.storage.from("belluno-uploads").remove([item.filename]);

  // DB에서 삭제
  const { error } = await supabase
    .from("belluno_portfolio")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete portfolio item:", error.message);
    return false;
  }

  // sort_order 재정렬
  const { data: remaining } = await supabase
    .from("belluno_portfolio")
    .select("id")
    .order("sort_order", { ascending: true });

  if (remaining) {
    for (let i = 0; i < remaining.length; i++) {
      await supabase
        .from("belluno_portfolio")
        .update({ sort_order: i })
        .eq("id", remaining[i].id);
    }
  }

  return true;
}

export async function reorderPortfolioItems(
  orderedIds: string[]
): Promise<PortfolioItem[]> {
  if (!supabase) return [];

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("belluno_portfolio")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
  }

  return getPortfolioItems();
}
