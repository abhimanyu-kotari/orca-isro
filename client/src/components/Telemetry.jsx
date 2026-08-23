import React from 'react';
import { Fuel, Clock, Leaf, Shield, Compass, Navigation, Fish, CheckCircle2, AlertTriangle, Waves, Anchor } from 'lucide-react';

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
      
      {/* 1. Target Fish Shoal & Biomass Card */}
      <div className="bg-gradient-to-br from-marine-900/95 via-marine-850 to-marine-950 border border-biolum-teal/40 rounded-2xl p-4 shadow-xl relative overflow-hidden group hover:border-biolum-teal transition duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-biolum-teal/10 rounded-full blur-xl group-hover:bg-biolum-teal/20 transition"></div>
        <div className="flex items-center justify-between text-xs text-biolum-teal font-bold tracking-wide">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🐟</span> Target Marine Shoal
          </span>
          <span className="bg-biolum-teal/20 text-biolum-teal px-2 py-0.5 rounded-full text-[10px] font-mono">
            {hotspot?.confidence_score || 94}% Yield
          </span>
        </div>
        <div className="mt-2">
          <div className="text-sm sm:text-base font-extrabold text-white truncate">
            {hotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ)"}
          </div>
          <p className="text-[11px] text-marine-200 mt-1 font-mono flex items-center gap-2">
            <span>📍 {hotspot?.distance_nm || 20} NM offshore</span>
            <span>🌡️ {hotspot?.sst_celsius || 27.8}°C</span>
          </p>
        </div>
      </div>

      {/* 2. Fuel & Ocean Current Assistance */}
      <div className="bg-gradient-to-br from-marine-900/95 via-marine-850 to-marine-950 border border-biolum-aqua/40 rounded-2xl p-4 shadow-xl relative overflow-hidden group hover:border-biolum-aqua transition duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-biolum-aqua/10 rounded-full blur-xl group-hover:bg-biolum-aqua/20 transition"></div>
        <div className="flex items-center justify-between text-xs text-biolum-aqua font-bold tracking-wide">
          <span className="flex items-center gap-1.5">
            <Fuel className="w-4 h-4" /> Diesel Saved
          </span>
          <span className="bg-biolum-aqua/20 text-biolum-aqua px-2 py-0.5 rounded-full text-[10px] font-mono">
            -{savingsPct}% Burn
          </span>
        </div>
        <div className="mt-2">
          <div className="text-xl sm:text-2xl font-black text-white font-mono">₹{fuelSaved.toLocaleString()}</div>
          <p className="text-[11px] text-marine-200 mt-1 font-mono flex items-center gap-1.5">
            <span className="text-biolum-teal font-semibold">🌊 +{weather?.ocean_current_knots || 1.3} kts Drift Assist</span>
            <span>({litresSaved} L)</span>
          </p>
        </div>
      </div>

      {/* 3. Voyage Duration & Carbon Offset */}
      <div className="bg-gradient-to-br from-marine-900/95 via-marine-850 to-marine-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition"></div>
        <div className="flex items-center justify-between text-xs text-biolum-emerald font-bold tracking-wide">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Time Saved
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-mono">
            🌿 {co2Reduction} kg CO₂
          </span>
        </div>
        <div className="mt-2">
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeSaved} mins</div>
          <p className="text-[11px] text-marine-200 mt-1 font-mono">
            Eff. Cruising: {route?.effective_speed_knots || 10.4} knots
          </p>
        </div>
      </div>

      {/* 4. Coral Reef & IMBL Boundary Clearance */}
      <div className={`bg-gradient-to-br via-marine-850 to-marine-950 border rounded-2xl p-4 shadow-xl relative overflow-hidden group transition duration-300 ${
        imblDist > 15
          ? 'from-marine-900/95 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
          : 'from-amber-950/80 border-biolum-amber/50 text-amber-300 hover:border-amber-400'
      }`}>
        <div className="flex items-center justify-between text-xs font-bold tracking-wide">
          <span className="flex items-center gap-1.5">
            <span className="text-base">🪸</span> IMBL Border Safety
          </span>
          <Shield className="w-4 h-4 text-biolum-teal" />
        </div>
        <div className="mt-2">
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{imblDist} km</div>
          <p className="text-[11px] mt-1 font-semibold flex items-center gap-1.5">
            {imblDist > 15 ? <CheckCircle2 className="w-3.5 h-3.5 text-biolum-emerald" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            <span className="text-white">{imblStatus}</span>
            <span className="text-[10px] text-marine-300 font-mono">(Territorial Waters)</span>
          </p>
        </div>
      </div>

    </div>
  );
}
