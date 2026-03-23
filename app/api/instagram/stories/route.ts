import { NextResponse } from "next/server";
import { getInstagramStories } from "@/lib/instagram";

export async function GET() {
  const stories = await getInstagramStories();
  return NextResponse.json({ stories });
}
