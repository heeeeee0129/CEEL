// app/gallery/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryItem, GalleryCategory } from "../../types/gallery";
import { GalleryCard } from "../../components/GalleryCard";

const PRESET_CATEGORIES: GalleryCategory[] = [
  "Lab Dining",
  "Vacation Trip",
  "Membership Training",
  "Celebration",
  "Conferences",
  "Meeting",
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GalleryCategory | "All">("All");

  // 데이터 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        const data: GalleryItem[] = await res.json();
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 실제 존재하는 카테고리(데이터 기반) + 프리셋 병합
  const categories = useMemo(() => {
    const fromData = new Set<GalleryCategory>();
    for (const it of items) {
      for (const c of it.categories ?? []) fromData.add(c as GalleryCategory);
    }
    // 프리셋 우선 노출 + 데이터상 추가 카테고리 뒤에 합치기
    const extra = [...fromData].filter((c) => !PRESET_CATEGORIES.includes(c));
    return [...PRESET_CATEGORIES, ...extra];
  }, [items]);

  // 카운트 계산 (UX용)
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      for (const c of it.categories ?? []) {
        map.set(c, (map.get(c) ?? 0) + 1);
      }
    }
    return map;
  }, [items]);

  // 필터 + 검색
  const filtered = useMemo(() => {
    let arr = items;
    if (cat !== "All") {
      arr = arr.filter((i) => (i.categories ?? []).includes(cat as GalleryCategory));
    }
    if (q.trim()) {
      const key = q.trim().toLowerCase();
      arr = arr.filter(
        (i) =>
          i.title.toLowerCase().includes(key) ||
          (i.author?.toLowerCase().includes(key) ?? false) ||
          (i.categories ?? []).some((c) => c.toLowerCase().includes(key))
      );
    }
    return arr;
  }, [items, q, cat]);

  // 카드에서 해시태그 클릭 시 바로 필터링
  function handleTagClick(tag: string) {
    setCat(tag as GalleryCategory);
  }

  return (
    <div className="space-y-7 md:space-y-8">
      {/* 헤더 */}
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Gallery</h1>
        
      </header>

      {/* 필터 바 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* 카테고리 탭 */}
        <div className="overflow-x-auto px-3 py-1">
          <ul className="flex w-max gap-2 rounded-full bg-white/80 p-1 ring-1 ring-slate-200/70 backdrop-blur shadow-sm">
            <li>
              <button
                onClick={() => setCat("All")}
                className={[
                  "rounded-full px-3 py-1.5 text-xs md:text-[13px] font-medium transition",
                  cat === "All"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                All
                <span className="ml-1 text-[11px] opacity-70">({items.length})</span>
              </button>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setCat(c)}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs md:text-[13px] font-medium transition",
                    cat === c ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  #{c}
                  <span className="ml-1 text-[11px] opacity-70">
                    ({counts.get(c) ?? 0})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

   
      </div>

     

      {/* 리스트 */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/70 bg-white/60 p-10 text-center">
          <p className="text-sm text-slate-600">
            조건에 맞는 결과가 없습니다. 필터나 검색어를 조정해 보세요.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <GalleryCard key={it.id} item={it} onTagClick={handleTagClick} />
          ))}
        </div>
      )}
    </div>
  );
}