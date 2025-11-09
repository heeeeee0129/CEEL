// app/publication/page.tsx – Journal 목록 (formatting + header CTA)
import type { Journal } from "@/types/journal";
import { headers } from "next/headers";

// 개발 중 캐시 꼬임 방지
export const dynamic = "force-dynamic";

async function fetchJournals(): Promise<Journal[]> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const base = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_BASE_URL;
  const url = `${base}/api/journal`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/** 예) 
 *  "Yong Min Park, Byeong Gi Kim, Jong Wook Bae, Chan-Hwa Chung, "Ordered ...", Fuel, 20230701, ISSN:0016-2361"
 *   + url: "https://doi.org/10.1016/j.fuel.2023.127943"
 */
function parseCitation(raw: string) {
  // 1) 제목은 큰따옴표 안에 있다고 가정 (없으면 전체를 제목으로)
  const titleMatch = raw.match(/"([^"]+)"/);
  const title = titleMatch ? titleMatch[1].trim() : raw.trim();

  // 2) 저자: 첫 번째 큰따옴표 이전 부분(있으면)
  const beforeTitle = titleMatch ? raw.slice(0, titleMatch.index).trim() : "";
  const authors = beforeTitle
    ? beforeTitle.replace(/[,\s]+$/, "").trim()
    : undefined;

  // 3) 제목 이후: 저널/연도/ISSN 추출 시도
  const afterTitle = titleMatch
    ? raw.slice(titleMatch.index! + titleMatch[0].length).trim()
    : "";

  // 저널은 첫 번째 콤마 전후로 뽑기
  let journal: string | undefined;
  let rest = afterTitle;
  if (afterTitle) {
    const firstComma = afterTitle.indexOf(",");
    if (firstComma >= 0) {
      journal = afterTitle.slice(0, firstComma).trim();
      rest = afterTitle.slice(firstComma + 1).trim();
    }
  }

  // 날짜(YYYYMMDD) 후보 찾기
  let dateRaw: string | undefined;
  const dateMatch = rest.match(/\b(\d{8})\b/);
  if (dateMatch) {
    dateRaw = dateMatch[1];
  }

  // ISSN
  let issn: string | undefined;
  const issnMatch = rest.match(/\bISSN[:\s]*([0-9X\-]+)\b/i);
  if (issnMatch) issn = issnMatch[1];

  // 보기 좋은 날짜 포맷
  function formatDate8(s?: string) {
    if (!s || s.length !== 8) return undefined;
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    return `${y}-${m}-${d}`;
  }

  return {
    title,
    authors,
    journal,
    date: formatDate8(dateRaw), // 없으면 undefined
    issn,
  };
}

function getDateKeyFromTitle(raw: string): number {
  // 우선 큰따옴표 이후의 나머지에서도 찾지만, 통일성을 위해 전체에서 8자리 날짜를 찾음
  const m = raw.match(/\b(\d{8})\b/);
  if (!m) return 0;
  // yyyymmdd 형태를 정수로 변환 (정렬용)
  return Number(m[1]);
}

export default async function PublicationPage() {
  const journals = await fetchJournals();
  // 논문 제목 내 8자리 날짜(YYYYMMDD)를 기준으로 최신순 정렬
  const sorted = [...journals].sort((a, b) => getDateKeyFromTitle(b.title) - getDateKeyFromTitle(a.title));
  const latest = sorted[0];

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <header className="rounded-3xl  bg-white/90 backdrop-blur p-6 md:p-8 ">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Our Journal List
            </h1>
           
          </div>

        </div>
      </header>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur p-6 text-slate-600">
          등록된 저널이 없습니다.
        </div>
      ) : (
        <ul className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {sorted.map((j) => {
            const p = parseCitation(j.title ?? "");
            return (
              <li
                key={j.id}
                className="group rounded-2xl border border-slate-200/70 bg-white/85 backdrop-blur p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="space-y-2">
                  {/* 제목 */}
                  <a
                    href={j.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-[15px] md:text-[16px] font-semibold text-slate-900 group-hover:underline underline-offset-4">
                      {p.title || j.title}
                    </h3>
                  </a>

                  {/* 저자 */}
                  {p.authors && (
                    <div className="text-xs md:text-[13px] text-slate-600">
                      {p.authors}
                    </div>
                  )}

                  {/* 메타: 저널 · 날짜 · ISSN */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs text-slate-500">
                    {p.journal && (
                      <span className="italic text-slate-700">{p.journal}</span>
                    )}
                    {p.date && (
                      <>
                        <span className="opacity-40">•</span>
                        <span>{p.date}</span>
                      </>
                    )}
                    {p.issn && (
                      <>
                        <span className="opacity-40">•</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] tracking-wide border border-slate-200">
                            ISSN
                          </span>
                          <span>{p.issn}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* 하단 링크 */}
                  <div className="pt-1">
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-700 hover:text-slate-900"
                    >
                      <span>View Link</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M14 3h7v7h-2V6.41l-9.29 9.3l-1.42-1.42l9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}