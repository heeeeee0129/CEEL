// app/api/journals/[id]/route.ts  (경로 확인: journals 또는 journal 컬렉션/폴더명에 맞추세요)
import { NextRequest, NextResponse } from "next/server";
import { adb } from "@/firebase/firebaseAdmin";

export const runtime = "nodejs";

const col = () => adb.collection("journals");

// DELETE /api/journals/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;               // ✅ 반드시 await
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
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// (선택) PATCH도 같은 시그니처를 사용해야 합니다.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;               // ✅ 반드시 await
    const docId = decodeURIComponent(id);

    const body = await req.json();
    await col().doc(docId).set({ ...body, updatedAt: new Date().toISOString() }, { merge: true });

    const updated = await col().doc(docId).get();
    if (!updated.exists) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}