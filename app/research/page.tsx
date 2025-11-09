// app/research/page.tsx – Research page (Next.js + Tailwind + framer-motion)
"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

export default function ResearchPage() {
  // ---- In‑page tabs (TOC) state + observer for active section ----
  const tabs = [
    { id: "oxygenates", label: "COₓ → Oxygenates" },
    { id: "ft", label: "Fischer–Tropsch / CO₂" },
    { id: "reforming", label: "Reforming" },
    { id: "biomass", label: "Biomass" },
    { id: "clp", label: "Chemical Looping" },
    { id: "conclusion", label: "Catalysts & Micro‑reactors" },
  ] as const;

  const [active, setActive] = useState<string>(tabs[0].id);

  useEffect(() => {
    const els = tabs.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setActive(en.target.id);
          }
        });
      },
      // 상단/하단 여유를 크게 줘서 ‘가운데’ 통과 시 활성화되도록
      { rootMargin: "-42% 0px -50% 0px", threshold: 0.01 }
    );

    els.forEach((el) => io.observe(el));
    return () => {
      els.forEach((el) => io.unobserve(el));
      io.disconnect();
    };
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 md:space-y-14">
      {/* ======= Page Hero ======= */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 shadow-xl p-6 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0 [background:linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:22px_22px]" />
        <motion.div variants={fadeUp} className="space-y-2.5 md:space-y-3">
          <div className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-slate-500">Research Areas</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Fuels from alternative feedstocks &amp; eco‑benign processes
          </h1>
          <p className="text-sm md:text-[15px] text-slate-600">
            Selected themes and representative reaction systems from CEEL.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-6 md:mt-8 grid md:grid-cols-2 gap-6 md:gap-10 items-center"
        >
          <div className="order-2 md:order-1">
            <div className="prose prose-slate max-w-none text-[15px] md:text-[16px] leading-7 [&_sub]:align-baseline">
              <p className="text-slate-700 leading-relaxed">
                The utilization of CO<sub>x</sub> as an alternative feed stock has been receiving enormous interest for
                carbon cycle system. The C1 chemistry is one of the important methodologies for producing clean fuels
                and chemicals by using heterogeneous catalysts. In our laboratory, the synthesis of hydrogen, alcohols
                and hydrocarbons from synthesis gas which could be derived from natural gas or biomass has been
                intensively investigated using heterogeneous catalysts through the novel preparation routes such as
                impregnation, sol‑gel and nano‑material synthesis. Efficient conversion of biomass into chemicals and
                fuels is also pursued vigorously through non‑catalytic and catalytic routes. The application of
                micro‑structured reactors is also our research topic for the development of compact chemical processes.
              </p>
            </div>

            <ul className="mt-5 pl-4 border-l border-slate-200 space-y-2 text-slate-700">
              {[
                "Utilization of alternative feedstocks such as natural gas and biomass through C1 chemistry",
                "Biomass conversion and development of green technologies for chemicals and fuels",
                "Preparation of heterogeneous catalysts via sol‑gel method and nano‑material synthesis",
                "Production of clean fuels and chemicals such as alcohols, hydrogen and hydrocarbons through synthesis gas",
                "Reaction kinetics and application of micro‑structured reactors for compact chemical process",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="text-sm md:text-[15px] leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/70 shadow-lg">
              <Image
                src="/images/research/reaction_routes.jpg"
                alt="Reaction routes"
                width={1200}
                height={800}
                className="h-full w-full object-cover transition-transform duration-500 will-change-transform hover:scale-[1.015]"
                priority
              />
            </div>
            <figcaption className="mt-2 text-xs text-slate-500 text-center">
              Fig. 1. Representative reaction routes investigated at CEEL.
            </figcaption>
          </figure>
        </motion.div>
      </motion.section>

      {/* In‑page TOC (journal‑style tabs) */}
      <motion.nav
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="sticky top-16 z-[1] my-4 md:my-6 -mx-2 md:mx-0"
        aria-label="Research sections"
      >
        <div className="mx-auto overflow-x-auto px-2 md:px-0">
          <div className="relative rounded-xl backdrop-blur supports-[backdrop-filter]:bg-white/70 ">
            {/* underline track */}
            <div className="absolute left-0 right-0 bottom-0 h-px bg-slate-200/80" />
            <ul className="relative flex min-w-max items-center gap-1 md:gap-2 px-2 md:px-3">
              {tabs.map((t) => {
                const isActive = active === t.id;
                return (
                  <li key={t.id} className="relative">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => scrollToSection(t.id)}
                      className={[
                        "relative px-3.5 md:px-4 py-2 md:py-2.5 text-xs md:text-[13.5px] font-medium",
                        "transition-colors",
                        isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900",
                      ].join(" ")}
                    >
                      <span className="whitespace-nowrap">{t.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="tab-underline"
                          className="absolute left-2 right-2 -bottom-[1px] h-[2px] rounded-full bg-slate-900/80"
                          transition={{ type: "spring", stiffness: 550, damping: 32 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.nav>

      {/* ======= Sections (alternating layout) ======= */}
      <div className="space-y-8 md:space-y-10 pt-6">
        <AltSection
          id="oxygenates"
          title={<>CO<sub>x</sub> to Oxygenates</>}
          desc={<>Methanol is useful as an energy source as well as an intermediate for producing heavy hydrocarbons.</>}
          image="/images/research/Syngas.PNG"
          caption="Fig. 2. Oxygenates production from COₓ‑derived syngas."
          reverse={false}
        />

        <AltSection
          id="ft"
          title={
            <>
              Fischer‑Tropsch / <span className="whitespace-nowrap">CO<sub>2</sub> hydrogenation</span>
            </>
          }
          desc={<>Fischer‑Tropsch reaction can consume carbon dioxide and produces hydrocarbon fuels.</>}
          image="/images/research/Fischer.PNG"
          caption="Fig. 3. FT synthesis and CO₂ hydrogenation pathways."
          reverse
        />

        <AltSection
          id="reforming"
          title={<>Reforming</>}
          desc={<>Waste carbon sources can be converted into syngas with reforming reactions.</>}
          image="/images/research/Reforming.PNG"
          caption="Fig. 4. Reforming routes to syngas."
          reverse={false}
        />

        <AltSection
          id="biomass"
          title={<>Biomass Conversion</>}
          desc={<>Biomass Conversion</>}
          image="/images/research/Biomass.PNG"
          caption="Fig. 5. Biomass to fuels &amp; chemicals."
          reverse
        />

        <AltSection
          id="clp"
          title={<>Chemical looping process</>}
          desc={<>Chemical looping process</>}
          image="/images/research/Chemical_looping.PNG"
          caption="Fig. 6. Chemical looping process schematic."
          reverse={false}
        />
      </div>

      {/* ======= Final Section ======= */}
      <motion.section
        id="conclusion"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="scroll-mt-24 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xl p-6 md:p-10"
      >
        <h2 className="font-serif text-xl md:text-2xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Highly efficient heterogeneous catalysts &amp; micro‑reactors
        </h2>
          <p className="text-slate-700 leading-relaxed">
            The preparation of heterogeneous catalysts by sol‑gel method and nano‑material synthesis is of interest to our
            laboratory. Especially, the focuses are also on the synthesis of micro and/or mesoporous materials through
            coating technologies and encapsulation methods. In addition, both conventional reaction systems such as the
            lab‑scale fixed bed reactors, continuous stirred tank reactors or micro‑structured reactors are applied for
            measuring catalytic performances. Studies on reaction kinetics also form one of the major parts in our laboratory
            for furthering the research activity towards the development of efficient chemical processes.
          </p>

        
      </motion.section>
    </div>
  );
}

/** Alternating content section */
function AltSection({
  title,
  desc,
  image,
  reverse,
  id,
  caption,
}: {
  title: React.ReactNode;
  desc: React.ReactNode;
  image: string;
  reverse?: boolean;
  id?: string;
  caption?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      variants={stagger}
      className="scroll-mt-24 grid md:grid-cols-2 gap-6 md:gap-10 items-center"
    >
      <motion.div
        variants={fadeUp}
        className={[
          "rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xl p-6 md:p-8",
          reverse ? "md:order-2" : "md:order-none",
        ].join(" ")}
      >
        <div className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-slate-500">Research Theme</div>
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm md:text-[15px] text-slate-700 leading-relaxed">{desc}</p>
      </motion.div>

      <figure
        className={[
          "relative rounded-2xl overflow-hidden border border-slate-200/70 shadow-lg",
          reverse ? "md:order-1" : "md:order-none",
        ].join(" ")}
      >
        <Image
          src={image}
          alt={typeof title === "string" ? title : "Research image"}
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform hover:scale-[1.015]"
        />
        {caption ? (
          <figcaption className="mt-2 text-xs text-slate-500 text-center px-2">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </motion.section>
  );
}
