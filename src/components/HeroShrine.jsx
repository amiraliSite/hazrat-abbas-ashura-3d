import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { SHRINE_MEDIA } from '../data/shrineMedia';

export default function HeroShrine({ t }) {
  const slides = t.hero.slides;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      id="sanctuary"
      className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden sacred-lattice-bg"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Editorial Sacred Typography Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-b border-amber-700/25 dark:border-amber-400/25 pb-3">
              <p className="text-xs sm:text-sm font-bold tracking-wide text-emerald-800 dark:text-emerald-300">
                {t.hero.kicker}
              </p>
            </div>

            <h1 className="font-persian-display text-4xl sm:text-5xl xl:text-6xl leading-[1.2] text-stone-900 dark:text-amber-50">
              {t.hero.headline}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-stone-700 dark:text-stone-300 max-w-2xl">
              {t.hero.subheadline}
            </p>

            {/* Tactile 3D CTA Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#shrine-3d"
                className="sculpted-3d-btn px-6 py-3.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-white font-bold text-sm sm:text-base border border-amber-300/60 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>{t.hero.cta3d}</span>
              </a>
              <a
                href="#hadiths"
                className="sculpted-3d-btn px-6 py-3.5 rounded-xl bg-[#FAF6EC] dark:bg-[#16242A] text-stone-900 dark:text-amber-100 font-bold text-sm sm:text-base border border-amber-700/25 dark:border-amber-300/25 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>{t.hero.ctaHadith}</span>
              </a>
            </div>

            {/* Structured Archival Definition Grid (No Pill Badges) */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-amber-700/20 dark:border-amber-400/20">
              {t.hero.virtuesSummary.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#F3EDE0]/80 dark:bg-[#121E24] p-3.5 border border-amber-700/15 dark:border-amber-400/15"
                >
                  <dt className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    {stat.label}
                  </dt>
                  <dd className="text-sm font-bold text-stone-900 dark:text-amber-100 mt-1">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Interactive 3D-Depth Sanctuary Image Slider */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl p-2 sm:p-3 bg-gradient-to-br from-amber-500/25 via-emerald-700/15 to-amber-800/25 border border-amber-600/35 dark:border-amber-400/30 sculpted-3d-card">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={SHRINE_MEDIA[currentSlide.key]}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Caption & Prev/Next Controls */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-persian-display text-xl sm:text-2xl text-amber-100 leading-snug">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-200/90">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous"
                      className="sculpted-3d-btn w-10 h-10 rounded-xl bg-stone-900/85 text-amber-200 border border-amber-400/35 flex items-center justify-center cursor-pointer hover:bg-amber-600 hover:text-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next"
                      className="sculpted-3d-btn w-10 h-10 rounded-xl bg-stone-900/85 text-amber-200 border border-amber-400/35 flex items-center justify-center cursor-pointer hover:bg-amber-600 hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Architectural Segment Bar Indicators */}
              <div className="mt-2.5 grid grid-cols-4 gap-2 px-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    aria-label={s.title}
                    className={`h-2 rounded-md transition-all cursor-pointer ${
                      idx === currentIdx
                        ? 'bg-amber-600 dark:bg-amber-400'
                        : 'bg-stone-300 dark:bg-white/15 hover:bg-amber-400/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
