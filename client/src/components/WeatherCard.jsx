import React from 'react';
import { Waves, Wind, Compass, AlertOctagon, CheckCircle2, ShieldCheck, ThermometerSun } from 'lucide-react';

export default function WeatherCard({ weather, hotspot }) {
  const waveHeight = weather?.wave_height_m || 0.9;
  const wavePeriod = weather?.wave_period_sec || 6.5;
  const currentKnots = weather?.ocean_current_knots || 1.3;
  const currentDir = weather?.ocean_current_compass || 'SE';
  const windSpeed = weather?.wind_speed_knots || 12.0;
  const seaState = weather?.sea_state || 'Calm to Moderate';
  const safetyStatus = weather?.safety_status || 'SAFE';
  const verdict = weather?.advisory_verdict || 'Normal fishing operations permitted. Favorable drift.';

  return (
    <div className="bg-ocean-900/80 border border-ocean-700/80 rounded-2xl p-4 shadow-xl space-y-3">
      
      {/* Header with Sea Safety Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Live Ocean & Weather State</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide ${
          safetyStatus === 'SAFE' || safetyStatus === 'EXCELLENT'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
        }`}>
          {safetyStatus}
        </span>
      </div>

      {/* 4-Grid Weather Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Wave Height */}
        <div className="bg-ocean-950/60 border border-ocean-800 p-2.5 rounded-xl">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-cyan-400" /> Sig. Wave
          </span>
          <p className="text-base font-extrabold text-slate-100 font-mono mt-1">{waveHeight} m</p>
          <p className="text-[10px] text-slate-400 font-mono">Period: {wavePeriod}s</p>
        </div>

        {/* Ocean Current Vector */}
        <div className="bg-ocean-950/60 border border-ocean-800 p-2.5 rounded-xl">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-400" /> Surface Current
          </span>
          <p className="text-base font-extrabold text-slate-100 font-mono mt-1">{currentKnots} kts</p>
          <p className="text-[10px] text-cyan-300 font-mono">Heading: {currentDir}</p>
        </div>

        {/* Wind Speed */}
        <div className="bg-ocean-950/60 border border-ocean-800 p-2.5 rounded-xl">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-sky-400" /> Marine Wind
          </span>
          <p className="text-base font-extrabold text-slate-100 font-mono mt-1">{windSpeed} kts</p>
          <p className="text-[10px] text-slate-400 font-mono">Moderate Breeze</p>
        </div>

        {/* Satellite SST & Chlorophyll */}
        <div className="bg-ocean-950/60 border border-ocean-800 p-2.5 rounded-xl">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ThermometerSun className="w-3.5 h-3.5 text-amber-400" /> Satellite SST
          </span>
          <p className="text-base font-extrabold text-slate-100 font-mono mt-1">{hotspot?.sst_celsius || 27.8} °C</p>
          <p className="text-[10px] text-emerald-400 font-mono">Chl-a: {hotspot?.chlorophyll_mg_m3 || 1.65} mg/m³</p>
        </div>

      </div>

      {/* Advisory Verdict Banner */}
      <div className="bg-gradient-to-r from-ocean-950 to-blue-950/50 border border-ocean-700/60 rounded-xl p-3 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-slate-200">{seaState}</p>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{verdict}</p>
        </div>
      </div>

    </div>
  );
}
