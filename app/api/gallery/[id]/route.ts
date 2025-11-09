// app/api/gallery/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { adb } from "@/firebase/firebaseAdmin";
import { GalleryItem } from "@/types/gallery";

export const runtime = "nodejs";

const col = () => adb.collection("gallery");
type FireGallery = Omit<GalleryItem, "id">;

function getId(req: NextRequest, ctx?: { params?: Record<string, string> }): string | null {
  const fromParams = ctx?.params?.id;
  if (fromParams) {
    // Be tolerant: id | docId | slug
    return fromParams;
  }
  try {
    const url = new URL(req.url);
    const segs = url.pathname.split("/").filter(Boolean);
    return segs[segs.length - 1] ?? null; // /api/gallery/:id
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest, ctx: { params?: {id?: string} }) {
  try {
    const id = getId(req, ctx);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = (await req.json()) as Partial<GalleryItem>;
    await col().doc(id).set({ ...(body as FireGallery), updatedAt: new Date() }, { merge: true });
    const snap = await col().doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ id: snap.id, ...(snap.data() as FireGallery) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("PATCH /api/gallery/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
} 

export async function DELETE(req: NextRequest, ctx: { params?: {id?: string} }) {
  try {
    const id = getId(req, ctx);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const docRef = col().doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    await docRef.delete();
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("DELETE /api/gallery/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}