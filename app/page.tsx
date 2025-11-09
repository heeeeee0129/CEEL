"use client";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, MouseEvent } from "react";

const images = [
  "/images/home_background_1.jpg",
  "/images/home_background_2.jpg",
  "/images/home_background_3.jpg",
];
const SLIDE_DURATION = 6000;

// ===================== 재사용: Magnetic 버튼 =====================
function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });

  function onMove(e: MouseEvent) {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.15);
    y.set(relY * 0.15);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: xSpring, y: ySpring }}
      className="px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-[15px] font-semibold
                 backdrop-blur-md bg-white/12 border border-white/30 text-white
                 hover:bg-white/20 transition-all duration-300 shadow-md inline-flex"
    >
      {children}
    </motion.a>
  );
}



export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // ✅ 마우스 hover/포커스 시 일시정지

  // 히어로 자동 전환
  useEffect(() => {
    if (paused || document.visibilityState !== "visible") return;

    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDE_DURATION);
    const onVis = () => {
      // 탭 비가시 → 정지 / 복귀 시 타이머 재설정
      if (document.visibilityState !== "visible") clearInterval(id);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [paused]);

  // 자동 배경 전환
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(id);
  }, []);

  // 히어로 패럴랙스
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -40]), { stiffness: 90, damping: 20 });
  const overlayY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  // 마우스 스포트라이트
  const spotX = useMotionValue(50); // %
  const spotY = useMotionValue(50); // %
  function onHeroMove(e: MouseEvent<HTMLDivElement>) {
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    spotX.set(px);
    spotY.set(py);
  }

  return (
    <div className="space-y-16 md:space-y-20">
      {/* ====================== Hero ====================== */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMove}
        onMouseEnter={() => setPaused(true)}    // ✅ hover → 정지
        onMouseLeave={() => setPaused(false)}   // ✅ leave → 재생
        className="relative h-[78vh] md:h-[88vh] overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* 배경 슬라이드 */}
        {images.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.04 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src={src} alt="CEEL group" fill priority={i === 0} className="object-cover object-center" />
          </motion.div>
        ))}

        {/* 오버레이 + 마우스 스포트라이트 */}
        <motion.div style={{ y: overlayY }} className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.15),transparent_55%)]" />
          {/* Spotlight */}
          <motion.div
            style={{
              background: `radial-gradient(220px circle at ${spotX.get()}% ${spotY.get()}%, rgba(255,255,255,0.08), transparent 60%)`,
            }}
            className="absolute inset-0 mix-blend-overlay"
          />
        </motion.div>

        {/* 콘텐츠 */}
        <motion.div style={{ y: textY }} className="absolute mt-48 inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <motion.div style={{ scale: titleScale }} className="relative mb-2 md:mb-3">
            <Link
              href="/"
              className="font-bold text-[48px] md:text-7xl tracking-tight bg-clip-text text-transparent
                         bg-white/70 hover:opacity-90 transition
                         drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
              aria-label="CEEL Home"
            >
              CEEL
            </Link>
          </motion.div>

          {/* 설명 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl bg-white/5 backdrop-blur-md border border-white/25 rounded-2xl px-5 md:px-7 py-4 md:py-5"
          >
            <p className="text-[15px] md:text-lg text-blue-50/95 leading-relaxed">
              We advance next-generation catalysis for eco-friendly energy. Our research spans C1 chemistry,
              petrochemical and biomass processes, including CO₂ removal and cost-efficient catalytic conversion using
              nano-sized, mesoporous, and functionalized materials.
            </p>
          </motion.div>

          {/* CTA: Magnetic */}
          <div className="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-8 justify-center">
            <MagneticButton href="/peer">Members</MagneticButton>
            <MagneticButton href="/publication">Publications</MagneticButton>
            <MagneticButton href="/equipment">Equipment</MagneticButton>
            <MagneticButton href="/gallery">Gallery</MagneticButton>
          </div>
        </motion.div>
        {/* ================== Indicators ================== */}
{/* ================== Indicators ================== */}
<div className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
  <div className="flex items-center gap-3 md:gap-4">
    {images.map((_, i) => {
      const active = i === index;
      return (
        <button
          key={i}
          onClick={() => setIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={active ? "true" : undefined}
          className={[
            "group relative h-2.5 w-2.5 md:h-3 md:w-3 rounded-full",
            "transition-all duration-300 ease-out",
            active
              ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] scale-110"
              : "bg-white/30 hover:bg-white/50",
          ].join(" ")}
        >
          {/* 내부 subtle border highlight */}
          <span
            className={[
              "absolute inset-0 rounded-full border border-white/30 transition-opacity duration-300",
              active ? "opacity-50" : "opacity-0",
            ].join(" ")}
          />
        </button>
      );
    })}
  </div>
</div>
      </section>

      
    </div>
  );
}