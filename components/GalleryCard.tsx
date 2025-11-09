// components/GalleryCard.tsx
"use client";

import Image from "next/image";
import type { GalleryItem } from "@/types/gallery";

type Props = {
  item: GalleryItem;
  onTagClick?: (tag: string) => void;
};

export function GalleryCard({ item, onTagClick }: Props) {
  const cover = item.photos?.[0];
  const dateLabel = item.date; // 이미 YYYY-MM-DD 포맷

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm transition
                 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* 썸네일 */}
      <div className="relative aspect-[4/3] w-full">
        {cover ? (
          <Image
            src={cover}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100" />
        )}

        {/* 카테고리 뱃지 */}
        <div className="absolute left-2 right-2 top-2 flex flex-wrap gap-1.5">
          {(item.categories ?? []).slice(0, 3).map((c) => (
            <button
              key={c}
              onClick={() => onTagClick?.(c)}
              className="rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm
                         hover:bg-white/95 transition"
              title={`Filter by #${c}`}
            >
              #{c}
            </button>
          ))}
          {(item.categories?.length ?? 0) > 3 && (
            <span className="rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-sm">
              +{(item.categories?.length ?? 0) - 3}
            </span>
          )}
        </div>
      </div>

      {/* 메타 */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">{item.title}</h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span>{dateLabel}</span>
          {item.author && (
            <>
              <span className="opacity-50">·</span>
              <span className="truncate">by {item.author}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}