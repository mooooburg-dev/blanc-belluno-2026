export interface InstagramPost {
  id: string;
  caption?: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
}

const INSTAGRAM_GRAPH_API = "https://graph.instagram.com";

export async function getInstagramFeed(
  count: number = 6
): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn("INSTAGRAM_ACCESS_TOKEN이 설정되지 않았습니다.");
    return [];
  }

  try {
    const fields = "id,caption,media_url,thumbnail_url,permalink,media_type,timestamp";
    const url = `${INSTAGRAM_GRAPH_API}/me/media?fields=${fields}&limit=${count}&access_token=${accessToken}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Instagram API 에러:", error);
      return [];
    }

    const data = await res.json();

    return (data.data || []).map(
      (post: Record<string, string>): InstagramPost => ({
        id: post.id,
        caption: post.caption,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        permalink: post.permalink,
        mediaType: post.media_type as InstagramPost["mediaType"],
        timestamp: post.timestamp,
      })
    );
  } catch (error) {
    console.error("Instagram 피드 가져오기 실패:", error);
    return [];
  }
}

export interface InstagramStory {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  timestamp: string;
}

export async function getInstagramStories(): Promise<InstagramStory[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn("INSTAGRAM_ACCESS_TOKEN이 설정되지 않았습니다.");
    return [];
  }

  try {
    // 1. 사용자 ID 가져오기
    const meRes = await fetch(
      `${INSTAGRAM_GRAPH_API}/me?fields=id&access_token=${accessToken}`,
      { next: { revalidate: 3600 } }
    );
    if (!meRes.ok) return [];
    const meData = await meRes.json();
    const userId = meData.id;

    // 2. 스토리 목록 가져오기
    const storiesRes = await fetch(
      `${INSTAGRAM_GRAPH_API}/${userId}/stories?fields=id,media_url,media_type,timestamp&access_token=${accessToken}`,
      { next: { revalidate: 300 } }
    );

    if (!storiesRes.ok) {
      const error = await storiesRes.json().catch(() => ({}));
      console.error("Instagram Stories API 에러:", error);
      return [];
    }

    const data = await storiesRes.json();

    return (data.data || []).map(
      (story: Record<string, string>): InstagramStory => ({
        id: story.id,
        mediaUrl: story.media_url,
        mediaType: story.media_type as InstagramStory["mediaType"],
        timestamp: story.timestamp,
      })
    );
  } catch (error) {
    console.error("Instagram 스토리 가져오기 실패:", error);
    return [];
  }
}

/**
 * 장기 토큰 갱신 (60일마다 필요)
 * 크론잡이나 수동으로 호출
 */
export async function refreshLongLivedToken(): Promise<string | null> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) return null;

  try {
    const url = `${INSTAGRAM_GRAPH_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;
    const res = await fetch(url);

    if (!res.ok) return null;

    const data = await res.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}
