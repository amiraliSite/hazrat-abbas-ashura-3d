import React, { useState } from 'react';
import { SHRINE_MEDIA } from '../data/shrineMedia';

function TiltMosaicCard({ card, spanClass }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div className={`perspective-stage ${spanClass}`}>
      <article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 160ms ease-out',
        }}
        className="group relative h-full min-h-[260px] rounded-2xl overflow-hidden bg-stone-950 border border-amber-500/45 dark:border-amber-400/35 imperial-3d-panel"
      >
        <img
          src={SHRINE_MEDIA[card.key]}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-1.5">
          <span className="inline-block px-2.5 py-1 rounded-md bg-rose-800/90 text-amber-100 text-[11px] font-bold border border-amber-300/30">
            {card.tag}
          </span>
          <h3 className="font-persian-display text-xl sm:text-2xl text-amber-100 leading-snug">
            {card.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed">
            {card.description}
          </p>
        </div>
      </article>
    </div>
  );
}

export default function KarbalaGallery({ t }) {
  const cards = t.gallery.cards;
  const spans = [
    'lg:col-span-7 lg:row-span-2 min-h-[380px]',
    'lg:col-span-5',
    'lg:col-span-5',
    'lg:col-span-6',
    'lg:col-span-6',
  ];

  return (
    <section
      id="gallery"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F2E9E4]/65 dark:bg-[#0B0E1A] border-y border-rose-900/15 dark:border-amber-400/15"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs sm:text-sm font-bold text-rose-800 dark:text-amber-400">
            {t.gallery.kicker}
          </p>
          <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-rose-950 dark:text-amber-50">
            {t.gallery.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
            {t.gallery.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {cards.map((card, idx) => (
            <TiltMosaicCard
              key={card.id}
              card={card}
              spanClass={spans[idx] || 'lg:col-span-4'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
