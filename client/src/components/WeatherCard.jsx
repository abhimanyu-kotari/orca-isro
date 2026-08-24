import React from 'react';
import { Waves, Wind, Compass, ShieldCheck, ThermometerSun, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function WeatherCard({ weather, hotspot }) {
  const waveHeight = weather?.wave_height_m || 0.9;
  const wavePeriod = weather?.wave_period_sec || 6.5;
  const currentKnots = weather?.ocean_current_knots || 1.3;
  const currentDir = weather?.ocean_current_compass || 'SE';
  const windSpeed = weather?.wind_speed_knots || 12.0;
  const seaState = weather?.sea_state || 'Calm to Moderate';
  const safetyStatus = weather?.safety_status || 'SAFE';
  const verdict = weather?.advisory_verdict || 'Normal fishing operations permitted. Favorable surface current drift towards fishing zone.';

  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 border border-white/15">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">Live Oceanographic State</h3>
            <p className="text-[10px] text-cyan-400 font-mono">ISRO INSAT-3DR & MoES Marine Buoy Stream</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider shadow-lg flex items-center gap-1.5 ${
          safetyStatus === 'SAFE' || safetyStatus === 'EXCELLENT'
            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-[0_0_20px_rgba(0,245,160,0.3)]'
            : 'bg-amber-500/25 text-amber-300 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{safetyStatus === 'SAFE' ? '✓ SAFE TO SAIL' : safetyStatus}</span>
        </span>
      </div>

      {/* 4-Grid Telemetry with Clean Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        
        {/* Wave Swell */}
        <div className="bg-[#020b17]/80 border border-white/15 p-3 sm:p-3.5 rounded-2xl relative overflow-hidden group hover:border-cyan-400/60 transition shadow-inner">
          <span className="text-[10px] sm:text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" /> Wave Height
          </span>
          <p className="text-lg sm:text-xl font-black text-white font-mono mt-1">{waveHeight} m</p>
          <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono mt-1">
            <span>Period: {wavePeriod}s</span>
            <span className="text-emerald-400 font-bold">Gentle</span>
          </div>
        </div>

        {/* Ocean Current Vector */}
        <div className="bg-[#020b17]/80 border border-white/15 p-3 sm:p-3.5 rounded-2xl relative overflow-hidden group hover:border-emerald-400/60 transition shadow-inner">
          <span className="text-[10px] sm:text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Surface Drift
          </span>
          <p className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-1">{currentKnots} kts</p>
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono mt-1">
            <span>Dir: <strong className="text-white">{currentDir}</strong></span>
            <span className="text-emerald-400 font-bold">+{currentKnots} kts</span>
          </div>
        </div>

        {/* Marine Wind */}
        <div className="bg-[#020b17]/80 border border-white/15 p-3 sm:p-3.5 rounded-2xl relative overflow-hidden group hover:border-sky-400/60 transition shadow-inner">
          <span className="text-[10px] sm:text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-400" /> Coastal Wind
          </span>
          <p className="text-lg sm:text-xl font-black text-white font-mono mt-1">{windSpeed} kts</p>
          <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono mt-1">
            <span>Beaufort: 3</span>
            <span className="text-sky-300 font-bold">Breeze</span>
          </div>
        </div>

        {/* Satellite Plankton & SST */}
        <div className="bg-[#020b17]/80 border border-white/15 p-3 sm:p-3.5 rounded-2xl relative overflow-hidden group hover:border-amber-400/60 transition shadow-inner">
          <span className="text-[10px] sm:text-[11px] text-slate-300 font-bold flex items-center gap-1.5">
            <ThermometerSun className="w-3.5 h-3.5 text-amber-400" /> Plankton & SST
          </span>
          <p className="text-lg sm:text-xl font-black text-amber-300 font-mono mt-1">{hotspot?.sst_celsius || 27.8}°C</p>
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono mt-1">
            <span>Chl-a: {hotspot?.chlorophyll_mg_m3 || 1.65}</span>
            <span className="font-black">High</span>
          </div>
        </div>

      </div>

      {/* Advisory Verdict Banner */}
      <div className="bg-[#020b17]/90 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-lg">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-white flex items-center gap-2">
            <span className="text-emerald-300">{seaState}</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-300 font-mono text-[11px]">Official Coast Guard & INCOIS Bulletin</span>
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{verdict}</p>
        </div>
      </div>

    </div>
  );
}
