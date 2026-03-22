import { supabase } from "./supabase";

export interface SiteSettings {
  instagram: string;
  kakaoChannel: string;
  naverBlog: string;
  naverSmartStore: string;
  phone: string;
  email: string;
  businessHours: string;
  brandDescription: string;
}

const defaultSettings: SiteSettings = {
  instagram: "blancbelluno",
  kakaoChannel: "@blancbelluno",
  naverBlog: "",
  naverSmartStore: "https://smartstore.naver.com/blancbelluno",
  phone: "",
  email: "",
  businessHours: "Mon - Fri / 10:00 - 18:00",
  brandDescription:
    "당신의 특별한 날을 더욱 빛나게.\n섬세한 감각으로 빚어내는 프리미엄 파티 스타일링.",
};

export async function getSettings(): Promise<SiteSettings> {
  if (!supabase) return { ...defaultSettings };

  const { data, error } = await supabase
    .from("belluno_settings")
    .select("key, value");

  if (error || !data) {
    console.error("Failed to fetch settings:", error?.message);
    return { ...defaultSettings };
  }

  const settings = { ...defaultSettings };
  for (const row of data) {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = row.value;
    }
  }

  return settings;
}

export async function updateSettings(
  updates: Partial<SiteSettings>
): Promise<SiteSettings> {
  if (!supabase) return { ...defaultSettings, ...updates };

  const entries = Object.entries(updates).filter(
    ([key]) => key in defaultSettings
  );

  for (const [key, value] of entries) {
    await supabase
      .from("belluno_settings")
      .upsert(
        { key, value: value as string, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
  }

  return getSettings();
}
