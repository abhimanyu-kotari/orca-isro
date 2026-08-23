import React from 'react';
import { Fuel, Clock, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Telemetry({ route, hotspot, weather, geofence }) {
  const fuelSaved = route?.cost_saved_inr || 2400;
  const litresSaved = route?.diesel_saved_litres_roundtrip || 25.2;
  const savingsPct = route?.fuel_savings_percentage || 28.5;
  const timeSaved = route?.time_saved_minutes_roundtrip || 75;
  const co2Reduction = route?.co2_reduction_kg || 67.5;
  const imblDist = geofence?.nearest_imbl_distance_km || 18.4;
  const imblStatus = geofence?.status || 'SAFE';

  // Format species name cleanly for mobile screens
  const rawSpecies = hotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ)";
  const cleanSpecies = rawSpecies.includes('/') 
    ? rawSpecies.split('/')[0].trim() + ')'
    : rawSpecies;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. Target Fish Shoal Capsule */}
      <div className="glass-panel-interactive rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[135px]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>🐟</span> <span className="truncate">Fish Shoal</span>
          </span>
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold shrink-0">
            {hotspot?.confidence_score || 94}%
          </span>
        </div>
        <div className="my-1.5">
          <div className="text-xs sm:text-sm font-black text-white line-clamp-2 leading-tight">
            {cleanSpecies}
          </div>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-white/[0.06] pt-1.5 mt-auto">
          <span className="text-cyan-400 font-semibold">{hotspot?.distance_nm || 20} NM</span>
          <span className="text-emerald-400 font-semibold">{hotspot?.sst_celsius || 27.8}°C</span>
        </div>
      </div>

      {/* 2. Fuel Savings Capsule */}
      <div className="glass-panel-interactive rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[135px]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Fuel Saved</span>
          </span>
          <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold shrink-0">
            -{savingsPct}%
          </span>
        </div>
        <div className="my-1">
          <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">
            ₹{fuelSaved.toLocaleString()}
          </div>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-white/[0.06] pt-1.5 mt-auto">
          <span className="text-emerald-400 truncate">+{weather?.ocean_current_knots || 1.3} kts assist</span>
          <span className="text-slate-300 font-semibold shrink-0">{litresSaved} L</span>
        </div>
      </div>

      {/* 3. Voyage Time Capsule */}
      <div className="glass-panel-interactive rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[135px]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Time Saved</span>
          </span>
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold shrink-0">
            🌿 {co2Reduction}kg
          </span>
        </div>
        <div className="my-1">
          <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">
            {timeSaved} mins
          </div>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-white/[0.06] pt-1.5 mt-auto">
          <span className="text-slate-300">Cruising Speed:</span>
          <span className="text-emerald-400 font-bold">{route?.effective_speed_knots || 10.4} kts</span>
        </div>
      </div>

      {/* 4. IMBL Border Capsule */}
      <div className="glass-panel-interactive rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[135px]">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">IMBL Border</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold border shrink-0 ${
            imblDist > 15 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {imblStatus}
          </span>
        </div>
        <div className="my-1">
          <div className="text-lg sm:text-2xl font-black text-white font-mono tracking-tight">
            {imblDist} km
          </div>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium flex items-center gap-1 border-t border-white/[0.06] pt-1.5 mt-auto">
          {imblDist > 15 ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />}
          <span className="truncate text-slate-300">Safe territorial zone</span>
        </div>
      </div>

    </div>
  );
}
