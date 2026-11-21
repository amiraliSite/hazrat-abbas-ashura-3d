import React from 'react';
import { ExternalLink, Code2 } from 'lucide-react';
import { SHRINE_MEDIA } from '../data/shrineMedia';

export default function CreatorFooter({ t }) {
  return (
    <footer
      id="creator"
      className="bg-[#EFE7D6] dark:bg-[#080E11] border-t border-amber-700/25 dark:border-amber-400/20 pt-14 pb-12 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Sacred Salutation Banner */}
        <div className="text-center pb-8 border-b border-amber-700/20 dark:border-amber-400/15">
          <p className="font-sacred-serif text-xl sm:text-2xl lg:text-3xl text-amber-900 dark:text-amber-200 leading-relaxed">
            {t.footer.prayerClosing}
          </p>
        </div>

        {/* Creator Signature Card: AmirAli Mohammadi + Coding Logo + AmirAli Made -> GitHub */}
        <div className="rounded-2xl bg-[#FAF6EC] dark:bg-[#111B20] border border-amber-600/35 dark:border-amber-400/30 p-6 sm:p-8 sculpted-3d-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
            {/* Coding Logo Tile with "AmirAli Made" Overlay */}
            <a
              href="https://github.com/amiraliSite"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.footer.visitGithub}
              className="group relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500/70 dark:border-amber-400/60 shadow-xl shrink-0 block"
            >
              <img
                src={SHRINE_MEDIA.creatorLogo}
                alt="AmirAli Made Coding Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-stone-950/90 py-1.5 px-2 text-center border-t border-amber-400/40">
                <span
                  dir="ltr"
                  className="block text-[11px] font-extrabold tracking-wider text-amber-300 uppercase"
                >
                  {t.footer.badgeText}
                </span>
              </div>
            </a>

            {/* Creator Name & Description */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>{t.footer.creatorTag}</span>
              </p>
              <h3 className="font-persian-display text-2xl sm:text-3xl text-stone-900 dark:text-amber-100">
                {t.footer.creatorName}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-w-xl leading-relaxed">
                {t.footer.creatorDesc}
              </p>
            </div>
          </div>

          {/* Direct Sculpted Button linking to GitHub */}
          <a
            href="https://github.com/amiraliSite"
            target="_blank"
            rel="noopener noreferrer"
            className="sculpted-3d-btn px-6 py-3.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-white border border-amber-300/60 font-bold text-sm sm:text-base flex items-center gap-2.5 shrink-0"
          >
            <span dir="ltr" className="tracking-wide">
              {t.footer.badgeText}
            </span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
