import React, { useEffect, useState } from 'react';
import { TRANSLATIONS } from './i18n/sacredTranslations';
import Navbar from './components/Navbar';
import HeroShrine from './components/HeroShrine';
import UmmAlBaninSection from './components/UmmAlBaninSection';
import KarbalaChronicle from './components/KarbalaChronicle';
import HadithCollection from './components/HadithCollection';
import KarbalaGallery from './components/KarbalaGallery';
import ZiyaratTributeSection from './components/ZiyaratTributeSection';
import CreatorFooter from './components/CreatorFooter';

export default function App() {
  const [lang, setLang] = useState('fa');
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('sanctuary');

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';
    document.title = t.htmlTitle;
  }, [lang, t.htmlTitle]);

  useEffect(() => {
    const ids = ['sanctuary', 'umm-al-banin', 'chronicle', 'hadiths', 'gallery', 'ziyarat', 'creator'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0.05 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#FAF5F2] dark:bg-[#07080F] text-[#1D1216] dark:text-[#F8F3EC] transition-colors duration-300">
      <Navbar
        t={t}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'fa' ? 'ar' : 'fa'))}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        activeSection={activeSection}
      />

      <main>
        <HeroShrine t={t} lang={lang} isDark={isDark} />
        <UmmAlBaninSection t={t} />
        <KarbalaChronicle t={t} />
        <HadithCollection t={t} />
        <KarbalaGallery t={t} />
        <ZiyaratTributeSection t={t} />
      </main>

      <CreatorFooter t={t} />
    </div>
  );
}
