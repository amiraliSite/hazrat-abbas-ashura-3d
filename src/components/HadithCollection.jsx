import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Copy, Check } from 'lucide-react';

export default function HadithCollection({ t }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const visibleItems =
    selectedCat === 'all'
      ? t.hadiths.items
      : t.hadiths.items.filter((item) => item.category === selectedCat);

  const handleCopy = async (item) => {
    const payload = `${item.speaker}\n${item.arabic}\n${item.translation}\n(${item.source})`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback copy unavailable in restricted frames
    }
  };

  return (
    <section id="hadiths" className="py-16 sm:py-24 px-4 sm:px-6 sacred-lattice-bg">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header & Category Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {t.hadiths.kicker}
            </p>
            <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-amber-100">
              {t.hadiths.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              {t.hadiths.subtitle}
            </p>
          </div>

          {/* Sculpted Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {t.hadiths.categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`sculpted-3d-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white border border-amber-300/60'
                    : 'bg-[#FAF6EC] dark:bg-[#152228] text-stone-800 dark:text-stone-200 border border-amber-700/20 dark:border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hadith Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleItems.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, delay: (idx % 2) * 0.08 }}
              className="rounded-2xl bg-[#FAF6EC] dark:bg-[#131F25] border border-amber-700/20 dark:border-amber-400/20 p-6 sm:p-7 sculpted-3d-card flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                {/* Speaker Header Strip */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-700/15 dark:border-amber-400/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800/10 dark:bg-emerald-400/15 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-amber-100 leading-snug">
                      {item.speaker}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="sculpted-3d-btn px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1B2B33] border border-stone-300/70 dark:border-white/10 text-xs font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedId === item.id ? (
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

                {/* Original Arabic Text */}
                <blockquote className="font-sacred-serif text-xl sm:text-2xl leading-[2.1] text-amber-900 dark:text-amber-200 text-center py-3 px-2 rounded-xl bg-amber-500/5 dark:bg-amber-400/5 border border-amber-600/15">
                  «{item.arabic}»
                </blockquote>

                {/* Commentary / Translation */}
                <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                  {item.translation}
                </p>
              </div>

              {/* Citation Footer */}
              <div className="pt-3 border-t border-amber-700/15 dark:border-amber-400/15 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span>{item.source}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
