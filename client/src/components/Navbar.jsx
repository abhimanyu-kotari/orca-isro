import React from 'react';
import { Anchor, Globe2, Radio, ShieldCheck, Sparkles } from 'lucide-react';

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
    <header className="bg-ocean-900/90 backdrop-blur-md border-b border-ocean-700/60 sticky top-0 z-50 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & ISRO Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                PROJECT ORCA
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                ISRO PS-26176
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Marine EcoSystem Agentic Co-Pilot</p>
          </div>
        </div>

        {/* Harbor & Language Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Harbor Selector */}
          <div className="flex items-center gap-1.5 bg-ocean-950/80 border border-ocean-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
            <Anchor className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedHarbor}
              onChange={(e) => onHarborChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 text-xs font-medium cursor-pointer"
            >
              {Object.entries(harbors).map(([key, h]) => (
                <option key={key} value={key} className="bg-ocean-900 text-slate-100">
                  {h.name.split('(')[0].trim()} ({h.state})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-ocean-950/80 border border-ocean-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-200 text-xs font-medium cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-ocean-900 text-slate-100">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* System Status Pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
            isOffline 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            <span>{isOffline ? 'Deep-Sea Offline Cache' : 'Live Satellite AI'}</span>
          </div>

        </div>

      </div>
    </header>
  );
}
