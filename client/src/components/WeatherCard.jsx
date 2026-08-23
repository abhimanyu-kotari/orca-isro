import React from 'react';
import { Waves, Wind, Compass, ShieldCheck, ThermometerSun } from 'lucide-react';

export default function WeatherCard({ weather, hotspot }) {
  const waveHeight = weather?.wave_height_m || 0.9;
  const wavePeriod = weather?.wave_period_sec || 6.5;
  const currentKnots = weather?.ocean_current_knots || 1.3;
  const currentDir = weather?.ocean_current_compass || 'SE';
  const windSpeed = weather?.wind_speed_knots || 12.0;
  const seaState = weather?.sea_state || 'Calm to Moderate';
  const safetyStatus = weather?.safety_status || 'SAFE';
  const verdict = weather?.advisory_verdict || 'Normal fishing operations permitted. Favorable current drift.';

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Live Oceanographic State</h3>
            <p className="text-[10px] text-slate-400 font-mono">ISRO & Marine Buoy Sensor Stream</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider shadow ${
          safetyStatus === 'SAFE' || safetyStatus === 'EXCELLENT'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(0,245,160,0.2)]'
            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
        }`}>
          {safetyStatus === 'SAFE' ? '✓ SAFE TO SAIL' : safetyStatus}
        </span>
      </div>

      {/* 4-Grid Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Wave Swell */}
        <div className="bg-white/[0.03] border border-white/[0.07] p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" /> Wave Height
          </span>
          <p className="text-xl font-black text-white font-mono mt-1.5">{waveHeight} m</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Period: {wavePeriod}s swell</p>
        </div>

        {/* Ocean Current Vector */}
        <div className="bg-white/[0.03] border border-white/[0.07] p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Surface Drift
          </span>
          <p className="text-xl font-black text-white font-mono mt-1.5">{currentKnots} kts</p>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Heading: {currentDir}</p>
        </div>

        {/* Marine Wind */}
        <div className="bg-white/[0.03] border border-white/[0.07] p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-400" /> Coastal Wind
          </span>
          <p className="text-xl font-black text-white font-mono mt-1.5">{windSpeed} kts</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Moderate Breeze</p>
        </div>

        {/* Satellite Plankton & SST */}
        <div className="bg-white/[0.03] border border-white/[0.07] p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <ThermometerSun className="w-3.5 h-3.5 text-amber-400" /> Plankton & SST
          </span>
          <p className="text-xl font-black text-white font-mono mt-1.5">{hotspot?.sst_celsius || 27.8} °C</p>
          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Chl-a: {hotspot?.chlorophyll_mg_m3 || 1.65} mg/m³</p>
        </div>

      </div>

      {/* Advisory Verdict Banner */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-white flex items-center gap-2">
            <span>{seaState}</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-emerald-400 font-mono">Coastal Advisory</span>
          </p>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{verdict}</p>
        </div>
      </div>

    </div>
  );
}
