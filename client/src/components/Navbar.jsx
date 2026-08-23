import React from 'react';
import { Anchor, Globe2, Compass, Waves, ShieldCheck } from 'lucide-react';

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
    <header className="bg-marine-900/90 backdrop-blur-md border-b border-marine-700/60 sticky top-0 z-50 px-4 lg:px-6 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Marine EcoSystem Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-biolum-teal via-marine-500 to-marine-700 shadow-lg shadow-biolum-teal/20 text-marine-950 font-extrabold text-2xl animate-wave-gentle">
            🐋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wide bg-gradient-to-r from-biolum-teal via-biolum-aqua to-marine-200 bg-clip-text text-transparent flex items-center gap-1.5">
                <span>PROJECT ORCA</span>
                <span className="text-sm font-normal text-biolum-teal">🌊</span>
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-biolum-teal/15 text-biolum-teal border border-biolum-teal/40 shadow-sm">
                ISRO PS-26176
              </span>
            </div>
            <p className="text-xs text-marine-200 font-medium flex items-center gap-1.5">
              <span>🐟 Marine EcoSystem & Sustainable Fisheries Co-Pilot</span>
            </p>
          </div>
        </div>

        {/* Coastal Harbor & Regional Language Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Coastal Harbor Selector */}
          <div className="flex items-center gap-1.5 bg-marine-950/90 border border-marine-700/80 rounded-xl px-3 py-2 text-xs text-marine-100 shadow-inner hover:border-biolum-teal/50 transition">
            <Anchor className="w-4 h-4 text-biolum-teal shrink-0" />
            <select
              value={selectedHarbor}
              onChange={(e) => onHarborChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 text-xs font-semibold cursor-pointer pr-1"
            >
              {Object.entries(harbors).map(([key, h]) => (
                <option key={key} value={key} className="bg-marine-900 text-slate-100">
                  ⚓ {h.name.split('(')[0].trim()} ({h.state})
                </option>
              ))}
            </select>
          </div>

          {/* Regional Language Selector */}
          <div className="flex items-center gap-1.5 bg-marine-950/90 border border-marine-700/80 rounded-xl px-3 py-2 text-xs text-marine-100 shadow-inner hover:border-biolum-aqua/50 transition">
            <Globe2 className="w-4 h-4 text-biolum-aqua shrink-0" />
            <select
              value={selectedLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 text-xs font-semibold cursor-pointer pr-1"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-marine-900 text-slate-100">
                  🗣️ {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Satellite & Sea Status Pill */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold shadow ${
            isOffline 
              ? 'bg-biolum-amber/15 text-amber-300 border-biolum-amber/40'
              : 'bg-emerald-500/15 text-biolum-emerald border-emerald-500/40'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-biolum-emerald animate-pulse'}`}></span>
            <span>{isOffline ? 'Deep-Sea Offline Cache' : 'Live Ocean Satellite'}</span>
          </div>

        </div>

      </div>
    </header>
  );
}
