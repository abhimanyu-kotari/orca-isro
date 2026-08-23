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
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl sm:rounded-3xl p-3 sm:py-3.5 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl">
        
        {/* Brand & ISRO Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_0_20px_rgba(0,245,160,0.3)] text-xl sm:text-2xl font-black text-slate-950 shrink-0">
              🐋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PROJECT ORCA
                </h1>
                <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
                  ISRO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
                Marine EcoSystem & Navigation Co-Pilot
              </p>
            </div>
          </div>

          {/* Live Status Pill for mobile */}
          <div className={`md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-bold ${
            isOffline 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span>{isOffline ? 'Offline' : 'Live'}</span>
          </div>
        </div>

        {/* Custom Dark Glass Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between sm:justify-end">
          
          {/* 1. Custom Harbor Dropdown */}
          <div className="relative flex-1 sm:flex-initial" ref={harborRef}>
            <button
              onClick={() => {
                setIsHarborOpen(!isHarborOpen);
                setIsLangOpen(false);
              }}
              className="w-full flex items-center justify-between gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 active:scale-95 rounded-xl sm:rounded-2xl px-3 py-2 text-xs text-slate-100 transition shadow-inner"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px]">
                  {currentHarbor?.name?.split('(')[0]?.trim() || 'Port'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isHarborOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Harbor Menu Popover */}
            {isHarborOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 sm:w-72 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] py-1.5 max-h-80 overflow-y-auto animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 border-b border-white/[0.08] tracking-wider">
                  Select Coastal Harbor
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
                          ? 'bg-emerald-500/15 text-emerald-400 font-bold border-l-2 border-emerald-400' 
                          : 'text-slate-200 hover:bg-white/[0.06]'
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

          {/* 2. Custom Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsHarborOpen(false);
              }}
              className="flex items-center justify-between gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 active:scale-95 rounded-xl sm:rounded-2xl px-3 py-2 text-xs text-slate-100 transition shadow-inner"
            >
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-semibold">{currentLang.label.split(' ')[0]}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Menu Popover */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] py-1.5 max-h-80 overflow-y-auto animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 border-b border-white/[0.08] tracking-wider">
                  Regional Language
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
                          ? 'bg-cyan-500/15 text-cyan-400 font-bold border-l-2 border-cyan-400' 
                          : 'text-slate-200 hover:bg-white/[0.06]'
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

          {/* Live Status Pill for Desktop */}
          <div className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold shadow-lg ${
            isOffline 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(0,245,160,0.15)]'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span className="tracking-wide">{isOffline ? 'Deep-Sea Cache' : 'Live Satellite AI'}</span>
          </div>

        </div>

      </div>
    </header>
  );
}
