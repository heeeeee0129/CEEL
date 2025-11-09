import { NextResponse } from "next/server";
import type { Journal } from "@/types/journal";
import { adb } from "@/firebase/firebaseAdmin";

const col = () => adb.collection("journals");

type FireJournal = Omit<Journal, "id">;

export async function GET() {
  const snap = await col().orderBy("createdAt", "desc").get();
  const data: Journal[] = snap.docs.map(d => {
    const doc = d.data() as FireJournal;
    return { id: d.id, ...doc };
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Journal>;
  const now = Date.now();

  // 간단 검증
  if (!body.title || !body.url) {
    return NextResponse.json({ error: "title, url은 필수입니다." }, { status: 400 });
  }
  try {
    if (body.id) {
      const { id, ...rest } = body;
      await col().doc(id!).set({ ...(rest as Partial<FireJournal>), updatedAt: now }, { merge: true });
      return NextResponse.json({ id }, { status: 201 });
    } else {
      const { id: _omit, ...rest } = body;
      const doc = await col().add({ ...(rest as FireJournal), createdAt: now, updatedAt: now });
      return NextResponse.json({ id: doc.id }, { status: 201 });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}