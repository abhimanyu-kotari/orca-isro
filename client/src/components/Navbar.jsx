import React, { useState, useRef, useEffect } from 'react';
import { Anchor, Globe2, ChevronDown, Check, Sparkles } from 'lucide-react';

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

  // Close dropdowns when clicking outside
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
      <div 
        className="max-w-7xl mx-auto rounded-2xl sm:rounded-3xl p-3.5 sm:py-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3.5 shadow-2xl border border-white/15 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(2, 8, 20, 0.92) 0%, rgba(4, 20, 36, 0.82) 50%, rgba(2, 8, 20, 0.90) 100%), url('/assets/marine_hero.png') center/cover no-repeat"
        }}
      >
        
        {/* Subtle Golden Net Sunlight Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-cyan-500/10 pointer-events-none"></div>

        {/* Brand & ISRO Badge */}
        <div className="relative flex items-center justify-between w-full md:w-auto gap-3 z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_25px_rgba(0,245,160,0.4)] text-2xl font-black text-slate-950 shrink-0 transform transition hover:scale-105">
              🐋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-100 bg-clip-text text-transparent drop-shadow-md">
                  PROJECT ORCA
                </h1>
                <span className="px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm backdrop-blur-md">
                  ISRO PS-26176
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium flex items-center gap-1.5 mt-0.5 drop-shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Sustainable Fisheries & Marine AI Navigation Co-Pilot</span>
              </p>
            </div>
          </div>

          {/* Live Status Pill for mobile */}
          <div className={`md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-bold backdrop-blur-md ${
            isOffline 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_15px_rgba(0,245,160,0.2)]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span>{isOffline ? 'Offline' : 'Live'}</span>
          </div>
        </div>

        {/* Custom Frosted Dark Dropdowns */}
        <div className="relative flex items-center gap-2 w-full md:w-auto justify-between sm:justify-end z-10">
          
          {/* 1. Harbor Selector */}
          <div className="relative flex-1 sm:flex-initial" ref={harborRef}>
            <button
              onClick={() => {
                setIsHarborOpen(!isHarborOpen);
                setIsLangOpen(false);
              }}
              className="w-full flex items-center justify-between gap-2 bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-xl border border-white/20 active:scale-95 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 transition shadow-lg"
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
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 sm:w-72 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[100] py-1.5 max-h-80 overflow-y-auto animate-fadeIn">
                <div className="px-3.5 py-2 text-[10px] font-mono uppercase text-emerald-400 border-b border-white/10 tracking-wider flex items-center gap-1.5">
                  <Anchor className="w-3 h-3" /> Select Coastal Harbor
                </div>
                {Object.entries(harbors).map(([key, h]) => {
                  const isSelected = selectedHarbor === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onHarborChange(key);
                        setIsHarborOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-2 border-emerald-400' 
                          : 'text-slate-200 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>⚓</span>
                          <span>{h.name.split('(')[0].trim()}</span>
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
            )}
          </div>

          {/* 2. Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsHarborOpen(false);
              }}
              className="flex items-center justify-between gap-2 bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-xl border border-white/20 active:scale-95 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 transition shadow-lg"
            >
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-bold text-white">{currentLang.label.split(' ')[0]}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 shrink-0 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Menu Popover */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[100] py-1.5 max-h-80 overflow-y-auto animate-fadeIn">
                <div className="px-3.5 py-2 text-[10px] font-mono uppercase text-cyan-400 border-b border-white/10 tracking-wider flex items-center gap-1.5">
                  <Globe2 className="w-3 h-3" /> Regional Language
                </div>
                {languages.map((l) => {
                  const isSelected = selectedLang === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLangChange(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-2 border-cyan-400' 
                          : 'text-slate-200 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{l.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Live Status Pill */}
          <div className={`hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold shadow-lg backdrop-blur-xl ${
            isOffline 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_20px_rgba(0,245,160,0.25)]'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span className="tracking-wide">Live Satellite AI</span>
          </div>

        </div>

      </div>
    </header>
  );
}
