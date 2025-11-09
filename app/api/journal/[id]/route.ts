import { NextResponse } from "next/server";
import { adb } from "@/firebase/firebaseAdmin";

const col = () => adb.collection("journals");

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const ref = col().doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    await ref.delete();
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}