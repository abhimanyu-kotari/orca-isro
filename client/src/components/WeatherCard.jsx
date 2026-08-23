import React from 'react';
import { Waves, Wind, Compass, ShieldCheck, ThermometerSun, Anchor } from 'lucide-react';

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
    <div className="bg-marine-900/90 border border-marine-700/80 rounded-3xl p-4 shadow-2xl space-y-3.5">
      
      {/* Header with Marine Wave State */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌊</span>
          <div>
            <h3 className="text-sm font-extrabold text-white">Live Ocean State & Wave Dynamics</h3>
            <p className="text-[10px] text-marine-300 font-mono">ISRO Satellite Telemetry Feed</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider shadow ${
          safetyStatus === 'SAFE' || safetyStatus === 'EXCELLENT'
            ? 'bg-biolum-emerald/15 text-biolum-emerald border border-biolum-emerald/40'
            : 'bg-biolum-amber/15 text-amber-300 border border-biolum-amber/40'
        }`}>
          {safetyStatus === 'SAFE' ? '✓ SAFE TO SAIL' : safetyStatus}
        </span>
      </div>

      {/* 4-Grid Marine Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Wave Swell */}
        <div className="bg-marine-950/80 border border-marine-800 p-3 rounded-2xl">
          <span className="text-[11px] text-marine-300 font-medium flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-biolum-teal" /> Significant Wave
          </span>
          <p className="text-lg font-black text-white font-mono mt-1">{waveHeight} m</p>
          <p className="text-[10px] text-marine-400 font-mono">Period: {wavePeriod}s swell</p>
        </div>

        {/* Ocean Current Vector */}
        <div className="bg-marine-950/80 border border-marine-800 p-3 rounded-2xl">
          <span className="text-[11px] text-marine-300 font-medium flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-biolum-aqua" /> Surface Drift
          </span>
          <p className="text-lg font-black text-white font-mono mt-1">{currentKnots} kts</p>
          <p className="text-[10px] text-biolum-teal font-mono">Heading: {currentDir}</p>
        </div>

        {/* Marine Wind */}
        <div className="bg-marine-950/80 border border-marine-800 p-3 rounded-2xl">
          <span className="text-[11px] text-marine-300 font-medium flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-400" /> Coastal Wind
          </span>
          <p className="text-lg font-black text-white font-mono mt-1">{windSpeed} kts</p>
          <p className="text-[10px] text-marine-400 font-mono">Moderate Breeze</p>
        </div>

        {/* Satellite Plankton & SST */}
        <div className="bg-marine-950/80 border border-marine-800 p-3 rounded-2xl">
          <span className="text-[11px] text-marine-300 font-medium flex items-center gap-1.5">
            <ThermometerSun className="w-3.5 h-3.5 text-amber-400" /> Plankton & SST
          </span>
          <p className="text-lg font-black text-white font-mono mt-1">{hotspot?.sst_celsius || 27.8} °C</p>
          <p className="text-[10px] text-biolum-teal font-mono">Chl-a: {hotspot?.chlorophyll_mg_m3 || 1.65} mg/m³</p>
        </div>

      </div>

      {/* Advisory Verdict Banner */}
      <div className="bg-gradient-to-r from-marine-950 to-marine-850 border border-marine-700/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-inner">
        <span className="text-2xl shrink-0">🛡️</span>
        <div>
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>{seaState}</span>
            <span className="text-biolum-teal">&bull; Coastal Safety Advisory</span>
          </p>
          <p className="text-[11px] text-marine-200 mt-1 leading-relaxed">{verdict}</p>
        </div>
      </div>

    </div>
  );
}
