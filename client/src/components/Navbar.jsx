import React, { useState, useRef, useEffect } from 'react';
import { Anchor, Globe2, ChevronDown, Check, Ship } from 'lucide-react';
import { VESSEL_PROFILES } from '../services/marineEngine';

export default function Navbar({ 
  selectedHarbor, 
  onHarborChange, 
  selectedLang, 
  onLangChange, 
  selectedVessel,
  onOpenVesselModal,
  harbors, 
  isOffline 
}) {
  const [isHarborOpen, setIsHarborOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  // Distinct refs for Mobile and Desktop to prevent ref collision
  const mobileHarborRef = useRef(null);
  const mobileLangRef = useRef(null);
  const desktopHarborRef = useRef(null);
  const desktopLangRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'tcy', label: 'ತುಳು (Tulu - ಕರಾವಳಿ)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' }
  ];

  // Click / Touch outside listener checking both mobile & desktop refs safely
  useEffect(() => {
    function handleClickOutside(event) {
      const isInsideHarbor = 
        (mobileHarborRef.current && mobileHarborRef.current.contains(event.target)) ||
        (desktopHarborRef.current && desktopHarborRef.current.contains(event.target));

      if (!isInsideHarbor) {
        setIsHarborOpen(false);
      }

      const isInsideLang = 
        (mobileLangRef.current && mobileLangRef.current.contains(event.target)) ||
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
    <header className="sticky top-2 sm:top-3 z-50 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl p-3.5 sm:py-7 sm:px-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-2 border-white/20 relative flex flex-col justify-between overflow-hidden min-h-[110px] sm:min-h-[145px]">
        
        {/* Master Panoramic Background Layer - Tuned so Fishermen Faces & Straw Hats are 100% Crisp and Visible */}
        <div 
          className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(2, 8, 20, 0.98) 0%, rgba(2, 8, 20, 0.82) 38%, rgba(2, 8, 20, 0.30) 70%, rgba(2, 8, 20, 0.05) 100%), url('/assets/marine_hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "right 0%",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* Subtle bottom shadow overlay to guarantee 100% text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020712]/90 via-transparent to-black/20 pointer-events-none"></div>
        </div>

        {/* ========================================================================= */}
        {/* 1. MOBILE ULTRA-COMPACT HEADER (< sm screens) */}
        {/* ========================================================================= */}
        <div className="sm:hidden relative z-40 space-y-2">
          
          {/* Mobile Single Row */}
          <div className="flex items-center justify-between gap-1.5 w-full">
            
            {/* Left: Official Emblem Logo & Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <img 
                src="/assets/orca_logo.png" 
                alt="Project ORCA Logo" 
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_15px_rgba(0,245,160,0.5)]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">ORCA</span>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow">
                    ISRO
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 3 Action Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {/* Vessel Pill */}
              <button
                onClick={onOpenVesselModal}
                className="flex items-center gap-1 bg-[#020b17]/95 border border-emerald-500/50 active:scale-95 px-2.5 py-1.5 rounded-xl text-[10px] text-emerald-300 font-black shadow-lg backdrop-blur-md"
              >
                <span>⛵</span>
                <span className="truncate max-w-[62px]">{currentVessel.short_name.split(' ')[0]}</span>
              </button>

              {/* Mobile Harbor Pill */}
              <div className="relative" ref={mobileHarborRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHarborOpen(!isHarborOpen);
                    setIsLangOpen(false);
                  }}
                  className="flex items-center gap-1 bg-[#020b17]/95 border border-white/25 active:scale-95 px-2.5 py-1.5 rounded-xl text-[10px] text-slate-100 font-bold shadow-lg backdrop-blur-md"
                >
                  <Anchor className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[65px]">{currentHarbor.name.split(' ')[0]}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {isHarborOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#020b17] border border-emerald-500/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-[9999] overflow-hidden animate-fadeIn ring-2 ring-emerald-500/30">
                    <div className="px-3 py-2 text-[9px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1">
                      <Anchor className="w-3 h-3" /> Select Coastal Port
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1 divide-y divide-white/[0.06]">
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

              {/* Mobile Language Pill */}
              <div className="relative" ref={mobileLangRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLangOpen(!isLangOpen);
                    setIsHarborOpen(false);
                  }}
                  className="flex items-center gap-1 bg-[#020b17]/95 border border-white/25 active:scale-95 px-2.5 py-1.5 rounded-xl text-[10px] text-cyan-300 font-bold shadow-lg backdrop-blur-md"
                >
                  <Globe2 className="w-3 h-3 text-cyan-400" />
                  <span>{currentLang.code.toUpperCase()}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-[#020b17] border border-cyan-500/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-[9999] overflow-hidden animate-fadeIn ring-2 ring-cyan-500/30">
                    <div className="px-3 py-2 text-[9px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider">
                      Select Language
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1 divide-y divide-white/[0.06]">
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

          </div>

          {/* Mini Context Strip on Mobile */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1.5 border-t border-white/15">
            <span className="text-emerald-400 font-bold truncate drop-shadow">⚓ {currentHarbor.name.split('(')[0]}</span>
            <span className="text-slate-300 truncate drop-shadow">{currentHarbor.coast}</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. DESKTOP & TABLET EXPANSIVE PANORAMIC HEADER (sm: & lg: screens) */}
        {/* ========================================================================= */}
        <div className="hidden sm:block">
          
          <div className="relative flex items-center justify-between gap-3 z-40 w-full">
            
            {/* Official Circular Emblem Logo & Brand */}
            <div className="flex items-center gap-3.5">
              <img 
                src="/assets/orca_logo.png" 
                alt="Project ORCA Official Emblem" 
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_25px_rgba(0,245,160,0.5)] shrink-0 transform transition hover:scale-105"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-base sm:text-xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
                    PROJECT ORCA
                  </h1>
                  <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black tracking-wider uppercase rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow-lg backdrop-blur-md">
                    ISRO PS-26176
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 font-semibold flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Marine EcoSystem Reasoning with Collaborative Agents</span>
                </p>
              </div>
            </div>

            {/* Desktop Controls Row */}
            <div className="flex items-center gap-2.5">
              
              {/* Vessel Profile */}
              <button
                onClick={onOpenVesselModal}
                className="flex items-center gap-2 bg-[#020b17]/95 hover:bg-[#04152a] border border-emerald-500/50 active:scale-95 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 transition shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md group"
              >
                <span className="text-base">⛵</span>
                <div className="text-left">
                  <div className="text-[9px] text-emerald-400 font-mono font-bold leading-none">VESSEL</div>
                  <div className="text-[11px] font-bold text-white leading-none mt-0.5 group-hover:text-emerald-300">
                    {currentVessel.short_name}
                  </div>
                </div>
              </button>

              {/* Desktop Harbor Selector */}
              <div className="relative" ref={desktopHarborRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHarborOpen(!isHarborOpen);
                    setIsLangOpen(false);
                  }}
                  className="flex items-center justify-between gap-2 bg-[#020b17]/95 hover:bg-[#041224] border border-white/25 active:scale-95 rounded-2xl px-4 py-2.5 text-xs text-slate-100 transition shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Anchor className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-black truncate max-w-[140px] text-white">
                      {currentHarbor?.name?.split('(')[0]?.trim() || 'Port'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isHarborOpen ? 'rotate-180' : ''}`} />
                </button>

                {isHarborOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#020b17] border border-emerald-500/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-[9999] overflow-hidden animate-fadeIn ring-2 ring-emerald-500/30">
                    <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5" /> Select Coastal Harbor
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
                  className="flex items-center justify-between gap-2 bg-[#020b17]/95 hover:bg-[#041224] border border-white/25 active:scale-95 rounded-2xl px-4 py-2.5 text-xs text-slate-100 transition shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md"
                >
                  <div className="flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-black text-white">{currentLang.label.split(' ')[0]}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 sm:w-60 bg-[#020b17] border border-cyan-500/60 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-[9999] overflow-hidden animate-fadeIn ring-2 ring-cyan-500/30">
                    <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5" /> Regional Language
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

              {/* Desktop Live Status */}
              <div className={`hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-black shadow-xl backdrop-blur-xl ${
                isOffline 
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                  : 'bg-emerald-500/30 text-emerald-300 border-emerald-400/60 shadow-[0_0_25px_rgba(0,245,160,0.35)]'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className="tracking-wide">Live Feed</span>
              </div>

            </div>

          </div>

          {/* Desktop Bottom Context Banner */}
          <div className="relative mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono z-0">
            <div className="flex items-center gap-3 text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
              <span className="text-emerald-400 font-black">⚓ {currentHarbor.name.split('(')[0].trim()}</span>
              <span>&bull;</span>
              <span className="font-semibold">{currentHarbor.coast}</span>
              <span>&bull;</span>
              <span className="text-cyan-300 font-bold">⛵ {currentVessel.name} ({currentVessel.burn_rate_lph} L/hr)</span>
            </div>
            <span className="px-3 py-0.5 rounded-full bg-black/60 text-slate-100 border border-white/20 text-[10px] font-bold backdrop-blur-md shadow">
              🇮🇳 ISRO Earth Observation
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
