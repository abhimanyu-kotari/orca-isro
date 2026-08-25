import React, { useState, useRef, useEffect } from 'react';
import { Anchor, Globe2, ChevronDown, Check, Ship, Sparkles } from 'lucide-react';
import { VESSEL_PROFILES } from '../services/marineEngine';
import { UI_TRANSLATIONS } from '../services/translations';

export default function Navbar({ 
  selectedHarbor, 
  onHarborChange, 
  selectedLang, 
  onLangChange, 
  selectedVessel,
  onOpenVesselModal,
  onStartTour,
  harbors, 
  isOffline 
}) {
  const [isHarborOpen, setIsHarborOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  // Distinct refs for Compact/Mobile and Large Desktop
  const compactHarborRef = useRef(null);
  const compactLangRef = useRef(null);
  const desktopHarborRef = useRef(null);
  const desktopLangRef = useRef(null);

  const t = UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS.en;

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' }
  ];

  // Click / Touch outside listener checking all refs safely
  useEffect(() => {
    function handleClickOutside(event) {
      const isInsideHarbor = 
        (compactHarborRef.current && compactHarborRef.current.contains(event.target)) ||
        (desktopHarborRef.current && desktopHarborRef.current.contains(event.target));

      if (!isInsideHarbor) {
        setIsHarborOpen(false);
      }

      const isInsideLang = 
        (compactLangRef.current && compactLangRef.current.contains(event.target)) ||
        (desktopLangRef.current && desktopLangRef.current.contains(event.target));

      if (!isInsideLang) {
        setIsLangOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const currentHarbor = harbors[selectedHarbor] || Object.values(harbors)[0];
  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];
  const currentVessel = VESSEL_PROFILES[selectedVessel] || VESSEL_PROFILES.trawler;

  const handleSelectHarbor = (key, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onHarborChange(key);
    setIsHarborOpen(false);
  };

  const handleSelectLang = (code, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onLangChange(code);
    setIsLangOpen(false);
  };

  return (
    <header className="relative lg:sticky lg:top-3 z-30 px-2 sm:px-4 lg:px-6 w-full">
      {/* Outer Container with flexible responsive height and full containment */}
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:py-5 lg:px-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-2 border-white/20 relative flex flex-col justify-between overflow-visible">
        
        {/* Background Layer with Dark Vignette */}
        <div 
          className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(2, 8, 20, 0.98) 0%, rgba(2, 8, 20, 0.85) 45%, rgba(2, 8, 20, 0.40) 75%, rgba(2, 8, 20, 0.15) 100%), url('/assets/marine_hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020712]/95 via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* ========================================================================= */}
        {/* 1. COMPACT / TABLET / MOBILE HEADER (< lg screens: < 1024px) */}
        {/* ========================================================================= */}
        <div className="lg:hidden relative z-40 space-y-2.5">
          
          {/* Top Row: Brand on Left, Tour & Vessel on Right */}
          <div className="flex items-center justify-between gap-2 w-full">
            
            {/* Left: Brand Logo & Title */}
            <div id="tour-brand" className="flex items-center gap-2 min-w-0">
              <img 
                src="/assets/orca_logo.png" 
                alt="Project ORCA Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_15px_rgba(0,245,160,0.5)] shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white tracking-tight drop-shadow truncate">
                    {t.brandTitle}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow shrink-0">
                    {t.isroTag}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-300 truncate max-w-[200px] sm:max-w-xs drop-shadow">
                  {t.brandSub}
                </p>
              </div>
            </div>

            {/* Right: Tour Guide & Vessel Setup */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {/* Tour Guide Button */}
              <button
                onClick={onStartTour}
                className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 active:scale-95 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs text-amber-300 font-black shadow backdrop-blur-md transition"
                title="Start Product Walkthrough"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>{t.tourBtn}</span>
              </button>

              {/* Vessel Profile Button */}
              <button
                id="tour-vessel"
                onClick={onOpenVesselModal}
                className="flex items-center gap-1 bg-[#020b17]/95 hover:bg-[#041224] border border-emerald-500/50 active:scale-95 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs text-emerald-300 font-bold shadow-lg backdrop-blur-md transition"
              >
                <span>⛵</span>
                <span className="truncate max-w-[70px] sm:max-w-[100px]">{currentVessel.short_name.split(' ')[0]}</span>
              </button>

            </div>

          </div>

          {/* Second Row: 2 Full-Width Responsive Selectors (Harbor & Language) */}
          <div id="tour-harbor-lang" className="grid grid-cols-2 gap-2 w-full pt-0.5">
            
            {/* Harbor Dropdown */}
            <div className="relative w-full" ref={compactHarborRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHarborOpen(!isHarborOpen);
                  setIsLangOpen(false);
                }}
                className="w-full flex items-center justify-between gap-1.5 bg-[#020b17]/95 hover:bg-[#041224] border border-white/25 active:scale-95 px-3 py-2 rounded-xl text-[11px] sm:text-xs text-slate-100 font-bold shadow-lg backdrop-blur-md transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate font-black">{currentHarbor.name.split('(')[0].trim()}</span>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isHarborOpen ? 'rotate-180' : ''}`} />
              </button>

              {isHarborOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 max-w-[90vw] bg-[#020b17] border-2 border-emerald-500/80 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,1)] z-[99999] overflow-hidden animate-fadeIn ring-2 ring-emerald-500/40">
                  <div className="px-3.5 py-2 text-[9px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                    <Anchor className="w-3 h-3" /> {t.selectHarbor}
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 divide-y divide-white/[0.06]">
                    {Object.entries(harbors).map(([key, h]) => {
                      const isSelected = selectedHarbor === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={(e) => handleSelectHarbor(key, e)}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between active:bg-emerald-500/30 transition ${
                            isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-4 border-emerald-400'
                            : 'text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white text-[11px]">{h.name.split('(')[0].trim()}</div>
                            <div className="text-[9px] text-slate-400 font-mono">{h.state} &bull; {h.coast}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative w-full" ref={compactLangRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                  setIsHarborOpen(false);
                }}
                className="w-full flex items-center justify-between gap-1.5 bg-[#020b17]/95 hover:bg-[#041224] border border-white/25 active:scale-95 px-3 py-2 rounded-xl text-[11px] sm:text-xs text-cyan-300 font-bold shadow-lg backdrop-blur-md transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate font-black">{currentLang.label.split(' ')[0]}</span>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 max-w-[90vw] bg-[#020b17] border-2 border-cyan-500/80 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,1)] z-[99999] overflow-hidden animate-fadeIn ring-2 ring-cyan-500/40">
                  <div className="px-3.5 py-2 text-[9px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider">
                    {t.selectLang}
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1 divide-y divide-white/[0.06]">
                    {languages.map((l) => {
                      const isSelected = selectedLang === l.code;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={(e) => handleSelectLang(l.code, e)}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between active:bg-cyan-500/30 transition ${
                            isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-4 border-cyan-400'
                            : 'text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-medium text-white">{l.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Context Footer Strip on Compact/Tablet */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1.5 border-t border-white/15">
            <span className="text-emerald-400 font-bold truncate drop-shadow">⚓ {currentHarbor.name.split('(')[0]} &bull; {currentHarbor.coast}</span>
            <span className="text-cyan-300 font-bold shrink-0">{currentVessel.name.split(' ')[0]}</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. LARGE PANORAMIC HEADER (lg: screens: >= 1024px) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block relative z-40">
          
          <div className="flex items-center justify-between gap-3 w-full flex-wrap xl:flex-nowrap">
            
            {/* Official Circular Emblem Logo & Brand */}
            <div id="tour-brand" className="flex items-center gap-3 shrink-0">
              <img 
                src="/assets/orca_logo.png" 
                alt="Project ORCA Official Emblem" 
                className="w-13 h-13 xl:w-14 xl:h-14 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_25px_rgba(0,245,160,0.5)] shrink-0 transform transition hover:scale-105"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base xl:text-lg font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
                    {t.brandTitle}
                  </h1>
                  <span className="px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow-lg backdrop-blur-md">
                    {t.isroTag}
                  </span>
                </div>
                <p className="text-[10px] xl:text-[11px] text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] max-w-sm xl:max-w-md truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                  <span className="truncate">{t.brandSub}</span>
                </p>
              </div>
            </div>

            {/* Desktop Controls Row */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Product Tour Guide Button */}
              <button
                onClick={onStartTour}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400/20 to-emerald-400/20 hover:from-amber-400/30 hover:to-emerald-400/30 border border-amber-400/60 active:scale-95 rounded-2xl px-3 py-2 text-xs text-amber-300 transition shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md group"
                title="Start Interactive Product Tour"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="font-black">{t.tourBtn}</span>
              </button>

              {/* Vessel Profile */}
              <button
                id="tour-vessel"
                onClick={onOpenVesselModal}
                className="flex items-center gap-2 bg-[#020b17]/95 hover:bg-[#04152a] border border-emerald-500/50 active:scale-95 rounded-2xl px-3 py-2 text-xs text-slate-100 transition shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md group"
              >
                <span className="text-base">⛵</span>
                <div className="text-left">
                  <div className="text-[8px] text-emerald-400 font-mono font-bold leading-none">{t.vesselLabel}</div>
                  <div className="text-[11px] font-bold text-white leading-none mt-0.5 group-hover:text-emerald-300 truncate max-w-[90px]">
                    {currentVessel.short_name.split(' ')[0]}
                  </div>
                </div>
              </button>

              {/* Desktop Harbor & Language Combined Anchor */}
              <div id="tour-harbor-lang" className="flex items-center gap-2">
                
                {/* Desktop Harbor Selector */}
                <div className="relative" ref={desktopHarborRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsHarborOpen(!isHarborOpen);
                      setIsLangOpen(false);
                    }}
                    className="flex items-center justify-between gap-1.5 bg-[#020b17]/95 hover:bg-[#041224] border border-white/25 active:scale-95 rounded-2xl px-3.5 py-2 text-xs text-slate-100 transition shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-black truncate max-w-[120px] xl:max-w-[140px] text-white">
                        {currentHarbor?.name?.split('(')[0]?.trim() || 'Port'}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isHarborOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isHarborOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-[#020b17] border-2 border-emerald-500/80 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,1)] z-[99999] overflow-hidden animate-fadeIn ring-2 ring-emerald-500/40">
                      <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                        <Anchor className="w-3.5 h-3.5" /> {t.selectHarbor}
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                        {Object.entries(harbors).map(([key, h]) => {
                          const isSelected = selectedHarbor === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={(e) => handleSelectHarbor(key, e)}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition ${
                                isSelected 
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-4 border-emerald-400' 
                                : 'text-slate-200 hover:bg-white/[0.08]'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span>⚓</span>
                                  <span className="text-white font-medium">{h.name.split('(')[0].trim()}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono pl-4 mt-0.5">
                                  {h.state} &bull; {h.coast}
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Language Selector */}
                <div className="relative" ref={desktopLangRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLangOpen(!isLangOpen);
                      setIsHarborOpen(false);
                    }}
                    className="flex items-center justify-between gap-1.5 bg-[#020b17]/95 hover:bg-[#041224] border border-white/25 active:scale-95 rounded-2xl px-3.5 py-2 text-xs text-slate-100 transition shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-black text-white truncate max-w-[85px]">{currentLang.label.split(' ')[0]}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#020b17] border-2 border-cyan-500/80 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,1)] z-[99999] overflow-hidden animate-fadeIn ring-2 ring-cyan-500/40">
                      <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                        <Globe2 className="w-3.5 h-3.5" /> {t.selectLang}
                      </div>
                      <div className="max-h-72 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                        {languages.map((l) => {
                          const isSelected = selectedLang === l.code;
                          return (
                            <button
                              key={l.code}
                              type="button"
                              onClick={(e) => handleSelectLang(l.code, e)}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition ${
                                isSelected 
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-4 border-cyan-400' 
                                : 'text-slate-200 hover:bg-white/[0.08]'
                              }`}
                            >
                              <span className="text-white font-medium">{l.label}</span>
                              {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Desktop Live Status */}
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-black shadow-xl backdrop-blur-xl shrink-0 ${
                isOffline 
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                  : 'bg-emerald-500/30 text-emerald-300 border-emerald-400/60 shadow-[0_0_25px_rgba(0,245,160,0.35)]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className="tracking-wide">{isOffline ? t.offlineFeed : t.liveFeed}</span>
              </div>

            </div>

          </div>

          {/* Desktop Bottom Context Banner */}
          <div className="relative mt-2.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] font-mono z-0">
            <div className="flex items-center gap-3 text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,1)] truncate">
              <span className="text-emerald-400 font-black">⚓ {currentHarbor.name.split('(')[0].trim()}</span>
              <span>&bull;</span>
              <span className="font-semibold">{currentHarbor.coast}</span>
              <span>&bull;</span>
              <span className="text-cyan-300 font-bold">⛵ {currentVessel.name} ({currentVessel.burn_rate_lph} L/hr)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-slate-100 border border-white/20 text-[10px] font-bold backdrop-blur-md shadow shrink-0">
              🇮🇳 {t.eoBadge}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
