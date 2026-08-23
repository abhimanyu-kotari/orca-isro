import React from 'react';
import { Anchor, Globe2, ChevronDown } from 'lucide-react';

export default function Navbar({ selectedHarbor, onHarborChange, selectedLang, onLangChange, harbors, isOffline }) {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'tcy', label: 'ತುಳು (Tulu)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' }
  ];

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

          {/* Live Status Pill for mobile header */}
          <div className={`md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-bold ${
            isOffline 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span>{isOffline ? 'Offline' : 'Live'}</span>
          </div>
        </div>

        {/* Port & Language Pickers */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between sm:justify-end">
          
          {/* Harbor Selector */}
          <div className="flex-1 sm:flex-initial relative flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-2 text-xs text-slate-200 transition shadow-inner">
            <Anchor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedHarbor}
              onChange={(e) => onHarborChange(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-100 text-[11px] sm:text-xs font-semibold cursor-pointer appearance-none pr-4 truncate"
            >
              {Object.entries(harbors).map(([key, h]) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-100 py-1">
                  ⚓ {h.name.split('(')[0].trim()} ({h.state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 sm:right-3" />
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-2 text-xs text-slate-200 transition shadow-inner">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 text-[11px] sm:text-xs font-semibold cursor-pointer appearance-none pr-4"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 py-1">
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 sm:right-3" />
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
