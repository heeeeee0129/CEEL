// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { adb } from "@/firebase/firebaseAdmin";
import type { GalleryItem } from "@/types/gallery";

export const runtime = "nodejs";

const col = () => adb.collection("gallery");

// Firestore에는 createdAt/updatedAt을 ISO string으로 저장
type FireGallery = Omit<GalleryItem, "id">;

export async function GET() {
  // 날짜 내림차순 정렬 (YYYY-MM-DD 문자열 기준)
  const snap = await col().orderBy("date").get();
  const data: GalleryItem[] = snap.docs.map((d) => {
    const doc = d.data() as FireGallery;
    return { id: d.id, ...doc };
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<GalleryItem>;
  const now = new Date();

  if (!body.title || !body.date) {
    return NextResponse.json({ error: "title/date required" }, { status: 400 });
  }
  // app/api/gallery/route.ts (POST 내부)
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(body.date ?? "");
  if (!isValidDate) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  // id 있으면 merge 업데이트, 없으면 새로 생성
  if (body.id) {
    const { id, ...rest } = body;
    await col()
      .doc(id!)
      .set(
        {
          ...(rest as FireGallery),
          updatedAt: now,
        },
        { merge: true }
      );
    return NextResponse.json({ id }, { status: 201 });
  } else {
    const { id: _omit, ...rest } = body;
    const ref = await col().add({
      ...(rest as FireGallery),
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  }
}