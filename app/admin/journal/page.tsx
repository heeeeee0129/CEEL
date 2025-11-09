"use client";
import { useEffect, useState } from "react";
import type { Journal } from "@/types/journal";

function isValidUrl(u: string) {
  try { new URL(u); return true; } catch { return false; }
}

export default function AdminJournalPage() {
  const [list, setList] = useState<Journal[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/journal", { cache: "no-store" });
    setList(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!title.trim() || !url.trim()) {
      alert("제목과 링크를 입력하세요.");
      return;
    }
    if (!isValidUrl(url)) {
      alert("올바른 URL을 입력하세요. (예: https://...)");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), url: url.trim() }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        alert(`등록 실패: ${msg?.error ?? res.statusText}`);
        return;
      }
      setTitle("");
      setUrl("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
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
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Manage Journals</h1>

      {/* 입력 카드 */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur shadow-sm">
        <div className="p-5 md:p-6 grid md:grid-cols-3 gap-4">
          <input
            className="input input-bordered w-full"
            placeholder="페이지명 (예: Nature Energy, 2024)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input input-bordered w-full md:col-span-2"
            placeholder="링크 (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="md:col-span-3">
            <button className="btn btn-primary" onClick={create} disabled={saving}>
              {saving ? "Saving..." : "Add Journal"}
            </button>
          </div>
        </div>
      </div>

      {/* 리스트 */}
      <ul className="grid md:grid-cols-2 gap-4 md:gap-6">
        {list.map((j) => (
          <li key={j.id} className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-900">{j.title}</div>
                <a href={j.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 underline underline-offset-4">
                  {j.url}
                </a>
              </div>
              <button
                className="btn btn-error btn-sm"
                onClick={() => remove(j.id)}
                disabled={deleting === j.id}
              >
                {deleting === j.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}