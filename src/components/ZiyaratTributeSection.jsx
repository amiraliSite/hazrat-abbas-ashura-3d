import React, { useState } from 'react';
import { Flame, RotateCcw, Sparkles } from 'lucide-react';

export default function ZiyaratTributeSection({ t }) {
  const [count, setCount] = useState(0);
  const progress = Math.min((count % 33) / 33, 1);
  const strokeDashoffset = 283 - 283 * progress;

  return (
    <section id="ziyarat" className="py-16 sm:py-24 px-4 sm:px-6 karbala-geometric-grid">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="space-y-2 max-w-4xl">
          <p className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400">
            {t.ziyarat.kicker}
          </p>
          <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-rose-950 dark:text-amber-50 leading-tight">
            {t.ziyarat.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.ziyarat.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sacred Ziyarat & Historical Condemnation */}
          <div className="lg:col-span-7 rounded-2xl bg-[#FAF5F2] dark:bg-[#111528] border border-rose-900/20 dark:border-amber-400/25 p-6 sm:p-8 imperial-3d-panel flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <blockquote className="font-sacred-serif text-2xl sm:text-[26px] leading-[2.1] text-rose-950 dark:text-amber-200 text-center p-5 rounded-xl bg-rose-950/5 dark:bg-amber-400/10 border border-amber-500/25">
                «{t.ziyarat.arabicZiyarat}»
              </blockquote>

              <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed">
                {t.ziyarat.translationZiyarat}
              </p>
            </div>

            <div className="pt-5 border-t border-rose-900/20 dark:border-amber-400/20 space-y-3">
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <Flame className="w-4 h-4 shrink-0" />
                <span>{t.ziyarat.oppressorsTitle}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.ziyarat.oppressors.map((opp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-rose-900/5 dark:bg-rose-950/35 border border-rose-800/20 dark:border-rose-400/20 p-3.5"
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

          {/* Radial Interactive 3D Tasbih Counter */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-b from-[#2A0914] via-[#180710] to-[#0A0C18] text-amber-50 border border-amber-400/35 p-6 sm:p-8 imperial-3d-panel flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <h3 className="font-persian-display text-2xl sm:text-3xl text-amber-200">
                {t.ziyarat.tasbihTitle}
              </h3>
              <p className="font-sacred-serif text-xl sm:text-2xl leading-[1.9] text-amber-100 bg-white/5 p-4 rounded-xl border border-amber-400/20 text-center">
                {t.ziyarat.tasbihPhrase}
              </p>
            </div>

            {/* Interactive SVG Radial Ring Counter */}
            <div className="py-3 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-persian-display text-4xl sm:text-5xl text-amber-300 tabular-nums">
                    {count}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-100/75 mt-1">
                    {t.ziyarat.tasbihCountLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCount((c) => c + 1)}
                className="imperial-3d-btn flex-1 py-4 px-5 rounded-xl bg-gradient-to-b from-rose-700 to-rose-900 text-amber-50 font-bold text-base border border-amber-300/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.ziyarat.tasbihBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setCount(0)}
                aria-label={t.ziyarat.tasbihReset}
                className="imperial-3d-btn py-4 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-white/15 flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
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
