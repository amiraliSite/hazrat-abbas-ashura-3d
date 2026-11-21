import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Copy, Check } from 'lucide-react';

export default function HadithCollection({ t }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [activeId, setActiveId] = useState(t.hadiths.items[0].id);
  const [copiedId, setCopiedId] = useState(null);

  const visibleItems =
    selectedCat === 'all'
      ? t.hadiths.items
      : t.hadiths.items.filter((item) => item.category === selectedCat);

  const activeHadith =
    visibleItems.find((item) => item.id === activeId) || visibleItems[0];

  const handleCopy = async (item) => {
    const payload = `${item.speaker}\n${item.arabic}\n${item.translation}\n(${item.source})`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard blocked in restricted frames
    }
  };

  return (
    <section id="hadiths" className="py-16 sm:py-24 px-4 sm:px-6 karbala-geometric-grid">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header + Topic Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs sm:text-sm font-bold text-rose-800 dark:text-amber-400">
              {t.hadiths.kicker}
            </p>
            <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-rose-950 dark:text-amber-50">
              {t.hadiths.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              {t.hadiths.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {t.hadiths.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCat(cat.id);
                  const first =
                    cat.id === 'all'
                      ? t.hadiths.items[0]
                      : t.hadiths.items.find((x) => x.category === cat.id);
                  if (first) setActiveId(first.id);
                }}
                className={`imperial-3d-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-gradient-to-b from-rose-700 to-rose-900 text-amber-50 border border-amber-300/60'
                    : 'bg-white dark:bg-[#13182B] text-rose-950 dark:text-stone-200 border border-rose-900/20 dark:border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Illuminated Manuscript Lectern (Left/Start) + Selection Rail (Right/End) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Manuscript Selection Rail */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {visibleItems.map((item, idx) => {
              const isSelected = activeHadith && item.id === activeHadith.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`imperial-3d-btn w-full text-start p-4 rounded-2xl border flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-l from-rose-700 to-rose-900 text-amber-50 border-amber-300/60'
                      : 'bg-white/95 dark:bg-[#111528] text-rose-950 dark:text-stone-200 border-rose-900/15 dark:border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-rose-900/10 dark:bg-amber-400/15 text-rose-800 dark:text-amber-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-bold leading-snug">{item.speaker}</h3>
                    <p
                      className={`text-xs line-clamp-1 ${
                        isSelected ? 'text-amber-100/85' : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {item.source}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3D Elevated Manuscript Lectern Panel */}
          <div className="lg:col-span-7 perspective-stage">
            {activeHadith && (
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeHadith.id}
                  initial={{ opacity: 0, rotateX: 8, y: 14 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: -6, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="h-full rounded-2xl bg-[#FAF5F2] dark:bg-[#12172B] border-2 border-amber-500/50 dark:border-amber-400/40 p-6 sm:p-9 imperial-3d-panel flex flex-col justify-between gap-6"
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-rose-900/15 dark:border-amber-400/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-900/10 dark:bg-amber-400/15 text-rose-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-rose-950 dark:text-amber-100">
                          {activeHadith.speaker}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(activeHadith)}
                        className="imperial-3d-btn px-3 py-2 rounded-xl bg-white dark:bg-[#1B223D] border border-rose-800/20 dark:border-amber-400/30 text-xs font-bold text-rose-950 dark:text-amber-100 flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        {copiedId === activeHadith.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{t.hadiths.copiedLabel}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.hadiths.copyLabel}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <blockquote className="font-sacred-serif text-2xl sm:text-3xl leading-[2.15] text-rose-950 dark:text-amber-200 text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-800/5 to-transparent border border-amber-500/30">
                      «{activeHadith.arabic}»
                    </blockquote>

                    <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 leading-relaxed">
                      {activeHadith.translation}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-rose-900/15 dark:border-amber-400/20 flex items-center justify-between text-xs sm:text-sm font-bold text-rose-800 dark:text-amber-300">
                    <span>{activeHadith.source}</span>
                  </div>
                </motion.article>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
