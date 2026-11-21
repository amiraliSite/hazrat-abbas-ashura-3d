import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  Compass,
  Box,
  BookOpen,
  Image as ImageIcon,
  ShieldAlert,
  Code2,
} from 'lucide-react';

export default function Navbar({
  t,
  lang,
  onToggleLang,
  isDark,
  onToggleTheme,
  activeSection,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navItems = [
    { id: 'sanctuary', label: t.nav.sanctuary, icon: Compass },
    { id: 'shrine-3d', label: t.nav.shrine3d, icon: Box },
    { id: 'hadiths', label: t.nav.hadiths, icon: BookOpen },
    { id: 'gallery', label: t.nav.gallery, icon: ImageIcon },
    { id: 'ziyarat', label: t.nav.ziyarat, icon: ShieldAlert },
    { id: 'creator', label: t.nav.creator, icon: Code2 },
  ];

  const handleJump = (id) => {
    setDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled ? 'pt-2 px-3 sm:px-5' : 'pt-3 sm:pt-4 px-3 sm:px-6'
        }`}
      >
        <nav
          aria-label="Primary"
          className="max-w-7xl mx-auto luxury-3d-bar rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3"
        >
          {/* Brand Crest */}
          <a
            href="#sanctuary"
            onClick={(e) => {
              e.preventDefault();
              handleJump('sanctuary');
            }}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-900 flex items-center justify-center shadow-[0_4px_0_0_rgba(120,53,15,0.45)] group-hover:-translate-y-0.5 transition-transform border border-amber-300/40">
              <svg
                viewBox="0 0 32 32"
                className="w-6 h-6 text-amber-50"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16 4c4.4 5 7 9.2 7 14H9c0-4.8 2.6-9 7-14z" />
                <rect x="8" y="20" width="16" height="7" rx="2" />
                <circle cx="16" cy="2.5" r="1.4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-persian-display text-xl sm:text-2xl leading-none text-stone-900 dark:text-amber-100">
                {t.brandTitle}
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-emerald-800 dark:text-emerald-300/90 mt-1">
                {t.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop 3D Sculpted Navigation Rail */}
          <div className="hidden lg:flex items-center gap-1.5 bg-stone-200/60 dark:bg-black/35 p-1.5 rounded-xl border border-amber-700/15 dark:border-amber-400/15 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleJump(item.id)}
                  className={`sculpted-3d-btn px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white border border-amber-300/60'
                      : 'bg-[#FAF6EC] dark:bg-[#17252B] text-stone-800 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-[#1F3139] border border-stone-300/70 dark:border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Cluster: Theme + Language + Mobile/Tablet Drawer Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? t.controls.dayMode : t.controls.nightMode}
              className="sculpted-3d-btn px-2.5 sm:px-3 py-2 rounded-xl bg-[#FAF6EC] dark:bg-[#17252B] border border-amber-600/30 dark:border-amber-400/25 text-stone-900 dark:text-amber-200 flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-800" />
              )}
              <span className="hidden sm:inline">
                {isDark ? t.controls.dayMode : t.controls.nightMode}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleLang}
              className="sculpted-3d-btn px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-800 dark:bg-emerald-700 text-amber-50 border border-emerald-400/30 flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <Languages className="w-4 h-4 text-amber-200" />
              <span>{lang === 'fa' ? t.controls.switchToArabic : t.controls.switchToPersian}</span>
            </button>

            {/* Mobile & Tablet 3D Drawer Toggle */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t.controls.openMenu}
              className="lg:hidden sculpted-3d-btn p-2.5 rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 text-white border border-amber-300/50 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Smooth 3D Slide-Out Drawer for Mobile & Tablet */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden perspective-drawer">
            {/* Dimmed Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-stone-950/65 backdrop-blur-xs"
            />

            {/* 3D Sliding Drawer Panel */}
            <motion.aside
              initial={{ x: '100%', rotateY: -14, opacity: 0.6 }}
              animate={{ x: 0, rotateY: 0, opacity: 1 }}
              exit={{ x: '100%', rotateY: -12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 290, damping: 30 }}
              style={{ transformOrigin: 'right center' }}
              className="relative ms-auto h-full w-[84%] max-w-sm bg-[#FBF7EE] dark:bg-[#0E181D] border-s border-amber-600/25 dark:border-amber-400/25 shadow-[-24px_0_60px_rgba(0,0,0,0.45)] flex flex-col justify-between p-5 overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-amber-700/20 dark:border-amber-300/15">
                  <div>
                    <h2 className="font-persian-display text-2xl text-stone-900 dark:text-amber-100">
                      {t.brandTitle}
                    </h2>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                      {t.controls.drawerSubtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label={t.controls.closeMenu}
                    className="sculpted-3d-btn p-2 rounded-xl bg-stone-200/80 dark:bg-white/10 text-stone-900 dark:text-amber-100 border border-stone-400/30 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Links with Staggered Smooth Entrance */}
                <div className="mt-5 flex flex-col gap-2.5">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + idx * 0.04, duration: 0.25 }}
                        onClick={() => handleJump(item.id)}
                        className={`sculpted-3d-btn w-full px-4 py-3.5 rounded-xl flex items-center justify-between text-sm font-semibold cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-l from-amber-500 to-amber-700 text-white border border-amber-300/60'
                            : 'bg-white/90 dark:bg-[#16242A] text-stone-900 dark:text-stone-100 border border-amber-700/15 dark:border-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-5 h-5 shrink-0" />
                          <span>{item.label}</span>
                        </span>
                        <span className="text-xs opacity-70">←</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer Controls: Day/Night & Persian/Arabic */}
              <div className="pt-5 mt-6 border-t border-amber-700/20 dark:border-amber-300/15 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="sculpted-3d-btn px-3 py-3 rounded-xl bg-white dark:bg-[#16242A] border border-amber-600/30 text-stone-900 dark:text-amber-100 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-emerald-800" />
                  )}
                  <span>{isDark ? t.controls.dayMode : t.controls.nightMode}</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleLang}
                  className="sculpted-3d-btn px-3 py-3 rounded-xl bg-emerald-800 text-amber-50 border border-emerald-400/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Languages className="w-4 h-4 text-amber-200" />
                  <span>{lang === 'fa' ? t.controls.switchToArabic : t.controls.switchToPersian}</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
