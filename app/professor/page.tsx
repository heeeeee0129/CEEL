// app/professor/page.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  type Variants,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

/** 패럴랙스 + 줌 이미지: 컨테이너 기준 스크롤 진행에 따라 y/scale 변환 */
function ParallaxPortrait() {
  const ref = useRef<HTMLDivElement>(null);

  // ⬇️ 스크롤 영역을 더 길게 잡아 효과 구간을 확장
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"], // 기존 ["start end","end start"] 보다 '진입~퇴장' 구간이 짧아져 기울기↑
  });

  // ⬇️ 이동 폭을 키움: 18px → 48px
  const yRaw = useTransform(scrollYProgress, [0, 1], [28, -48]);
  const y = useSpring(yRaw, {
    stiffness: 70,   // 낮출수록 더 끈적하게 따라옴 (기존 120)
    damping: 18,     // 너무 낮추면 출렁이니 16~22 선
    mass: 0.35,
  });

  // ⬇️ 줌 강도 업: 1.05→1.12에서 1.0으로 수렴
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.06, 1]);



  return (
    <div ref={ref} className="relative aspect-[3/4] w-full max-w-[520px] mx-auto">
      <motion.div style={{ y, scale }} className="relative h-full w-full group">
        <Image
          src="/images/professor/jong-wook-bae.jpg" // ← 이미지 파일만 여기에 넣어주세요
          alt="Prof. Jong Wook Bae"
          fill
          priority
          className="object-cover rounded-[28px] shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* 유리광/글로우 */}
        <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-slate-200/40 to-transparent blur-xl -z-10" />
        {/* 살짝 비네팅 */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-black/5 [box-shadow:inset_0_0_64px_rgba(0,0,0,0.06)]" />
      </motion.div>
    </div>
  );
}


export default function ProfessorPage() {
  return (
    <div className="space-y-10 md:space-y-14">
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        <motion.div variants={fadeUp} className="space-y-4 md:space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-500">
              Prof. Jong Wook Bae
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600">
            School of Chemical Engineering, Sungkyunkwan University
          </p>
          <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/40 shadow-xl p-5 md:p-6">
            <h2 className="font-semibold text-slate-800 mb-3">Contact</h2>
            <div className="text-sm leading-relaxed text-slate-700">
              <div>
                <strong className="font-semibold text-slate-900">Office:</strong>{" "}
                #25425B in Engineering Building 2
              </div>
              <div>
                <strong className="font-semibold text-slate-900">Landline:</strong>{" "}
                +82-31-290-7347
              </div>
              <div>
                <strong className="font-semibold text-slate-900">Fax:</strong>{" "}
                +82-31-290-7272
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="relative">
          <ParallaxPortrait />
        </motion.div>
      </motion.section>

      {/* Education & Work Experience */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="grid lg:grid-cols-2 gap-8 md:gap-10"
      >
        {/* Education */}
        <motion.div
          variants={fadeUp}
          className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/40 shadow-xl p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
            Education
          </h2>
          <ul className="space-y-4">
            <li className="p-4 rounded-2xl border border-slate-200 bg-white/60">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white">
                  Ph.D.
                </span>
                <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 text-slate-700">
                  2003
                </span>
              </div>
              <p className="text-sm text-slate-800">
                Dept. of Chemical Engineering, Pohang University of Science &amp; Technology (POSTECH)
              </p>
            </li>
            <li className="p-4 rounded-2xl border border-slate-200 bg-white/60">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white">
                  M.S.
                </span>
                <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 text-slate-700">
                  1999
                </span>
              </div>
              <p className="text-sm text-slate-800">
                Dept. of Chemical Engineering, Pohang University of Science &amp; Technology (POSTECH)
              </p>
            </li>
            <li className="p-4 rounded-2xl border border-slate-200 bg-white/60">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white">
                  B.S.
                </span>
                <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 text-slate-700">
                  1997
                </span>
              </div>
              <p className="text-sm text-slate-800">
                School of Chemical Engineering, Sungkyunkwan University
              </p>
            </li>
          </ul>
        </motion.div>

        {/* Work Experience */}
        <motion.div
          variants={fadeUp}
          className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/40 shadow-xl p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
            Work Experience
          </h2>
          {/* 세로 타임라인 + 패럴랙스 점들(살짝 이동) */}
          <ol className="relative ml-2 pl-6 space-y-5 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-slate-200 before:rounded-full">
            {[
              { period: "2022.03 – Present", role: "Professor", org: "School of Chemical Engineering, Sungkyunkwan University", tone: "bg-slate-900" },
              { period: "2016.03 – 2022.02", role: "Associate Professor", org: "School of Chemical Engineering, Sungkyunkwan University", tone: "bg-slate-800" },
              { period: "2011.03 – 2016.02", role: "Assistant Professor", org: "School of Chemical Engineering, Sungkyunkwan University", tone: "bg-slate-800" },
              { period: "2009.03 – 2011.02", role: "Adjunct Professor", org: "Dept. of Chemical Engineering, Chungbuk University", tone: "bg-slate-700" },
              { period: "2006.06 – 2011.02", role: "Principal Researcher", org: "Petroleum Displacement Technology Research Center, KRICT", tone: "bg-slate-700" },
              { period: "2002.11 – 2006.05", role: "Senior Researcher", org: "LG Chem", tone: "bg-slate-600" },
            ].map((item, idx) => (
              <TimelineItem key={idx} {...item} />
            ))}
          </ol>
        </motion.div>
      </motion.section>

      {/* Thesis / Dissertation */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        className="grid md:grid-cols-2 gap-8"
      >
        <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/40 shadow-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
            Thesis (M.S.)
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">
            Pressurized Catalytic Hydrodechlorination of Carbon tetrachloride (CCl4) to Chloroform (CHCl3) over Supported noble-metal Catalysts
            <span className="text-slate-500"> (Advisor: Prof. Kyung Hee Lee)</span>
          </p>
        </div>
        <div className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/40 shadow-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
            Dissertation (Ph.D.)
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">
            Environmentally Benign Disposal Technologies for Carbontetrachloride over Supported Platinum Catalysts
            <span className="text-slate-500"> (Advisor: Prof. Kyung Hee Lee)</span>
          </p>
        </div>
      </motion.section>
    </div>
  );
}


/** 타임라인 아이템: 점(dot)에 아주 미세한 패럴랙스 주기 */
function TimelineItem({
  period,
  role,
  org,
  tone,
}: {
  period: string;
  role: string;
  org: string;
  tone: string; // bg-slate-xxx
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.6"] });
  const y = useTransform(scrollYProgress, [0, 1], [4, -4]);

  return (
    <li ref={ref} className="relative">
      <motion.span
        style={{ y }}
        className={`absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full ${tone} ring-4 ring-white/70`}
      />
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white">
          {period}
        </span>
        <span className="px-2 py-1 text-[11px] rounded-full bg-slate-100 text-slate-700">
          {role}
        </span>
      </div>
      <p className="text-sm text-slate-800">{org}</p>
    </li>
  );
}