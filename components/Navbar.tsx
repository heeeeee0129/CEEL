// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants, useReducedMotion } from "framer-motion";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/professor", label: "Professor" },
  { href: "/peer", label: "Peer" },
  { href: "/research", label: "Research" },
  { href: "/publication", label: "Publication" },
  { href: "/equipment", label: "Equipment" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
};
const staggerList: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } };

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const reduceMotion = useReducedMotion();

  // ✅ hydration 이후에만 스크롤 상태 동기화 (SSR과 className 불일치 방지)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setCompact(window.scrollY > 12);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // // 라우트 변경 시 드로어 닫기 (lint-safe)
  // useEffect(() => {
  //   if (!open) return;
  //   const id = setTimeout(() => setOpen(false), 0);
  //   return () => clearTimeout(id);
  // }, [pathname, open]);

  // 스타일 값은 motion style로만 변화 → className은 SSR/CSR 동일 유지
  const navHeight = compact ? 64 : 80;
  const navShadow = compact ? "0 6px 30px rgba(15,23,42,0.06)" : "0 3px 18px rgba(15,23,42,0.04)";
  const navBgOpacity = compact ? 0.75 : 0.65;
  const borderOpacity = compact ? 0.36 : 0.28;

  return (
    <>
      {/* 상단 얇은 그라데이션 바 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60]"
        style={{
          background: "linear-gradient(90deg, rgba(37,99,235,0.18), rgba(99,102,241,0.18), rgba(14,165,233,0.18))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.nav
        role="navigation"
        aria-label="Primary"
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          // Glass backdrop
          backgroundColor: `rgba(255,255,255,${navBgOpacity})`,
          borderColor: `rgba(148,163,184,${borderOpacity})`, // slate-400-ish
          boxShadow: navShadow,
          height: navHeight,
        }}
        initial={false}
        animate={{ height: navHeight }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          {/* 로고 */}
          <Link
            href="/"
            className="font-extrabold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent
                       bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:opacity-90 transition"
            aria-label="CEEL Home"
          >
            CEEL
          </Link>

          {/* 데스크톱 탭 */}
          <div className="hidden md:block">
            <motion.ul className="flex items-center gap-1 text-[13.5px] font-medium" initial="hidden" animate="show" variants={staggerList}>
              {tabs.map((t) => {
                const active = pathname === t.href;
                return (
                  <motion.li key={t.href} variants={fadeInUp} className="relative">
                    <Link
                      href={t.href}
                      className={[
                        "px-3 py-2 rounded-lg transition-colors",
                        active ? "text-blue-700" : "text-gray-700 hover:text-blue-600",
                      ].join(" ")}
                    >
                      {t.label}
                    </Link>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-x-0 -bottom-[6px] mx-auto h-[3px] w-7 rounded-full
                                   bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>

          {/* 모바일 햄버거 */}
          <button
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-xl
                       bg-white/80 border border-gray-200/60 shadow-sm hover:bg-white transition"
          >
            <span className="sr-only">Open main menu</span>
            <div className="relative h-5 w-5">
              <motion.span
                className="absolute left-0 right-0 top-[2px] h-[2px] bg-slate-800 rounded-full"
                animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-800 rounded-full"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 right-0 bottom-[2px] h-[2px] bg-slate-800 rounded-full"
                animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>

        {/* 모바일 드로어 + 백드롭 */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.aside
                id="mobile-menu"
                className="fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-[360px]
                           bg-white/92 backdrop-blur-xl border-l border-gray-200/60 shadow-2xl
                           p-5 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent
                               bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600"
                  >
                    CEEL
                  </Link>
                  <button
                    aria-label="Close navigation"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg
                               bg-white/80 border border-gray-200/60 shadow-sm hover:bg-white transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-800">
                      <path
                        fill="currentColor"
                        d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12l-4.9 4.89a1 1 0 101.41 1.42L12 13.41l4.89 4.9a1 1 0 001.42-1.42L13.41 12l4.9-4.89a1 1 0 000-1.4z"
                      />
                    </svg>
                  </button>
                </div>

                <motion.ul className="mt-6 space-y-1" variants={staggerList} initial="hidden" animate="show">
                  {tabs.map((t) => {
                    const active = pathname === t.href;
                    return (
                      <motion.li key={t.href} variants={fadeInUp}>
                        <Link
                          href={t.href}
                          className={[
                            "block rounded-xl px-3.5 py-3 text-[15px] transition-all",
                            active
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 font-bold text-blue-700"
                              : "text-slate-700 bg-white font-semibold hover:bg-white/90",
                          ].join(" ")}
                        >
                          {t.label}
                          {active && <span className="ml-2 text-[11px] text-blue-600">•</span>}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                <div className="mt-auto pt-4 text-[11px] text-slate-400">
                  Catalysis for Eco-friendly Energy Laboratory
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}