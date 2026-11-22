import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpen, Flame } from 'lucide-react';
import { SHRINE_MEDIA } from '../data/shrineMedia';
import UmmAlBaninCountdownBanner from './UmmAlBaninCountdownBanner';
import { SacredKarbalaBackdrop3D } from '../scene/SacredKarbalaBackdrop3D';

export default function HeroShrine({ t, lang, isDark }) {
  const backdropRef = useRef(null);
  const sceneRef = useRef(null);
  const slides = t.hero.slides;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!backdropRef.current) return undefined;
    const controller = new SacredKarbalaBackdrop3D(backdropRef.current, { isNight: isDark });
    sceneRef.current = controller;
    return () => {
      controller.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.applyTheme(isDark, false);
  }, [isDark]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 5200);
    return () => clearInterval(id);
  }, [slides.length]);

  const prevSlide = () => setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveIdx((prev) => (prev + 1) % slides.length);

  return (
    <section
      id="sanctuary"
      className="relative min-h-[820px] pt-28 sm:pt-32 pb-20 px-4 sm:px-6 overflow-hidden border-b border-rose-900/20 dark:border-amber-400/20"
    >
      {/* Full-Bleed Atmospheric 3D Archway & Lanterns Canvas (Seamless, zero control-panel box) */}
      <div
        ref={backdropRef}
        dir="ltr"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {/* Gentle atmospheric readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5F2]/80 via-[#FAF5F2]/45 to-[#FAF5F2] dark:from-[#07080F]/80 dark:via-[#07080F]/40 dark:to-[#07080F] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-10">
        <UmmAlBaninCountdownBanner t={t} lang={lang} />

        {/* Centered Majestic Calligraphy Header */}
        <div className="max-w-4xl space-y-5">
          <p className="font-sacred-serif text-lg sm:text-xl font-bold text-rose-800 dark:text-amber-300 tracking-wide">
            {t.hero.kicker}
          </p>

          <h1 className="font-persian-display text-4xl sm:text-6xl lg:text-7xl leading-[1.18] text-rose-950 dark:text-amber-50 drop-shadow-sm">
            {t.hero.headline}
          </h1>

          <p className="text-base sm:text-lg text-stone-800 dark:text-stone-200 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#hadiths"
              className="imperial-3d-btn px-6 py-3.5 rounded-xl bg-gradient-to-b from-rose-700 to-rose-900 text-amber-50 font-bold text-sm sm:text-base border border-amber-300/50 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t.hero.ctaHadith}</span>
            </a>

            <a
              href="#ziyarat"
              className="imperial-3d-btn px-6 py-3.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-stone-950 font-extrabold text-sm sm:text-base border border-amber-200/60 flex items-center gap-2"
            >
              <Flame className="w-5 h-5" />
              <span>{t.hero.ctaZiyarat}</span>
            </a>
          </div>
        </div>

        {/* Interactive 3D Perspective Coverflow Stage of Shrine & Ashura Imagery */}
        <div className="w-full max-w-5xl perspective-stage pt-2">
          <div className="relative h-[300px] sm:h-[400px] md:h-[440px] flex items-center justify-center">
            {slides.map((slide, idx) => {
              let offset = idx - activeIdx;
              if (offset > Math.floor(slides.length / 2)) offset -= slides.length;
              if (offset < -Math.floor(slides.length / 2)) offset += slides.length;

              const isCenter = offset === 0;
              const absOff = Math.abs(offset);
              const rotateY = offset * -24;
              const translateX = offset * 240;
              const translateZ = isCenter ? 60 : -110 * absOff;
              const scale = isCenter ? 1 : Math.max(0.72, 1 - absOff * 0.16);
              const opacity = absOff > 1 ? 0.32 : isCenter ? 1 : 0.72;
              const zIndex = 20 - absOff * 5;

              return (
                <motion.div
                  key={slide.id}
                  onClick={() => setActiveIdx(idx)}
                  animate={{
                    x: translateX,
                    z: translateZ,
                    rotateY,
                    scale,
                    opacity,
                  }}
                  transition={{ type: 'spring', stiffness: 210, damping: 24 }}
                  style={{ zIndex, transformStyle: 'preserve-3d' }}
                  className="absolute w-[84%] sm:w-[66%] md:w-[58%] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 border-amber-500/65 dark:border-amber-400/65 shadow-[0_28px_60px_-14px_rgba(0,0,0,0.65)] bg-stone-950"
                >
                  <img
                    src={SHRINE_MEDIA[slide.key]}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-start">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-rose-800/90 text-amber-100 text-[11px] font-bold border border-amber-300/30 mb-1.5">
                      {slide.tag}
                    </span>
                    <h2 className="font-persian-display text-lg sm:text-2xl text-amber-100">
                      {slide.title}
                    </h2>
                    {isCenter && (
                      <p className="text-xs sm:text-sm text-stone-200/90 mt-0.5">
                        {slide.subtitle}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 3D Coverflow Navigation Strip */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous"
              className="imperial-3d-btn w-11 h-11 rounded-xl bg-white/95 dark:bg-[#14192E] text-rose-950 dark:text-amber-200 border border-rose-800/25 dark:border-amber-400/30 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={s.title}
                  className={`h-2.5 rounded-sm transition-all cursor-pointer ${
                    idx === activeIdx
                      ? 'w-10 bg-rose-700 dark:bg-amber-400'
                      : 'w-4 bg-stone-400/50 dark:bg-white/20 hover:bg-rose-500/60'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next"
              className="imperial-3d-btn w-11 h-11 rounded-xl bg-white/95 dark:bg-[#14192E] text-rose-950 dark:text-amber-200 border border-rose-800/25 dark:border-amber-400/30 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
