// app/equipment/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

// ====== 데이터 정의 ======
type EquipItem = {
  name: string;
  maker: string;
  date: string; // YYYY-MM-DD 권장 (표시는 자연어)
  who: "Lab" | "Admin";
  src: string; // /public/images/... 경로
};

type EquipSection = {
  id: string;
  title: string;
  items: EquipItem[];
};

const SECTIONS: EquipSection[] = [
  {
    id: "characterization",
    title: "Catalyst Characterization",
    items: [
      { name: "In situ‑FTIR", maker: "Frontier FTIR (PerkinElmer)", date: "2019-07-24", who: "Lab", src: "/images/equipment/FTIR.jpg" },
      { name: "Physisorption & Chemisorption Analyzer", maker: "ASAP 2020C (Micromeritics)", date: "2019-06-28", who: "Lab", src: "/images/equipment/physis_and_chemis_analy.jpg" },
      { name: "Physisorption Analyzer", maker: "TriStar II 3020 (Micromeritics)", date: "2019-06-12", who: "Lab", src: "/images/equipment/Micromee.jpg" },
      { name: "Thermogravimetric Analyzer", maker: "TGA 55 (TA Instrument)", date: "2019-05-30", who: "Admin", src: "/images/equipment/TGA.jpg" },
      { name: "Temperature‑Programmed Analyzer", maker: "BELCAT II (Microtrac MRB)", date: "2019-04-16", who: "Admin", src: "/images/equipment/belcat-ii.png" },
      { name: "Temperature‑Programmed Analyzer", maker: "BELCAT M (Microtrac MRB)", date: "2019-04-16", who: "Admin", src: "/images/equipment/Micro_MRB.jpg" },
      { name: "Quadrupole Mass Spectrometer", maker: "QMS 220 (Pfeiffer‑Vacuum)", date: "2019-04-16", who: "Admin", src: "/images/equipment/Balzers.jpg" },
      { name: "DRIFT Catalyst Analysis System", maker: "Diffuse Reflectance", date: "2019-04-16", who: "Admin", src: "/images/equipment/Diffuse_reflectance.jpg" },
      { name: "FTIR Spectrometer", maker: "Nicolet iS20 FTIR", date: "2019-04-16", who: "Admin", src: "/images/equipment/FTIR_Spectrometer .jpg" },
    ],
  },
  {
    id: "synthesis",
    title: "Catalyst Synthesis",
    items: [
      { name: "Muffle Furnace", maker: "", date: "2019-07-24", who: "Admin", src: "/images/equipment/Muffle_furnace.jpg" },
      { name: "Forced Convection Oven", maker: "", date: "2019-07-24", who: "Admin", src: "/images/equipment/forced_conve_oven.jpg" },
      { name: "Rotoring Dry Oven", maker: "", date: "2019-06-28", who: "Admin", src: "/images/equipment/Dry_oven.jpg" },
      { name: "Annealing Tube Furnace", maker: "", date: "2019-06-28", who: "Admin", src: "/images/equipment/Anneal_tube.jpg" },
      { name: "Temperature & Humidity Chamber", maker: "NEX‑505SGP", date: "2019-06-28", who: "Admin", src: "/images/equipment/temperature-humidity-chamber.png" },
      { name: "Vacuum Drying Oven", maker: "", date: "2019-06-28", who: "Admin", src: "/images/equipment/vacuum-drying-oven.jpg" },
    ],
  },
  {
    id: "testing",
    title: "Catalyst Testing",
    items: [
      { name: "Bench‑scale Fixed‑bed Catalysis Reactor", maker: "", date: "2019-05-30", who: "Admin", src: "/images/equipment/reactor.jpg" },
      { name: "Gas Chromatograph", maker: "Young IN Chromass 6500GC System", date: "2019-04-16", who: "Admin", src: "/images/equipment/yl_Gas Analyzer.jpg" },
    ],
  },
];

// ====== 애니메이션 프리셋 ======
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

// 날짜 포맷 (YYYY-MM-DD → MMM DD, YYYY)
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

export default function EquipmentPage() {
  // 탭 활성화/스크롤 감지
  const [active, setActive] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onClickTab = (id: string) => (evt: React.MouseEvent) => {
    evt.preventDefault();
    const el = sectionRefs.current[id];
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 96, behavior: "smooth" });
  };

  const chips = useMemo(
    () => ({
      Lab: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      Admin: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    }),
    []
  );

  return (
    <div className="space-y-10 md:space-y-14">
      {/* 헤더 */}
      <motion.header initial="hidden" animate="show" variants={stagger} className="space-y-4 md:space-y-6">
        <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-500">
            Equipment
          </span>
        </motion.h1>
       
      </motion.header>

      {/* 탭 네비게이션 */}
      <motion.nav
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="sticky top-[64px] z-[5] mb-4 md:mb-6"
        aria-label="Equipment categories"
      >
        <div className="relative -mx-2 md:mx-0 px-2 md:px-0">
          {/* 탭 컨테이너: 학회지 스타일의 화이트 탭바 */}
          <div className="relative rounded-xl -mx-12 bg-white/80 backdrop-blur ">
            <ul className="relative flex items-center gap-1.5 md:gap-2 px-2 py-1.5 md:px-3 md:py-2">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id} className="relative">
                    <a
                      href={`#${s.id}`}
                      onClick={onClickTab(s.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "block rounded-lg px-3.5 md:px-4 py-1.5 text-xs md:text-[13px] font-medium transition-colors",
                        isActive
                          ? "text-slate-900"
                          : "text-slate-600 hover:text-slate-900"
                      ].join(" ")}
                    >
                      {s.title}
                    </a>
                    {/* 활성 탭 언더라인 (연속 애니메이션) */}
                    {isActive && (
                      <motion.div
                        layoutId="equip-tab-underline"
                        className="absolute left-2 right-2 -bottom-[6px] h-[2px] rounded-full bg-slate-900"
                        transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.4 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* 하단 분리선 */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
          </div>
        </div>
      </motion.nav>

      {/* 섹션들 */}
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[section.id] = el; }}
          className="scroll-mt-28 pt-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-5"
          >
            {section.title}
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {section.items.map((it) => (
              <motion.article
                key={`${section.id}-${it.name}-${it.maker}`}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-md"
              >
                {/* 이미지 */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={it.src}
                    alt={it.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  {/* 이미지 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* 내용 */}
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] ${chips[it.who]}`}>
                      {it.who}
                    </span>
                    <span className="text-[11px] text-slate-500">{formatDate(it.date)}</span>
                  </div>

                  <h3 className="text-base md:text-lg font-semibold text-slate-800 leading-snug">
                    {it.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{it.maker}</p>
                </div>

                {/* 하이라이트 테두리 */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5 group-hover:ring-slate-900/10" />
              </motion.article>
            ))}
          </motion.div>
        </section>
      ))}

      {/* 페이지 끝 여백 */}
      <div className="h-2" />
    </div>
  );
}
