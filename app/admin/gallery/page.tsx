// app/admin/gallery/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryItem, GalleryCategory } from "@/types/gallery";
import storage from "@/firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CATS: GalleryCategory[] = [
  "Lab Dining",
  "Vacation Trip",
  "Membership Training",
  "Celebration",
  "Conferences",
  "Meeting",
];

function parseCategories(raw: string): GalleryCategory[] {
  // "#Lab Dining, Meeting" / "Lab Dining;Meeting" / 줄바꿈 등 → 토큰화
  const tokens = raw
    .split(/[#,\n;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  // 정의된 카테고리만 허용
  const set = new Set<GalleryCategory>();
  for (const t of tokens) {
    const hit = CATS.find((c) => c.toLowerCase() === t.toLowerCase());
    if (hit) set.add(hit);
  }
  return Array.from(set);
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileKey, setFileKey] = useState<number>(Date.now());

  // 폼 상태
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [author, setAuthor] = useState("");
  const [catsInput, setCatsInput] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/gallery", { cache: "no-store" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("GET /api/gallery failed:", res.status, err);
        return;
      }
      setItems(await res.json());
    } catch (e) {
      console.error("GET /api/gallery error:", e);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const formValid = useMemo(() => title.trim() && date.trim(), [title, date]);

  async function create() {
    if (!formValid) return;
    setSaving(true);
    try {
      const tempId = crypto.randomUUID();
      const uploaded: string[] = [];

      if (files && files.length > 0) {
        for (const f of Array.from(files)) {
          const r = ref(storage, `gallery/${tempId}/${f.name}`);
          await uploadBytes(r, f);
          uploaded.push(await getDownloadURL(r));
        }
      }

      const body: Partial<GalleryItem> = {
        id: tempId,
        title: title.trim(),
        date,
        author: author.trim() || undefined,
        categories: parseCategories(catsInput),
        photos: uploaded,
      };
      console.log(body);

      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // reset
      setTitle("");
      setDate("");
      setAuthor("");
      setCatsInput("");
      setFiles(null);
      setFileKey(Date.now());

      await load();
    } finally {
      setSaving(false);
    }
  }

// app/admin/gallery/page.tsx
async function remove(id: string) {
  setDeleting(id);
  try {
    const res = await fetch(`/api/gallery/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      alert(`삭제 실패: ${msg?.error ?? res.statusText}`);
      return;
    }
    await load();
  } finally {
    setDeleting(null);
  }
}

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Admin · Gallery</h1>
      </header>

      {/* 작성 폼 */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="grid gap-4 p-5 md:grid-cols-3">
          <input
            className="input-bordered w-full rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="input-bordered w-full rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            className="input-bordered w-full rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Author (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <textarea
            className="md:col-span-2 min-h-[88px] w-full rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
            placeholder={`#Lab Dining, #Meeting 또는 "Lab Dining;Meeting" 처럼 입력`}
            value={catsInput}
            onChange={(e) => setCatsInput(e.target.value)}
          />

          <input
            key={fileKey}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="md:col-span-1 w-full rounded-xl border border-slate-300/80 bg-white/80 px-3 py-2 text-sm shadow-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white file:text-sm hover:file:opacity-90"
          />
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200/70 p-4">
          <button
            onClick={create}
            disabled={saving || !formValid}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDate("");
              setAuthor("");
              setCatsInput("");
              setFiles(null);
              setFileKey(Date.now());
            }}
            className="rounded-lg border border-slate-300/80 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <div key={g.id} className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-100">
              {g.photos?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.photos[0]} alt={g.title} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">{g.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{g.date}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(g.categories ?? []).map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                  >
                    #{c}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => remove(g.id)}
                  disabled={deleting === g.id}
                  className="rounded-lg border border-red-300/70 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === g.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}