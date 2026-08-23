import React, { useState, useRef, useEffect } from 'react';
import { Anchor, Globe2, ChevronDown, Check } from 'lucide-react';

export default function Navbar({ selectedHarbor, onHarborChange, selectedLang, onLangChange, harbors, isOffline }) {
  const [isHarborOpen, setIsHarborOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const harborRef = useRef(null);
  const langRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'tcy', label: 'ತುಳು (Tulu - ಕರಾವಳಿ)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (harborRef.current && !harborRef.current.contains(event.target)) {
        setIsHarborOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const currentHarbor = harbors[selectedHarbor] || Object.values(harbors)[0];
  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 relative min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
        
        {/* Dedicated Background Layer (Lowest Layer z-0) */}
        <div 
          className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(2, 7, 18, 0.96) 0%, rgba(2, 7, 18, 0.82) 42%, rgba(2, 7, 18, 0.35) 75%, rgba(2, 7, 18, 0.15) 100%), url('/assets/marine_hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 48%",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Top Row: Brand & Controls (HIGHEST STACKING CONTEXT z-40) */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 z-40 w-full">
          
          {/* Brand & ISRO Badge */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_25px_rgba(0,245,160,0.45)] text-2xl font-black text-slate-950 shrink-0 transform transition hover:scale-105">
              🐋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  PROJECT ORCA
                </h1>
                <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-md backdrop-blur-md">
                  ISRO PS-26176
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-200 font-medium flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Marine EcoSystem & Sustainable Fisheries Co-Pilot</span>
              </p>
            </div>
          </div>

          {/* Controls: Port & Language */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between sm:justify-end">
            
            {/* 1. Harbor Selector */}
            <div className="relative flex-1 sm:flex-initial" ref={harborRef}>
              <button
                onClick={() => {
                  setIsHarborOpen(!isHarborOpen);
                  setIsLangOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 bg-[#020a14] hover:bg-[#041224] border border-white/20 active:scale-95 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 transition shadow-2xl"
              >
                <div className="flex items-center gap-2 truncate">
                  <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold truncate max-w-[130px] sm:max-w-[200px] text-white">
                    {currentHarbor?.name?.split('(')[0]?.trim() || 'Port'}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isHarborOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Harbor Menu Popover */}
              {isHarborOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 sm:w-80 bg-[#020b17] border border-emerald-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 overflow-hidden animate-fadeIn ring-1 ring-emerald-500/20">
                  <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5" /> Select Coastal Harbor
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                    {Object.entries(harbors).map(([key, h]) => {
                      const isSelected = selectedHarbor === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            onHarborChange(key);
                            setIsHarborOpen(false);
                          }}
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

            {/* 2. Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsHarborOpen(false);
                }}
                className="flex items-center justify-between gap-2 bg-[#020a14] hover:bg-[#041224] border border-white/20 active:scale-95 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 transition shadow-2xl"
              >
                <div className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-bold text-white">{currentLang.label.split(' ')[0]}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Menu Popover */}
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 sm:w-60 bg-[#020b17] border border-cyan-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 overflow-hidden animate-fadeIn ring-1 ring-cyan-500/20">
                  <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5" /> Regional Language
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                    {languages.map((l) => {
                      const isSelected = selectedLang === l.code;
                      return (
                        <button
                          key={l.code}
                          onClick={() => {
                            onLangChange(l.code);
                            setIsLangOpen(false);
                          }}
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
            <div className={`hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold shadow-xl backdrop-blur-xl ${
              isOffline 
                ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                : 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-[0_0_20px_rgba(0,245,160,0.3)]'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
              <span className="tracking-wide">Live Satellite Feed</span>
            </div>

          </div>

        </div>

        {/* Bottom Context Banner inside Header (LOWER STACKING CONTEXT z-0 - Painted Beneath Dropdowns) */}
        <div className="relative mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 z-0 text-[11px] font-mono pointer-events-auto">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span>⚓</span> {currentHarbor.name.split('(')[0].trim()}
            </span>
            <span>&bull;</span>
            <span className="text-slate-200">{currentHarbor.coast}</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline text-cyan-300 font-sans font-semibold">🌊 Surface Drift & SST Contours Online</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15 text-[10px]">
              🇮🇳 ISRO Earth Observation
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
