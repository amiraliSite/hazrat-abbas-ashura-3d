import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SHRINE_MEDIA } from '../data/shrineMedia';

export default function KarbalaGallery({ t }) {
  const cards = t.gallery.cards;
  const [activeId, setActiveId] = useState(cards[0].id);
  const featured = cards.find((c) => c.id === activeId) || cards[0];

  return (
    <section
      id="gallery"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F3EDE0]/60 dark:bg-[#0E171B] border-y border-amber-700/15 dark:border-amber-400/15"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Heading */}
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
            {t.gallery.kicker}
          </p>
          <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-amber-100">
            {t.gallery.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* 2-Column Curatorial Gallery Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Large Sacred Canvas */}
          <motion.div
            key={featured.id}
            initial={{ opacity: 0.7, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-7 rounded-2xl overflow-hidden bg-[#FAF6EC] dark:bg-[#131F25] border border-amber-700/25 dark:border-amber-400/25 sculpted-3d-card flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
              <img
                src={SHRINE_MEDIA[featured.key]}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <span className="absolute top-4 start-4 px-3 py-1.5 rounded-lg bg-stone-950/80 text-amber-200 border border-amber-400/30 text-xs font-bold">
                {featured.tag}
              </span>
            </div>

            <div className="p-6 sm:p-7 space-y-2.5 flex-1 flex flex-col justify-center">
              <h3 className="font-persian-display text-2xl sm:text-3xl text-stone-900 dark:text-amber-100">
                {featured.title}
              </h3>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                {featured.description}
              </p>
            </div>
          </motion.div>

          {/* Interactive Thumbnails Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {cards.map((card) => {
              const isSelected = card.id === featured.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveId(card.id)}
                  className={`sculpted-3d-btn w-full text-start p-3 rounded-2xl border flex items-center gap-4 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-l from-amber-500/20 to-emerald-800/15 dark:from-amber-500/20 dark:to-emerald-700/20 border-amber-600/60 dark:border-amber-400/50'
                      : 'bg-[#FAF6EC] dark:bg-[#131F25] border-amber-700/15 dark:border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  <img
                    src={SHRINE_MEDIA[card.key]}
                    alt={card.title}
                    className="w-24 h-16 sm:w-28 sm:h-20 rounded-xl object-cover shrink-0 border border-amber-700/20"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      {card.tag}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-amber-100 truncate">
                      {card.title}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
