import React from 'react';
import { ExternalLink, Code2 } from 'lucide-react';
import { SHRINE_MEDIA } from '../data/shrineMedia';

export default function CreatorFooter({ t }) {
  return (
    <footer
      id="creator"
      className="bg-[#EFE4DE] dark:bg-[#06070C] border-t border-rose-900/25 dark:border-amber-400/20 pt-14 pb-12 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center pb-8 border-b border-rose-900/20 dark:border-amber-400/20">
          <p className="font-sacred-serif text-xl sm:text-2xl lg:text-3xl text-rose-900 dark:text-amber-200 leading-relaxed">
            {t.footer.prayerClosing}
          </p>
        </div>

        <div className="rounded-2xl bg-[#FAF5F2] dark:bg-[#101426] border border-amber-500/40 dark:border-amber-400/35 p-6 sm:p-8 imperial-3d-panel flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
            <a
              href="https://github.com/amiraliSite"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.footer.visitGithub}
              className="group relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500/75 shadow-xl shrink-0 block"
            >
              <img
                src={SHRINE_MEDIA.creatorLogo}
                alt="AmirAli Made Coding Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[#0A0C18]/92 py-1.5 px-2 text-center border-t border-amber-400/40">
                <span
                  dir="ltr"
                  className="block text-[11px] font-extrabold tracking-wider text-amber-300 uppercase"
                >
                  {t.footer.badgeText}
                </span>
              </div>
            </a>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-rose-800 dark:text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>{t.footer.creatorTag}</span>
              </p>
              <h3 className="font-persian-display text-2xl sm:text-3xl text-rose-950 dark:text-amber-50">
                {t.footer.creatorName}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-w-xl leading-relaxed">
                {t.footer.creatorDesc}
              </p>
            </div>
          </div>

          <a
            href="https://github.com/amiraliSite"
            target="_blank"
            rel="noopener noreferrer"
            className="imperial-3d-btn px-6 py-3.5 rounded-xl bg-gradient-to-b from-rose-700 to-rose-900 text-amber-50 border border-amber-300/55 font-bold text-sm sm:text-base flex items-center gap-2.5 shrink-0"
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
