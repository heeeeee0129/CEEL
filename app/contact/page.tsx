"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

export default function ContactPage() {
  return (
    <div className="space-y-10 md:space-y-14">
      {/* ===================== 헤더 ===================== */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact</h1>
        <p className="text-slate-600 text-sm md:text-base">
          Catalyst is changing the world — CEEL (Catalysis for Eco-friendly Energy Laboratory)
        </p>
      </header>

      {/* ===================== 슬로건(두루마리) ===================== */}
      <section
        aria-labelledby="slogan"
        className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-[url('/images/paper-fiber-noise.png')] bg-repeat shadow-xl"
      >
        {/* 바탕 질감 & 잉크 번짐 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-transparent to-slate-100/70" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent)] bg-[radial-gradient(80%_50%_at_50%_40%,rgba(0,0,0,0.06),transparent)]" />

        {/* 좌/우 축 장식(두루마리 느낌) */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-3 bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-300" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-3 bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-300" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="relative px-6 md:px-10 py-10 md:py-14 text-center"
        >
          <h2 id="slogan" className="sr-only">University Slogan</h2>

          {/* 한문 풍 서체 느낌: 굵기 약간 높이고 자간 살짝 좁힘 */}
          <p className="font-extrabold tracking-tight text-[22px] md:text-3xl text-slate-900/95 leading-relaxed">
            <span className="inline-block align-middle">
              예로부터 나라의 인재는 성균에 모였으니, 그대 머묾이 우연이겠는가
            </span>
          </p>

          {/* 얇은 붓 결 디바이더 */}
          <div className="mx-auto my-5 h-[1px] w-40 md:w-56 bg-gradient-to-r from-transparent via-slate-400/70 to-transparent" />

          <p className="text-sm md:text-base text-slate-600">
            Sungkyunkwan University · School of Chemical Engineering
          </p>
        </motion.div>
      </section>

      {/* ===================== 본문 2단 레이아웃 ===================== */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,420px)_1fr]"
      >
        {/* 좌측: 오피스/연락 정보 카드 */}
        <motion.aside
          variants={fadeUp}
          className="rounded-3xl bg-slate-900 text-slate-50 p-6 md:p-7 shadow-2xl relative overflow-hidden"
        >
          {/* 은은한 하이라이트 */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />

          <h3 className="text-xl font-bold mb-3">Our Office Information</h3>
          <p className="text-slate-200/90 text-sm leading-relaxed">
            Sungkyunkwan University<br />
            2066 Seobu-ro, Jangan-gu, Suwon<br />
            Gyeonggi-do 16419, Republic of Korea
          </p>

          <div className="my-5 h-px w-full bg-white/10" />

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-300/80 mb-1">Professor Office</p>
              <p className="text-sm">#25425B, Engineering Building 2</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-300/80 mb-1">Laboratory / Student Office</p>
              <p className="text-sm">#25420, #25422 (Lab.) / #25433A (Student office), Engineering Building 2</p>
              <p className="text-sm">#85696 (Lab.) / #85695 (Student office), Corporate Collaboration Center</p>
            </div>

            <div className="my-5 h-px w-full bg-white/10" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-300/80 mb-1">Professor</p>
                <p className="text-sm">TEL +82-31-290-7347</p>
                <p className="text-sm">FAX +82-31-290-7272</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-300/80 mb-1">Lab / Students</p>
                <p className="text-sm">TEL +82-31-290-7321</p>
                <p className="text-sm">FAX +82-31-290-7272</p>
              </div>
            </div>

            <div className="my-5 h-px w-full bg-white/10" />

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-300/80 mb-1">Email</p>
              <Link
                href="mailto:finejw@skku.edu"
                className="inline-flex items-center gap-2 text-sky-200 hover:text-white transition"
              >
                finejw@skku.edu
                <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-80">
                  <path fill="currentColor" d="M7 17.97L17.97 7H9V5h10v10h-2V6.03L7.03 17H7z"/>
                </svg>
              </Link>
            </div>
          </div>
        </motion.aside>

        {/* 우측: 소개 + 이미지 + 폼 대체 텍스트 영역 */}
        <motion.div variants={fadeUp} className="rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/70 shadow-xl">
          <div className="p-6 md:p-8 space-y-5">
            <div>
              <p className="text-[12px] tracking-wide text-slate-500">CONTACT US</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                Feel Free To Send Your Message
              </h3>
              <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed mt-2">
                We are highly interested in applications related to electrochemistry and biomass catalytic conversion.
                <br className="hidden md:block" />
                <span className="inline-block mt-1">
                  Graduate student &amp; Postdoctoral researcher recruitment — we welcome talents passionate about heterogeneous catalysis.
                </span>
              </p>
            </div>

            

            
          </div>
        </motion.div>
      </motion.section>

  
    </div>
  );
}