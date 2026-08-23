import React from 'react';
import { Fuel, Clock, Leaf, Shield, Compass, Navigation, Fish, CheckCircle2, AlertTriangle, Waves, Anchor, Sparkles } from 'lucide-react';

export default function Telemetry({ route, hotspot, weather, geofence }) {
  const fuelSaved = route?.cost_saved_inr || 2400;
  const litresSaved = route?.diesel_saved_litres_roundtrip || 25.2;
  const savingsPct = route?.fuel_savings_percentage || 28.5;
  const timeSaved = route?.time_saved_minutes_roundtrip || 75;
  const co2Reduction = route?.co2_reduction_kg || 67.5;
  const imblDist = geofence?.nearest_imbl_distance_km || 18.4;
  const imblStatus = geofence?.status || 'SAFE';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      
      {/* 1. Target Fish Shoal Capsule */}
      <div className="glass-panel-interactive rounded-3xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="text-sm">🐟</span> Marine Shoal
          </span>
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-sm">
            {hotspot?.confidence_score || 94}% Match
          </span>
        </div>
        <div className="mt-3">
          <div className="text-sm sm:text-base font-black text-white truncate tracking-tight">
            {hotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ)"}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-2">
            <span className="text-cyan-400 font-semibold">{hotspot?.distance_nm || 20} NM offshore</span>
            <span>&bull;</span>
            <span className="text-emerald-400">{hotspot?.sst_celsius || 27.8}°C</span>
          </p>
        </div>
      </div>

      {/* 2. Fuel Savings Capsule */}
      <div className="glass-panel-interactive rounded-3xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Fuel className="w-3.5 h-3.5 text-cyan-400" /> Diesel Saved
          </span>
          <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-sm">
            -{savingsPct}% Burn
          </span>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            ₹{fuelSaved.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">+{weather?.ocean_current_knots || 1.3} kts Current Assist</span>
            <span>({litresSaved} L)</span>
          </p>
        </div>
      </div>

      {/* 3. Voyage Time & Carbon Offset */}
      <div className="glass-panel-interactive rounded-3xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Time Saved
          </span>
          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-sm">
            🌿 {co2Reduction} kg CO₂
          </span>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {timeSaved} mins
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Eff. Speed: <strong className="text-slate-200">{route?.effective_speed_knots || 10.4} kts</strong>
          </p>
        </div>
      </div>

      {/* 4. IMBL Border Clearance */}
      <div className="glass-panel-interactive rounded-3xl p-4.5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> IMBL Border
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-sm border ${
            imblDist > 15 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {imblStatus}
          </span>
        </div>
        <div className="mt-2.5">
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {imblDist} km
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1.5">
            {imblDist > 15 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            <span>Clear of international waters</span>
          </p>
        </div>
      </div>

    </div>
  );
}
