import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, Sparkles, RotateCcw, BookOpen } from 'lucide-react';

export default function UmmAlBaninSection({ t }) {
  const s = t.ummAlBaninSection;
  const [selectedSon, setSelectedSon] = useState(0);
  const [salawatCount, setSalawatCount] = useState(14);

  const activeSon = s.sons[selectedSon] || s.sons[0];

  return (
    <section
      id="umm-al-banin"
      className="scroll-mt-24 py-18 sm:py-24 px-4 sm:px-6 bg-[#F4EAE4] dark:bg-[#0B0C16] border-b border-rose-900/20 dark:border-amber-400/20"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <p className="font-sacred-serif text-base sm:text-lg font-bold text-rose-800 dark:text-amber-300">
            {s.kicker}
          </p>
          <h2 className="font-persian-display text-3xl sm:text-5xl text-rose-950 dark:text-amber-100 leading-tight">
            {s.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {s.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-7 rounded-2xl bg-[#FAF5F2] dark:bg-[#111528] border border-rose-900/20 dark:border-amber-400/25 p-6 sm:p-8 imperial-3d-panel flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-rose-800 dark:text-amber-300 text-xs sm:text-sm font-bold">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>{s.loyaltyTitle}</span>
              </div>
              <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {s.loyaltyStory}
              </p>
            </div>

            <div className="pt-5 border-t border-rose-900/20 dark:border-amber-400/20 space-y-4">
              <h3 className="text-sm font-bold text-rose-900 dark:text-amber-200">
                {s.sonsHeading}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {s.sons.map((son, idx) => (
                  <button
                    key={son.id}
                    type="button"
                    onClick={() => setSelectedSon(idx)}
                    className={`imperial-3d-btn px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold border cursor-pointer ${
                      selectedSon === idx
                        ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-amber-50 border-amber-300/55'
                        : 'bg-white dark:bg-[#171C35] text-rose-950 dark:text-amber-100 border-rose-900/20 dark:border-amber-400/20'
                    }`}
                  >
                    {son.name}
                  </button>
                ))}
              </div>

              <div className="rounded-xl bg-rose-950/5 dark:bg-amber-400/10 border border-amber-500/25 p-4 space-y-1.5">
                <p className="font-persian-display text-lg sm:text-xl text-rose-950 dark:text-amber-200">
                  {activeSon.fullTitle}
                </p>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
                  {activeSon.desc}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-[#2A0914] via-[#180710] to-[#0A0C18] text-amber-50 border border-amber-400/35 p-6 sm:p-8 imperial-3d-panel flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <HeartHandshake className="w-4 h-4 shrink-0" />
                <span>{s.elegyTag}</span>
              </div>

              <blockquote className="font-sacred-serif text-xl sm:text-2xl leading-[2] text-amber-100 bg-white/5 p-4 rounded-xl border border-amber-400/25 text-center">
                «{s.elegyArabic}»
              </blockquote>

              <p className="text-xs sm:text-sm text-amber-100/85 leading-relaxed">
                {s.elegyMeaning}
              </p>
            </div>

            <div className="pt-5 border-t border-amber-400/20 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-amber-200">
                  {s.nazarCounterLabel}
                </span>
                <span className="font-persian-display text-3xl text-amber-300 tabular-nums">
                  {salawatCount}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSalawatCount((c) => c + 1)}
                  className="imperial-3d-btn flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-stone-950 font-extrabold text-xs sm:text-sm border border-amber-200/70 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{s.nazarBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSalawatCount(0)}
                  aria-label={s.nazarReset}
                  className="imperial-3d-btn py-3.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-white/15 flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
