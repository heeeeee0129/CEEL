// app/api/gallery/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adb } from "@/firebase/firebaseAdmin";

export const runtime = "nodejs";

const col = () => adb.collection("gallery");

// Turbopack/validator가 기대하는 시그니처: params 는 Promise<{id:string}>
type ParamCtx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: ParamCtx) {
  try {
    const { id } = await params;                // ← 반드시 await
    const docId = decodeURIComponent(id);

    const body = await req.json();              // 부분 업데이트 허용
    await col().doc(docId).set(
      { ...body, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    const snap = await col().doc(docId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("PATCH /api/gallery/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: ParamCtx) {
  try {
    const { id } = await params;                // ← 반드시 await
    const docId = decodeURIComponent(id);

    const ref = col().doc(docId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    await ref.delete();
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("DELETE /api/gallery/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}