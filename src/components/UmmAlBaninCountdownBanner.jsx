import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Flame, ArrowDown } from 'lucide-react';

function toLocalizedDigits(num, lang) {
  const padded = String(num).padStart(2, '0');
  const map = lang === 'ar'
    ? ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    : ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return padded.replace(/\d/g, (d) => map[Number(d)]);
}

function getTargetMartyrdomEve() {
  // Tomorrow evening: Monday 2026-11-23 at 19:30 Iran Standard Time (+03:30)
  const primaryTarget = new Date('2026-11-23T19:30:00+03:30').getTime();
  const primaryEndOfNight = new Date('2026-11-23T23:59:59+03:30').getTime();
  const now = Date.now();
  if (now <= primaryEndOfNight) {
    return { targetMs: primaryTarget, isMartyrdomNight: now >= primaryTarget };
  }
  const next = new Date(now);
  next.setHours(19, 30, 0, 0);
  if (next.getTime() <= now) next.setDate(next.getDate() + 1);
  return { targetMs: next.getTime(), isMartyrdomNight: false };
}

export default function UmmAlBaninCountdownBanner({ t, lang }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 26,
    minutes: 15,
    seconds: 40,
    isNight: false,
  });

  useEffect(() => {
    const compute = () => {
      const { targetMs, isMartyrdomNight } = getTargetMartyrdomEve();
      if (isMartyrdomNight) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isNight: true });
        return;
      }
      const diff = Math.max(0, targetMs - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ hours, minutes, seconds, isNight: false });
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, []);

  const b = t.ummAlBaninBanner;

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto rounded-2xl bg-gradient-to-br from-[#2B0814]/95 via-[#180A18]/95 to-[#0D1022]/95 text-amber-50 border border-amber-400/45 p-5 sm:p-6 imperial-3d-panel text-start"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-300">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{b.kicker}</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-200">{b.eveLabel}</span>
          </div>

          <h2 className="font-persian-display text-2xl sm:text-3xl text-amber-100 leading-snug">
            {b.title}
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/85 leading-relaxed">
            {b.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          {timeLeft.isNight ? (
            <div className="px-5 py-3 rounded-xl bg-rose-900/70 border border-amber-400/50 text-center">
              <p className="font-persian-display text-lg sm:text-xl text-amber-200">
                {b.arrivedTitle}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 justify-start lg:justify-end">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{b.remainingLabel}</span>
              </p>
              <div dir="ltr" className="grid grid-cols-3 gap-2">
                <div className="min-w-[68px] rounded-xl bg-white/10 border border-amber-400/35 px-3 py-2 text-center">
                  <span className="font-persian-display text-2xl sm:text-3xl text-amber-200 tabular-nums block leading-none">
                    {toLocalizedDigits(timeLeft.hours, lang)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-100/80 mt-1 block">
                    {b.unitHours}
                  </span>
                </div>
                <div className="min-w-[68px] rounded-xl bg-white/10 border border-amber-400/35 px-3 py-2 text-center">
                  <span className="font-persian-display text-2xl sm:text-3xl text-amber-200 tabular-nums block leading-none">
                    {toLocalizedDigits(timeLeft.minutes, lang)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-100/80 mt-1 block">
                    {b.unitMinutes}
                  </span>
                </div>
                <div className="min-w-[68px] rounded-xl bg-white/10 border border-amber-400/35 px-3 py-2 text-center">
                  <span className="font-persian-display text-2xl sm:text-3xl text-rose-300 tabular-nums block leading-none">
                    {toLocalizedDigits(timeLeft.seconds, lang)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-100/80 mt-1 block">
                    {b.unitSeconds}
                  </span>
                </div>
              </div>
            </div>
          )}

          <a
            href="#umm-al-banin"
            className="imperial-3d-btn px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-stone-950 font-extrabold text-xs sm:text-sm border border-amber-200/70 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>{b.ctaTribute}</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
