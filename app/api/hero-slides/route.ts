import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import {
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from "@/lib/hero-slides";

export async function GET() {
  const items = await getHeroSlides();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `hero-${uuidv4()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("belluno-uploads")
    .upload(filename, bytes, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json(
      { error: "Upload failed: " + uploadError.message },
      { status: 500 }
    );
  }

  const item = await addHeroSlide({
    id: uuidv4(),
    filename,
    originalName: file.name,
    objectPosition: "center center",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, objectPosition } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const item = await updateHeroSlide(id, {
    object_position: objectPosition || "center center",
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const success = await deleteHeroSlide(id);
  if (!success) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const { orderedIds } = await request.json();
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const items = await reorderHeroSlides(orderedIds);
  return NextResponse.json(items);
}
