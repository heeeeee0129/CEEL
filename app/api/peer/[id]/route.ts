// app/api/peer/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import type { Peer } from "@/types/peer";
import { adb } from "@/firebase/firebaseAdmin";

const col = () => adb.collection("peers");
type FirePeer = Omit<Peer, "id">;

// PATCH /api/peer/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;                       // ✅ 반드시 await
    const docId = decodeURIComponent(id);

    const body = (await req.json()) as Partial<Peer>;
    await col().doc(docId).set(
      { ...(body as FirePeer), updatedAt: new Date().toISOString() },
      { merge: true }
    );

    const snap = await col().doc(docId).get();
    if (!snap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ id: snap.id, ...(snap.data() as FirePeer) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("PATCH /api/peer/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/peer/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;                       // ✅ 반드시 await
    const docId = decodeURIComponent(id);

    const ref = col().doc(docId);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    await ref.delete();
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("DELETE /api/peer/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}