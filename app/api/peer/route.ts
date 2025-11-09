export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { Peer } from "@/types/peer";
import { adb } from "@/firebase/firebaseAdmin";

const col = () => adb.collection("peers");
type FirePeer = Omit<Peer, "id">;

export async function GET() {
  const snap = await col().orderBy("name").get();
  const data: Peer[] = snap.docs.map((d) => {
    const doc = d.data() as FirePeer;
    return { id: d.id, ...doc };
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Peer>;
  const now = new Date();

  if (body.id) {
    const { id, ...rest } = body;
    await col().doc(id!).set({ ...(rest as FirePeer), updatedAt: now }, { merge: true });
    return NextResponse.json({ id }, { status: 201 });
  } else {
    const { id: _omit, ...rest } = body;
    const ref = await col().add({ ...(rest as FirePeer), createdAt: now, updatedAt: now });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  }
}