// app/admin/peer/page.tsx – Peer CRUD (with framer-motion + refined form/list UI)
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Peer } from "@/types/peer";
import storage from "@/firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

const roles: Peer["role"][] = ["Postdoctoral Researcher", "Ph.D Course", "Master Course"];

function parseInterests(raw: string): string[] {
  return raw
    .split(/\r?\n|;|•/g)
    .map((s) => s.replace(/^\s*\d+\.?\s*/, ""))
    .map((s) => s.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}


export default function AdminPeer() {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<number>(Date.now()); // re-mount to reset
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [interestsInput, setInterestsInput] = useState("");
  const [form, setForm] = useState<Partial<Peer>>({
    name: "",
    role: roles[2],
    isAlumni: true,
    interests: [],
  });

  const filePreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);

  async function load() {
    const res = await fetch("/api/peer", { cache: "no-store" });
    setPeers(await res.json());
  }
  useEffect(() => {
    load();
  }, []);

  async function create() {
    setSaving(true);
    try {
      let photoUrl: string | undefined;

      if (!form.isAlumni && file) {
        const tempId = crypto.randomUUID();
        const storageRef = ref(storage, `peers/${tempId}-${file.name}`);
        await uploadBytes(storageRef, file);
        photoUrl = await getDownloadURL(storageRef);

        await fetch("/api/peer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: tempId,
            ...form,
            interests: form.interests ?? parseInterests(interestsInput),
            photoUrl,
          }),
        });
      } else {
        await fetch("/api/peer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            interests: form.interests ?? parseInterests(interestsInput),
          }),
        });
      }

      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm({ name: "", role: roles[2], isAlumni: true, interests: [] });
    setInterestsInput("");
    setFile(null);
    setFileKey(Date.now());
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/peer/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        alert(`삭제 실패: ${msg?.error ?? res.statusText}`);
        return;
      }
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        className="flex items-end justify-between"
      >
        <motion.div >
          <h1 className="text-3xl font-bold tracking-tight">Peers</h1>
          <p className="text-[13px] text-gray-500 mt-1">
            현재 멤버/Alumni를 추가·관리합니다.
          </p>
        </motion.div>
        <motion.div  className="flex gap-2">
          <button className="btn btn-primary btn-sm md:btn-md" onClick={create} disabled={saving}>
            {saving ? "Saving..." : "Add Peer"}
          </button>
          <button className="btn btn-sm md:btn-md" type="button" onClick={resetForm} disabled={saving}>
            Reset
          </button>
        </motion.div>
      </motion.div>

      {/* Form Card */}
      <motion.section
        initial="hidden"
        animate="show"
        className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl border border-gray-200/40"
      >
        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
          {/* Name */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Name</span>
            </label>
            <input
              className="input mx-2 input-bordered text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Alice Kim"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <span className="label-text-alt text-[11px] text-gray-400 mt-1">영문/한글 모두 가능</span>
          </div>

          {/* Role */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Role</span>
            </label>
            <select
              className="select mx-2 select-bordered text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.role as string}
              onChange={(e) => setForm({ ...form, role: e.target.value as Peer["role"] })}
            >
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Alumni toggle */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Status</span>
            </label>
            <label className="flex items-center gap-3 px-3 py-2 rounded-xl bg-base-100 border">
              <input
                type="checkbox"
                className="toggle  mx-2 toggle-primary"
                checked={!!form.isAlumni}
                onChange={(e) => {
                  const isAlumni = e.target.checked;
                  setForm({
                    ...form,
                    isAlumni,
                    ...(isAlumni ? { email: undefined, interests: [] } : {}),
                  });
                  if (isAlumni) {
                    setInterestsInput("");
                    setFile(null);
                    setFileKey(Date.now());
                  }
                }}
              />
              <span className="text-sm">{form.isAlumni ? "Alumni" : "Current Member"}</span>
            </label>
          </div>

          {/* Current member fields */}
          {!form.isAlumni ? (
            <>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Email</span>
                </label>
                <input
                  className="input input-bordered  mx-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="name@domain.com"
                  value={form.email ?? ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Interests</span>
                </label>
                <textarea
                  className="textarea mx-2 textarea-bordered min-h-[120px] text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder={`한 줄에 하나씩 입력하거나 ; 로 구분하세요\n예)\n1. CO, CO2 Hydrogenation/Dimethyl ether conversion to Aromatics\n2. Zeolite synthesis\n3. bifunctional catalysis`}
                  value={interestsInput}
                  onChange={(e) => {
                    setInterestsInput(e.target.value);
                    setForm({ ...form, interests: parseInterests(e.target.value) });
                  }}
                />
                <div className="mt-1 text-[11px] text-gray-400">
                  예: “CO2 Hydrogenation; Zeolite synthesis; Bifunctional catalysis”
                </div>
              </div>

              {/* Upload with preview */}
              <div className="md:col-span-3">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Profile Photo</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    key={fileKey}
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered file-input-sm md:file-input-md"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  {filePreview && (
                    <img
                      src={filePreview}
                      alt="preview"
                      className="w-16 h-16 rounded-full object-cover shadow"
                    />
                  )}
                </div>
                <div className="mt-1 text-[11px] text-gray-400">권장: 정사각형 · 1MB 이하</div>
              </div>
            </>
          ) : (
            // Alumni fields
            <>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Graduation Year</span>
                </label>
                <input
                  className="input input-bordered text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="YYYY"
                  value={form.graduationYear ?? ""}
                  onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })}
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Current Position</span>
                </label>
                <input
                  className="input input-bordered text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Company / Institute"
                  value={form.currentPosition ?? ""}
                  onChange={(e) => setForm({ ...form, currentPosition: e.target.value })}
                />
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* List */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {peers.map((p) => (
          <motion.div
            key={p.id}
            className="group rounded-3xl bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl border border-gray-200/40 transition-all hover:-translate-y-0.5"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                {!p.isAlumni && p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200" />
                )}
                <div>
                  <h3 className="text-base md:text-lg font-semibold">{p.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {p.role} {p.isAlumni && "· Alumni"}
                  </p>
                </div>
              </div>

              {!p.isAlumni ? (
                <div className="mt-4 space-y-2">
                  {p.email && <p className="text-sm text-gray-600">{p.email}</p>}
                  {!!p.interests?.length && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {p.interests.map((i) => (
                        <span
                          key={i}
                          className="text-[11px] md:text-xs px-2 py-[3px] rounded-md border border-slate-200/70
                                     bg-slate-50 text-slate-600 normal-case whitespace-normal h-auto leading-snug
                                     break-words max-w-[220px] text-left"
                          title={i}
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-4">
                  {p.graduationYear} · {p.currentPosition}
                </p>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => remove(p.id!)}
                  disabled={deletingId === p.id}
                >
                  {deletingId === p.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {peers.length === 0 && (
          <motion.div
            className="col-span-full rounded-3xl bg-white/60 backdrop-blur-md border border-gray-200/40 shadow-sm p-8 text-center text-gray-500"
          >
            아직 등록된 Peer가 없습니다. 상단의 <span className="font-medium">Add Peer</span>로 추가하세요.
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}