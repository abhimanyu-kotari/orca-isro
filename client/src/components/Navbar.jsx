import React from 'react';
import { Anchor, Globe2, Sparkles, ChevronDown } from 'lucide-react';

export default function Navbar({ selectedHarbor, onHarborChange, selectedLang, onLangChange, harbors, isOffline }) {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'tcy', label: 'ತುಳು (Tulu - ಕರಾವಳಿ)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' }
  ];

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto glass-panel rounded-3xl p-3 sm:py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3.5 shadow-2xl">
        
        {/* Brand & ISRO Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_0_25px_rgba(0,245,160,0.35)] text-2xl font-black text-slate-950 transition transform hover:scale-105">
            🐋
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                PROJECT ORCA
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
                ISRO PS-26176
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Autonomous Marine EcoSystem & Navigation Co-Pilot</span>
            </p>
          </div>
        </div>

        {/* Port & Language Pickers */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Harbor Selector */}
          <div className="relative flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-200 transition shadow-inner">
            <Anchor className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={selectedHarbor}
              onChange={(e) => onHarborChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 text-xs font-semibold cursor-pointer appearance-none pr-5"
            >
              {Object.entries(harbors).map(([key, h]) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-100 py-1">
                  ⚓ {h.name.split('(')[0].trim()} ({h.state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3" />
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-200 transition shadow-inner">
            <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 text-xs font-semibold cursor-pointer appearance-none pr-5"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 py-1">
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3" />
          </div>

          {/* Live Status Pill */}
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold shadow-lg ${
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
