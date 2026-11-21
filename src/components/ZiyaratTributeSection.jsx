import React, { useState } from 'react';
import { Flame, RotateCcw, Sparkles } from 'lucide-react';

export default function ZiyaratTributeSection({ t }) {
  const [count, setCount] = useState(0);

  return (
    <section id="ziyarat" className="py-16 sm:py-24 px-4 sm:px-6 sacred-lattice-bg">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <div className="space-y-2 max-w-4xl">
          <p className="text-xs sm:text-sm font-bold text-rose-800 dark:text-rose-400">
            {t.ziyarat.kicker}
          </p>
          <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-amber-100 leading-tight">
            {t.ziyarat.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.ziyarat.subtitle}
          </p>
        </div>

        {/* Main 2-Panel Remembrance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sacred Ziyarat & Explicit Condemnation Panel */}
          <div className="lg:col-span-7 rounded-2xl bg-[#FAF6EC] dark:bg-[#131F25] border border-amber-700/25 dark:border-amber-400/25 p-6 sm:p-8 sculpted-3d-card flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <blockquote className="font-sacred-serif text-2xl sm:text-[26px] leading-[2.1] text-amber-950 dark:text-amber-200 text-center p-5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-600/20">
                «{t.ziyarat.arabicZiyarat}»
              </blockquote>

              <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {t.ziyarat.translationZiyarat}
              </p>
            </div>

            {/* Oppressors Historical Accountability Grid */}
            <div className="pt-5 border-t border-amber-700/20 dark:border-amber-400/20 space-y-3">
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
                <Flame className="w-4 h-4 shrink-0" />
                <span>{t.ziyarat.oppressorsTitle}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.ziyarat.oppressors.map((opp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-rose-950/5 dark:bg-rose-950/30 border border-rose-800/20 dark:border-rose-400/20 p-3.5"
                  >
                    <p className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-200">
                      {opp.name}
                    </p>
                    <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                      {opp.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Tasbih / Salawat & La'an Remembrance Counter */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-emerald-950 to-[#0B1715] text-amber-50 border border-amber-500/35 p-6 sm:p-8 sculpted-3d-card flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <h3 className="font-persian-display text-2xl sm:text-3xl text-amber-200">
                {t.ziyarat.tasbihTitle}
              </h3>
              <p className="font-sacred-serif text-xl sm:text-2xl leading-[1.9] text-emerald-100 bg-white/5 p-4 rounded-xl border border-amber-400/20 text-center">
                {t.ziyarat.tasbihPhrase}
              </p>
            </div>

            <div className="py-4 flex flex-col items-center justify-center gap-2 bg-black/25 rounded-2xl border border-amber-400/20">
              <span className="text-xs font-semibold text-amber-200/80">
                {t.ziyarat.tasbihCountLabel}
              </span>
              <span className="font-persian-display text-5xl sm:text-6xl text-amber-300 tabular-nums">
                {count}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCount((c) => c + 1)}
                className="sculpted-3d-btn flex-1 py-4 px-5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-white font-bold text-base border border-amber-300/60 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.ziyarat.tasbihBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setCount(0)}
                aria-label={t.ziyarat.tasbihReset}
                className="sculpted-3d-btn py-4 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-white/15 flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.ziyarat.tasbihReset}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
