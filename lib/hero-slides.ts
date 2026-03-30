import { supabase, getStorageUrl } from "./supabase";

export interface HeroSlide {
  id: string;
  filename: string;
  originalName: string;
  order: number;
  objectPosition: string;
  createdAt: string;
  imageUrl: string;
}

interface HeroSlideRow {
  id: string;
  filename: string;
  original_name: string;
  sort_order: number;
  object_position: string;
  created_at: string;
}

function toHeroSlide(row: HeroSlideRow): HeroSlide {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    order: row.sort_order,
    objectPosition: row.object_position,
    createdAt: row.created_at,
    imageUrl: getStorageUrl(row.filename),
  };
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("belluno_hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch hero slides:", error.message);
    return [];
  }

  return (data as HeroSlideRow[]).map(toHeroSlide);
}

export async function addHeroSlide(
  item: Omit<HeroSlide, "order" | "imageUrl">
): Promise<HeroSlide | null> {
  if (!supabase) return null;

  const { data: maxRow } = await supabase
    .from("belluno_hero_slides")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = maxRow ? maxRow.sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("belluno_hero_slides")
    .insert({
      id: item.id,
      filename: item.filename,
      original_name: item.originalName,
      sort_order: nextOrder,
      object_position: item.objectPosition,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add hero slide:", error.message);
    return null;
  }

  return toHeroSlide(data as HeroSlideRow);
}

export async function updateHeroSlide(
  id: string,
  updates: { object_position: string }
): Promise<HeroSlide | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("belluno_hero_slides")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update hero slide:", error.message);
    return null;
  }

  return toHeroSlide(data as HeroSlideRow);
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { data: item } = await supabase
    .from("belluno_hero_slides")
    .select("filename")
    .eq("id", id)
    .single();

  if (!item) return false;

  await supabase.storage.from("belluno-uploads").remove([item.filename]);

  const { error } = await supabase
    .from("belluno_hero_slides")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete hero slide:", error.message);
    return false;
  }

  const { data: remaining } = await supabase
    .from("belluno_hero_slides")
    .select("id")
    .order("sort_order", { ascending: true });

  if (remaining) {
    for (let i = 0; i < remaining.length; i++) {
      await supabase
        .from("belluno_hero_slides")
        .update({ sort_order: i })
        .eq("id", remaining[i].id);
    }
  }

  return true;
}

export async function reorderHeroSlides(
  orderedIds: string[]
): Promise<HeroSlide[]> {
  if (!supabase) return [];

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("belluno_hero_slides")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
  }

  return getHeroSlides();
}
