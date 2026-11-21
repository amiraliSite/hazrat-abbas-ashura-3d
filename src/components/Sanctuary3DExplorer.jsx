import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Layers, Camera, ChevronUp, ChevronDown } from 'lucide-react';
import { AbbasSanctuary3D } from '../scene/AbbasSanctuary3D';

export default function Sanctuary3DExplorer({ t, isDark }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [activeCam, setActiveCam] = useState('overview');
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const controller = new AbbasSanctuary3D(containerRef.current, { isNight: isDark });
    sceneRef.current = controller;

    return () => {
      controller.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.applyTheme(isDark, false);
  }, [isDark]);

  const handleCameraPreset = (id) => {
    setActiveCam(id);
    sceneRef.current?.setCameraPreset(id, false);
  };

  const handleToggleExplode = () => {
    const next = !isExploded;
    setIsExploded(next);
    sceneRef.current?.setExploded(next);
  };

  const handleToggleRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    sceneRef.current?.setAutoRotate(next);
  };

  return (
    <section
      id="shrine-3d"
      className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F3EDE0]/60 dark:bg-[#0E171B] border-y border-amber-700/15 dark:border-amber-400/15"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {t.scene3d.kicker}
            </p>
            <h2 className="font-persian-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-amber-100">
              {t.scene3d.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed">
              {t.scene3d.subtitle}
            </p>
          </div>
          <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 shrink-0">
            {t.scene3d.dragHint}
          </p>
        </div>

        {/* 3D Architectural Canvas Container (Strictly dir="ltr" to preserve OrbitControls math) */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-600/35 dark:border-amber-400/30 sculpted-3d-card bg-[#EFE7D6] dark:bg-[#091014]">
          <div
            ref={containerRef}
            dir="ltr"
            className="w-full h-[460px] sm:h-[560px] lg:h-[620px]"
          />

          {/* Collapsible Floating Control Dock (No backdrop-blur over WebGL canvas per guidelines) */}
          <div className="absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-5 z-20 flex flex-col items-center pointer-events-none">
            <div className="pointer-events-auto max-w-4xl w-full flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setDockOpen((v) => !v)}
                className="sculpted-3d-btn px-3.5 py-1.5 rounded-lg bg-[#FAF6EC]/95 dark:bg-[#132026]/95 border border-amber-600/35 text-xs font-bold text-stone-900 dark:text-amber-100 flex items-center gap-1.5 cursor-pointer"
              >
                {dockOpen ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>{t.scene3d.collapseDock}</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>{t.scene3d.expandDock}</span>
                  </>
                )}
              </button>

              {dockOpen && (
                <div className="w-full rounded-2xl p-3 sm:p-3.5 bg-[#FAF6EC]/95 dark:bg-[#111D23]/95 border border-amber-600/30 dark:border-amber-400/25 shadow-2xl flex flex-wrap items-center justify-between gap-2.5">
                  {/* Camera Presets */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1 px-1">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                    {t.scene3d.cameras.map((cam) => (
                      <button
                        key={cam.id}
                        type="button"
                        onClick={() => handleCameraPreset(cam.id)}
                        className={`sculpted-3d-btn px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          activeCam === cam.id
                            ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white border border-amber-300/60'
                            : 'bg-white dark:bg-[#192830] text-stone-800 dark:text-stone-200 border border-stone-300/80 dark:border-white/10'
                        }`}
                      >
                        {cam.label}
                      </button>
                    ))}
                  </div>

                  {/* Explode & Orbit Toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleExplode}
                      className={`sculpted-3d-btn px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        isExploded
                          ? 'bg-emerald-700 text-white border border-emerald-400/40'
                          : 'bg-white dark:bg-[#192830] text-stone-800 dark:text-stone-200 border border-stone-300/80 dark:border-white/10'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>
                        {isExploded ? t.scene3d.assembleView : t.scene3d.explodeView}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleRotate}
                      className={`sculpted-3d-btn px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        autoRotate
                          ? 'bg-amber-600 text-white border border-amber-300/50'
                          : 'bg-white dark:bg-[#192830] text-stone-800 dark:text-stone-200 border border-stone-300/80 dark:border-white/10'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{t.scene3d.autoRotate}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Architectural Craftsmanship Breakdown Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.scene3d.legendItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#FAF6EC] dark:bg-[#142026] p-4 border border-amber-700/15 dark:border-amber-400/15 flex items-start gap-3"
            >
              <span className="w-7 h-7 rounded-lg bg-amber-500/15 dark:bg-amber-400/15 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                ۰{idx + 1}
              </span>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
