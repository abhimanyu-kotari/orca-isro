import React from 'react';
import { Fuel, Clock, Leaf, Shield, Compass, Navigation, Fish, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Telemetry({ route, hotspot, weather, geofence }) {
  const fuelSaved = route?.cost_saved_inr || 2400;
  const litresSaved = route?.diesel_saved_litres_roundtrip || 25.2;
  const savingsPct = route?.fuel_savings_percentage || 28.5;
  const timeSaved = route?.time_saved_minutes_roundtrip || 75;
  const co2Reduction = route?.co2_reduction_kg || 67.5;
  const imblDist = geofence?.nearest_imbl_distance_km || 18.4;
  const imblStatus = geofence?.status || 'SAFE';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      
      {/* Fuel Savings Card */}
      <div className="bg-gradient-to-br from-cyan-950/80 to-ocean-900 border border-cyan-500/30 rounded-xl p-3.5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition"></div>
        <div className="flex items-center justify-between text-xs text-cyan-300 font-medium">
          <span>Diesel Saved</span>
          <Fuel className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-white font-mono">₹{fuelSaved.toLocaleString()}</div>
          <p className="text-[11px] text-cyan-200 mt-0.5 flex items-center gap-1 font-mono">
            <span>{litresSaved} Litres</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1 rounded">-{savingsPct}%</span>
          </p>
        </div>
      </div>

      {/* Voyage Time Saved */}
      <div className="bg-gradient-to-br from-blue-950/80 to-ocean-900 border border-blue-500/30 rounded-xl p-3.5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition"></div>
        <div className="flex items-center justify-between text-xs text-blue-300 font-medium">
          <span>Time Saved</span>
          <Clock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-white font-mono">{timeSaved} mins</div>
          <p className="text-[11px] text-blue-200 mt-0.5 font-mono">
            Eff. Speed: {route?.effective_speed_knots || 10.4} kts
          </p>
        </div>
      </div>

      {/* Carbon Offset Card */}
      <div className="bg-gradient-to-br from-emerald-950/80 to-ocean-900 border border-emerald-500/30 rounded-xl p-3.5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition"></div>
        <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
          <span>Carbon Offset</span>
          <Leaf className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-white font-mono">{co2Reduction} kg</div>
          <p className="text-[11px] text-emerald-200 mt-0.5 font-mono">CO₂ Emissions Cut</p>
        </div>
      </div>

      {/* Border Safety Status */}
      <div className={`bg-gradient-to-br to-ocean-900 border rounded-xl p-3.5 shadow-lg relative overflow-hidden group ${
        imblDist > 15
          ? 'from-emerald-950/80 border-emerald-500/30 text-emerald-300'
          : 'from-amber-950/80 border-amber-500/30 text-amber-300'
      }`}>
        <div className="flex items-center justify-between text-xs font-medium">
          <span>IMBL Border</span>
          <Shield className="w-4 h-4" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-white font-mono">{imblDist} km</div>
          <p className="text-[11px] mt-0.5 font-semibold flex items-center gap-1">
            {imblDist > 15 ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
            <span>{imblStatus}</span>
          </p>
        </div>
      </div>

    </div>
  );
}
