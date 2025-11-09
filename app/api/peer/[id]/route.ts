// app/api/peer/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import type { Peer } from "@/types/peer";
import { adb } from "@/firebase/firebaseAdmin";

const col = () => adb.collection("peers");
type FirePeer = Omit<Peer, "id">;

// 공통: params가 비면 URL에서 마지막 세그먼트로 폴백
function getId(req: NextRequest, ctx?: { params?: { id?: string } }): string | null {
  const fromParams = ctx?.params?.id;
  if (fromParams) return fromParams;
  try {
    const url = new URL(req.url);
    const segs = url.pathname.split("/").filter(Boolean);
    return segs[segs.length - 1] ?? null; // /api/peer/:id
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest, ctx: { params?: { id?: string } }) {
  try {
    const id = getId(req, ctx);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = (await req.json()) as Partial<Peer>;
    await col().doc(id).set({ ...(body as FirePeer), updatedAt: new Date() }, { merge: true });

    const snap = await col().doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json({ id: snap.id, ...(snap.data() as FirePeer) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("PATCH /api/peer/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params?: { id?: string } }) {
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
    console.error("DELETE /api/peer/[id] error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}