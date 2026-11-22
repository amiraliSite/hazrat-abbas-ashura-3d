import React from 'react';
import { motion } from 'motion/react';
import { SHRINE_MEDIA } from '../data/shrineMedia';

export default function KarbalaChronicle({ t }) {
  return (
    <section
      id="chronicle"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F2E9E4]/65 dark:bg-[#0B0E1A] border-b border-rose-900/15 dark:border-amber-400/15"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Heading */}
        <div className="max-w-3xl space-y-2">
          <p className="text-xs sm:text-sm font-bold text-rose-800 dark:text-amber-400">
            {t.chronicle.kicker}
          </p>
          <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-rose-950 dark:text-amber-50">
            {t.chronicle.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.chronicle.subtitle}
          </p>
        </div>

        {/* Alternating Historical Editorial Rows with 3D Hover Depth */}
        <div className="space-y-8">
          {t.chronicle.stages.map((stage, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <motion.article
                key={stage.num}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-2xl bg-[#FAF5F2] dark:bg-[#111528] border border-rose-900/20 dark:border-amber-400/20 p-5 sm:p-7 imperial-3d-panel"
              >
                <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div className="group perspective-stage">
                    <div className="overflow-hidden rounded-xl border border-amber-500/40 shadow-lg transition-transform duration-500 group-hover:[transform:rotateY(5deg)_scale(1.02)]">
                      <img
                        src={SHRINE_MEDIA[stage.imageKey]}
                        alt={stage.title}
                        className="w-full aspect-[16/10] object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-7 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-persian-display text-3xl sm:text-4xl text-rose-700 dark:text-amber-400">
                      {stage.num}
                    </span>
                    <div className="h-px flex-1 bg-rose-900/20 dark:bg-amber-400/20" />
                  </div>

                  <h3 className="font-persian-display text-2xl sm:text-3xl text-rose-950 dark:text-amber-100">
                    {stage.title}
                  </h3>

                  <p className="font-sacred-serif text-lg sm:text-xl text-rose-800 dark:text-amber-300 bg-rose-950/5 dark:bg-amber-400/10 px-4 py-2.5 rounded-xl border border-rose-800/15 dark:border-amber-400/20">
                    {stage.verse}
                  </p>

                  <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
