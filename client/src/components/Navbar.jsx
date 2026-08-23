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
  const currentVessel = VESSEL_PROFILES[selectedVessel] || VESSEL_PROFILES.trawler;

  return (
    <header className="sticky top-2 sm:top-3 z-50 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/20 relative flex flex-col justify-between">
        
        {/* Dedicated Background Layer */}
        <div 
          className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(2, 7, 18, 0.96) 0%, rgba(2, 7, 18, 0.82) 42%, rgba(2, 7, 18, 0.35) 75%, rgba(2, 7, 18, 0.15) 100%), url('/assets/marine_hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 48%",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
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
                className="w-9 h-9 rounded-full object-cover border border-emerald-400/50 shadow-[0_0_15px_rgba(0,245,160,0.4)]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-tight">ORCA</span>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40">
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
                className="flex items-center gap-1 bg-[#020a14] border border-emerald-500/40 active:scale-95 px-2 py-1.5 rounded-xl text-[10px] text-emerald-300 font-bold shadow"
              >
                <span>⛵</span>
                <span className="truncate max-w-[62px]">{currentVessel.short_name.split(' ')[0]}</span>
              </button>

              {/* Harbor Pill */}
              <div className="relative" ref={harborRef}>
                <button
                  onClick={() => {
                    setIsHarborOpen(!isHarborOpen);
                    setIsLangOpen(false);
                  }}
                  className="flex items-center gap-1 bg-[#020a14] border border-white/20 active:scale-95 px-2 py-1.5 rounded-xl text-[10px] text-slate-100 font-bold shadow"
                >
                  <Anchor className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[65px]">{currentHarbor.name.split(' ')[0]}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {isHarborOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#020b17] border border-emerald-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 overflow-hidden animate-fadeIn ring-1 ring-emerald-500/20">
                    <div className="px-3 py-2 text-[9px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1">
                      <Anchor className="w-3 h-3" /> Select Port
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                      {Object.entries(harbors).map(([key, h]) => (
                        <button
                          key={key}
                          onClick={() => {
                            onHarborChange(key);
                            setIsHarborOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-white text-[11px]">{h.name.split('(')[0]}</div>
                            <div className="text-[9px] text-slate-400">{h.state}</div>
                          </div>
                          {selectedHarbor === key && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Language Pill */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => {
                    setIsLangOpen(!isLangOpen);
                    setIsHarborOpen(false);
                  }}
                  className="flex items-center gap-1 bg-[#020a14] border border-white/20 active:scale-95 px-2 py-1.5 rounded-xl text-[10px] text-cyan-300 font-bold shadow"
                >
                  <Globe2 className="w-3 h-3 text-cyan-400" />
                  <span>{currentLang.code.toUpperCase()}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#020b17] border border-cyan-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 overflow-hidden animate-fadeIn ring-1 ring-cyan-500/20">
                    <div className="px-3 py-2 text-[9px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider">
                      Language
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            onLangChange(l.code);
                            setIsLangOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[11px] text-slate-200 hover:bg-white/10 flex items-center justify-between"
                        >
                          <span>{l.label}</span>
                          {selectedLang === l.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Mini Context Strip on Mobile */}
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1.5 border-t border-white/10">
            <span className="text-emerald-400 font-bold truncate">⚓ {currentHarbor.name.split('(')[0]}</span>
            <span className="text-slate-400 truncate">{currentHarbor.coast}</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. DESKTOP & TABLET EXPANSIVE PANORAMIC HEADER (sm: & lg: screens) */}
        {/* ========================================================================= */}
        <div className="hidden sm:block">
          
          <div className="relative flex items-center justify-between gap-3 z-40 w-full">
            
            {/* Official Circular Emblem Logo & Brand */}
            <div className="flex items-center gap-3">
              <img 
                src="/assets/orca_logo.png" 
                alt="Project ORCA Official Emblem" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_25px_rgba(0,245,160,0.5)] shrink-0 transform transition hover:scale-105"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    PROJECT ORCA
                  </h1>
                  <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-md backdrop-blur-md">
                    ISRO PS-26176
                  </span>
                </div>
                <p className="text-[11px] text-slate-200 font-medium flex items-center gap-1.5 mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
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
                className="flex items-center gap-2 bg-[#020a14] hover:bg-[#04152a] border border-emerald-500/40 active:scale-95 rounded-2xl px-3 py-2 text-xs text-slate-100 transition shadow-xl group"
              >
                <span className="text-base">⛵</span>
                <div className="text-left">
                  <div className="text-[9px] text-emerald-400 font-mono font-bold leading-none">VESSEL</div>
                  <div className="text-[11px] font-bold text-white leading-none mt-0.5 group-hover:text-emerald-300">
                    {currentVessel.short_name}
                  </div>
                </div>
              </button>

              {/* Harbor Selector */}
              <div className="relative" ref={harborRef}>
                <button
                  onClick={() => {
                    setIsHarborOpen(!isHarborOpen);
                    setIsLangOpen(false);
                  }}
                  className="flex items-center justify-between gap-2 bg-[#020a14] hover:bg-[#041224] border border-white/20 active:scale-95 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 transition shadow-2xl"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-bold truncate max-w-[140px] text-white">
                      {currentHarbor?.name?.split('(')[0]?.trim() || 'Port'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isHarborOpen ? 'rotate-180' : ''}`} />
                </button>

                {isHarborOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#020b17] border border-emerald-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 overflow-hidden animate-fadeIn ring-1 ring-emerald-500/20">
                    <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-emerald-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5" /> Select Coastal Harbor
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                      {Object.entries(harbors).map(([key, h]) => (
                        <button
                          key={key}
                          onClick={() => {
                            onHarborChange(key);
                            setIsHarborOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition ${
                            selectedHarbor === key 
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
                          {selectedHarbor === key && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Language Selector */}
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

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 sm:w-60 bg-[#020b17] border border-cyan-500/40 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 overflow-hidden animate-fadeIn ring-1 ring-cyan-500/20">
                    <div className="px-4 py-2.5 text-[10px] font-mono font-bold uppercase text-cyan-400 bg-[#01060e] border-b border-white/10 tracking-wider flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5" /> Regional Language
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1 divide-y divide-white/[0.04]">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            onLangChange(l.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition ${
                            selectedLang === l.code 
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-4 border-cyan-400' 
                              : 'text-slate-200 hover:bg-white/[0.08]'
                          }`}
                        >
                          <span className="text-white font-medium">{l.label}</span>
                          {selectedLang === l.code && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Live Status */}
              <div className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold shadow-xl backdrop-blur-xl ${
                isOffline 
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-[0_0_20px_rgba(0,245,160,0.3)]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className="tracking-wide">Live Feed</span>
              </div>

            </div>

          </div>

          {/* Desktop Bottom Context Banner */}
          <div className="relative mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono z-0">
            <div className="flex items-center gap-3 text-slate-300">
              <span className="text-emerald-400 font-bold">⚓ {currentHarbor.name.split('(')[0].trim()}</span>
              <span>&bull;</span>
              <span>{currentHarbor.coast}</span>
              <span>&bull;</span>
              <span className="text-cyan-300">⛵ {currentVessel.name} ({currentVessel.burn_rate_lph} L/hr)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15 text-[10px]">
              🇮🇳 ISRO Earth Observation
            </span>
          </div>

        </div>

      </div>
    </header>
  );
}
