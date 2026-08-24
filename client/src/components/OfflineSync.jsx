import React, { useState, useEffect } from 'react';
import { DownloadCloud, CheckCircle2, WifiOff, Wifi, FileText, Trash2, X, ShieldCheck, Compass, Fuel, Ship, Printer, PhoneCall, AlertTriangle, QrCode } from 'lucide-react';

export default function OfflineSync({ harbor, selectedHotspot, route, weather, isOffline, onToggleOffline, selectedLang = 'en' }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cachedData, setCachedData] = useState(null);

  // Vernacular translations for Fisherman UI
  const t = {
    kn: {
      barTitle: "ಆಳಸಮುದ್ರ ಆಫ್‌ಲೈನ್ ಪಾಸ್ (0-ನೆಟ್‌ವರ್ಕ್)",
      barDesc: "ಸಮುದ್ರಕ್ಕೆ ಹೋಗುವ ಮುನ್ನ ದೋಣಿಯ ಯಾನ ಪಾಸ್ ಮತ್ತು GPS ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
      btnGetPass: "ದೋಣಿ ಪಾಸ್ ಪಡೆಯಿರಿ 🎫",
      btnViewPass: "ಪಾಸ್ ವೀಕ್ಷಿಸಿ 📄",
      btnOfflineMode: "0-ಇಂಟರ್ನೆಟ್ ಸಿಮ್ಯುಲೇಟರ್",
      passTitle: "ಮೀನುಗಾರರ ಅಧಿಕೃತ ಯಾನ ಪಾಸ್",
      passSub: "ISRO ಸಮುದ್ರ ಸಂಚರಣಾ ಭದ್ರತಾ ಪ್ರಮಾಣಪತ್ರ • PS-26176",
      targetShoal: "ಗುರಿ ಮೀನಿನ ವಲಯ (PFZ)",
      dieselSaved: "ಉಳಿತಾಯವಾಗುವ ಡೀಸೆಲ್",
      borderSafety: "ಗಡಿ ಭದ್ರತೆ (IMBL)",
      steerGuide: "ದಿಕ್ಸೂಚಿ ಮಾರ್ಗದರ್ಶನ (ಹಂತ ಹಂತವಾಗಿ)",
      emergencySos: "ತುರ್ತು ಕೋಸ್ಟ್ ಗಾರ್ಡ್ ಸಹಾಯವಾಣಿ",
      printBtn: "ಪಾಸ್ ಪ್ರಿಂಟ್ / ಸೇವ್ ಮಾಡಿ 🖨️"
    },
    ta: {
      barTitle: "ஆழ்கடல் ஆஃப்லைன் பாஸ் (0-இணையம்)",
      barDesc: "கடலுக்குச் செல்லும் முன் படகு பாஸ் மற்றும் GPS வழிகளைப் பதிவிறக்கவும்.",
      btnGetPass: "படகு பாஸ் பெறுக 🎫",
      btnViewPass: "பாஸ் பார்க்க 📄",
      btnOfflineMode: "0-இணைய சிமுலேட்டர்",
      passTitle: "மீனவர் அதிகாரப்பூர்வ பயண பாஸ்",
      passSub: "ISRO கடல்சார் பாதுகாப்பு சான்றிதழ் • PS-26176",
      targetShoal: "இலக்கு மீன் பகுதி (PFZ)",
      dieselSaved: "சேமிக்கப்பட்ட டீசல்",
      borderSafety: "எல்லை பாதுகாப்பு (IMBL)",
      steerGuide: "திசைகாட்டி வழிகாட்டல் (படி படியாக)",
      emergencySos: "கடலோர காவல்படை அவசர உதவி",
      printBtn: "பாஸ் அச்சிட / சேமிக்க 🖨️"
    },
    hi: {
      barTitle: "गहरे समुद्र का ऑफलाइन पास (0-इंटरनेट)",
      barDesc: "समुद्र में जाने से पहले नाव का यात्रा पास और GPS पॉइंट्स डाउनलोड करें।",
      btnGetPass: "नाव पास प्राप्त करें 🎫",
      btnViewPass: "पास देखें 📄",
      btnOfflineMode: "0-इंटरनेट सिम्युलेटर",
      passTitle: "मछुआरा आधिकारिक यात्रा पास",
      passSub: "ISRO समुद्री सुरक्षा प्रमाणपत्र • PS-26176",
      targetShoal: "लक्षित मछली क्षेत्र (PFZ)",
      dieselSaved: "बचाया गया डीजल",
      borderSafety: "सीमा सुरक्षा (IMBL)",
      steerGuide: "कम्पास दिशा-निर्देश (चरण-दर-चरण)",
      emergencySos: "तटरक्षक आपातकालीन हेल्पलाइन",
      printBtn: "पास प्रिंट / सेव करें 🖨️"
    },
    en: {
      barTitle: "Deep-Sea 0-Network Voyage Pass",
      barDesc: "Download offline GPS waypoints and compass guide before sailing out.",
      btnGetPass: "Get Fisherman Pass 🎫",
      btnViewPass: "View Pass 📄",
      btnOfflineMode: "Simulate 0-Internet",
      passTitle: "OFFICIAL FISHERMAN VOYAGE PASS",
      passSub: "ISRO Marine Navigation Clearance • PS-26176",
      targetShoal: "Target Fish Shoal (PFZ)",
      dieselSaved: "Estimated Diesel Saved",
      borderSafety: "Border Safety (IMBL)",
      steerGuide: "Compass Steer Waypoints",
      emergencySos: "Coast Guard Emergency Helplines",
      printBtn: "Print / Save Official Pass 🖨️"
    }
  };

  const curT = t[selectedLang] || t.en;

  // Load existing cache on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orca_offline_voyage_package');
      if (saved) {
        setCachedData(JSON.parse(saved));
      }
    } catch (e) {}
  }, [isSaved]);

  const handleSaveAndDownload = () => {
    const vessel = route?.vessel_profile || {
      name: 'Mechanized Trawler (45–110 HP)',
      vessel_reg: 'IND-KA-02-MM-1842',
      burn_rate_lph: 20.0
    };

    const bundle = {
      project: "PROJECT ORCA - ISRO SIH PS: 26176",
      passId: `ORCA-${Date.now().toString().slice(-6)}`,
      exportTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      vesselProfile: {
        name: vessel.name,
        reg: vessel.vessel_reg || 'IND-KA-02-MM-1842',
        burnRate: `${vessel.burn_rate_lph} L/hr`,
        speed: `${vessel.cruising_speed_knots || 10.4} kts`
      },
      originHarbor: {
        name: harbor?.name || "Malpe Fishing Harbour",
        state: harbor?.state || "Karnataka",
        coast: harbor?.coast || "Arabian Sea",
        coordinates: [harbor?.lat || 13.35, harbor?.lng || 74.69]
      },
      targetPFZ: {
        id: selectedHotspot?.id || "PFZ-1",
        name: selectedHotspot?.name || "Hotspot A",
        species: selectedHotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ / அயலை)",
        confidence: `${selectedHotspot?.confidence_score || 97}%`,
        coordinates: [selectedHotspot?.lat || 13.52, selectedHotspot?.lng || 74.32],
        distance_nm: `${selectedHotspot?.distance_nm || 20} NM`,
        sst_celsius: `${selectedHotspot?.sst_celsius || 27.4}°C`,
        chlorophyll: `${selectedHotspot?.chlorophyll_mg_m3 || 2.2} mg/m³`,
        depth: `${selectedHotspot?.depth_meters || 42}m`
      },
      navigationRoute: {
        fuelSavings: `${route?.fuel_savings_percentage || 28.5}%`,
        dieselSavedLitres: `${route?.diesel_saved_litres_roundtrip || 8.9} L`,
        costSavedINR: `₹${route?.cost_saved_inr || 846}`,
        waypoints: route?.ai_waypoints || [
          { step: 1, label: "Harbour Departure", lat: harbor?.lat || 13.35, lng: harbor?.lng || 74.69, heading: "298° WNW" },
          { step: 2, label: "Current Drift Catch", lat: 13.39, lng: 74.58, heading: "302° WNW" },
          { step: 3, label: "Outer Shelf Turn", lat: 13.46, lng: 74.45, heading: "305° NW" },
          { step: 4, label: "PFZ Target Shoal", lat: 13.52, lng: 74.32, heading: "Arrived" }
        ]
      },
      safetyAndWeather: {
        seaState: weather?.sea_state || "Calm / Moderate",
        waveHeight: `${weather?.wave_height_m || 0.95}m`,
        imblSafetyStatus: "SAFE (> 15 km clear of IMBL)"
      }
    };

    try {
      localStorage.setItem('orca_offline_voyage_package', JSON.stringify(bundle));
      setCachedData(bundle);
      setIsSaved(true);
      setShowPass(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('orca_offline_voyage_package');
    setCachedData(null);
    setShowPass(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeData = cachedData || {
    passId: "ORCA-849201",
    exportTimestamp: new Date().toLocaleString('en-IN'),
    vesselProfile: {
      name: "Motorized Fibre Boat (9.9 HP OBM)",
      reg: "IND-KA-02-FB-0921",
      burnRate: "6.5 L/hr"
    },
    originHarbor: {
      name: harbor?.name || "Malpe Fishing Harbour",
      state: harbor?.state || "Karnataka",
      coast: harbor?.coast || "Arabian Sea"
    },
    targetPFZ: {
      species: selectedHotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ / அயலை)",
      confidence: `${selectedHotspot?.confidence_score || 97}%`,
      distance_nm: `${selectedHotspot?.distance_nm || 20} NM`,
      sst_celsius: `${selectedHotspot?.sst_celsius || 27.4}°C`,
      depth: "42m"
    },
    navigationRoute: {
      costSavedINR: `₹${route?.cost_saved_inr || 846}`,
      dieselSavedLitres: `${route?.diesel_saved_litres_roundtrip || 8.9} L`,
      waypoints: route?.ai_waypoints || []
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ON-SCREEN OFFSCREEN SYNC STRIP (Clean & High-Contrast for Fishermen) */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/15">
        
        <div className="flex items-center gap-3.5">
          <img 
            src="/assets/orca_logo.png" 
            alt="ORCA Emblem" 
            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_20px_rgba(0,245,160,0.4)] shrink-0"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h4 className="text-xs sm:text-sm font-black text-white tracking-wide">{curT.barTitle}</h4>
              <span className="text-[10px] bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 px-2.5 py-0.5 rounded-full font-mono font-black">100% OFFLINE</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {cachedData ? (
                <span className="text-emerald-400 font-bold">✓ Pass Saved on Phone &bull; Ready for 0-Internet Deep-Sea Sailing</span>
              ) : (
                <span>{curT.barDesc}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          
          {/* Download for Sea Button */}
          <button
            onClick={handleSaveAndDownload}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 font-black px-5 py-3 rounded-2xl transition shadow-[0_0_30px_rgba(0,245,160,0.35)]"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-slate-950 animate-bounce" /> : <DownloadCloud className="w-4 h-4" />}
            <span>{isSaved ? 'Pass Created!' : curT.btnGetPass}</span>
          </button>

          {/* View Pass Button */}
          {cachedData && (
            <button
              onClick={() => setShowPass(true)}
              className="flex items-center gap-1.5 text-xs bg-white/[0.08] hover:bg-white/15 text-emerald-300 px-4 py-3 rounded-2xl border border-white/20 transition font-bold shadow"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{curT.btnViewPass}</span>
            </button>
          )}

          {/* 0-Internet Simulator */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center justify-center gap-2 text-xs px-3.5 py-3 rounded-2xl border transition font-bold ${
              isOffline
                ? 'bg-amber-500/25 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-white/[0.05] border-white/15 text-slate-300 hover:text-white'
            }`}
            title="Toggle Deep-Sea 0-Internet Mode"
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-slate-400" />}
            <span className="hidden md:inline">{isOffline ? '0-Internet Active' : curT.btnOfflineMode}</span>
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. HIGH-CONTRAST SCREEN MODAL (Interactive for Phone & Cockpit) */}
      {/* ========================================================================= */}
      {showPass && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#020b17] border-2 border-emerald-500/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,1)] space-y-4 animate-fadeIn text-white ring-1 ring-emerald-500/30">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/orca_logo.png" 
                  alt="Official Emblem" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_20px_rgba(0,245,160,0.5)]"
                />
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-wide text-white">{curT.passTitle}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono">{curT.passSub}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPass(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Registered Vessel & Port Strip */}
            <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <Ship className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-black text-xs sm:text-sm">{activeData.vesselProfile?.name}</div>
                  <div className="text-[11px] text-slate-300">
                    Reg: <strong className="text-emerald-300 font-bold">{activeData.vesselProfile?.reg}</strong> &bull; ⚓ {activeData.originHarbor?.name?.split('(')[0]}
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px] text-cyan-300 font-black shrink-0">
                {activeData.vesselProfile?.burnRate}
              </div>
            </div>

            {/* Target Catch Card */}
            <div className="bg-white/[0.05] border border-emerald-400/40 rounded-2xl p-4 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="text-lg">🐟</span> {curT.targetShoal}
                </span>
                <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black">
                  {activeData.targetPFZ?.confidence} Match
                </span>
              </div>
              <p className="text-base font-black text-white">{activeData.targetPFZ?.species}</p>
              <div className="flex items-center justify-between text-xs text-slate-200 pt-2 border-t border-white/10 font-mono">
                <span>📍 Distance: <strong className="text-cyan-300 font-bold">{activeData.targetPFZ?.distance_nm}</strong></span>
                <span>🌡️ Water Temp: <strong className="text-emerald-300 font-bold">{activeData.targetPFZ?.sst_celsius}</strong></span>
                <span>🌊 Depth: <strong className="text-white font-bold">{activeData.targetPFZ?.depth}</strong></span>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/[0.05] border border-cyan-400/40 p-3 rounded-2xl">
                <div className="text-[11px] text-cyan-300 font-bold flex items-center justify-center gap-1">
                  <Fuel className="w-3.5 h-3.5" /> {curT.dieselSaved}
                </div>
                <div className="text-xl font-black text-white font-mono mt-1">
                  {activeData.navigationRoute?.costSavedINR}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {activeData.navigationRoute?.dieselSavedLitres} saved
                </div>
              </div>

              <div className="bg-white/[0.05] border border-emerald-400/40 p-3 rounded-2xl">
                <div className="text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {curT.borderSafety}
                </div>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  SAFE
                </div>
                <div className="text-[10px] text-slate-300 font-semibold">
                  Clear of IMBL line
                </div>
              </div>
            </div>

            {/* Steer Waypoints Table */}
            <div className="bg-white/[0.04] border border-white/15 rounded-2xl p-3.5 space-y-2">
              <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" /> {curT.steerGuide}
              </h5>
              <div className="space-y-1.5 text-xs text-slate-200 font-mono max-h-32 overflow-y-auto pr-1">
                {activeData.navigationRoute?.waypoints?.map((w, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/[0.08] text-xs">
                    <span className="text-cyan-400 font-bold">Step {w.step || idx + 1}:</span>
                    <span className="text-white font-sans font-medium">{w.label}</span>
                    <span className="text-emerald-300 font-bold">{w.lat?.toFixed(2)}°, {w.lng?.toFixed(2)}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coast Guard Emergency Helplines */}
            <div className="bg-rose-500/15 border border-rose-400/40 rounded-2xl p-2.5 flex items-center justify-between text-xs text-rose-300 font-mono">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>Coast Guard SOS: <strong>1554</strong> &bull; VHF: <strong>Ch-16</strong></span>
              </div>
              <span className="text-[10px] text-slate-300">24/7 SAR</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/25 px-3.5 py-2.5 rounded-xl transition font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-xs bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 font-black px-6 py-3 rounded-2xl transition shadow-xl shadow-emerald-500/30"
              >
                <Printer className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{curT.printBtn}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEDICATED OFFICIAL PRINTABLE PASS (Visible ONLY when printing!) */}
      {/* ========================================================================= */}
      <div className="print-only-container hidden">
        <div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'Arial, sans-serif', color: '#000', border: '3px solid #000', borderRadius: '12px', padding: '24px', backgroundColor: '#fff' }}>
          
          {/* Print Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src="/assets/orca_logo.png" alt="ISRO Project ORCA" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid #000' }} />
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0', letterSpacing: '0.5px' }}>OFFICIAL FISHERMAN VOYAGE PASS</h1>
                <p style={{ fontSize: '12px', margin: '3px 0 0 0', fontWeight: 'bold', color: '#333' }}>
                  ISRO Marine EcoSystem Platform &bull; PS-26176 &bull; Govt of India
                </p>
                <p style={{ fontSize: '11px', margin: '2px 0 0 0', color: '#555' }}>
                  Pass ID: <strong>{activeData.passId}</strong> &bull; Generated: {activeData.exportTimestamp}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ border: '2px solid #047857', padding: '6px 12px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', fontWeight: 'bold', fontSize: '12px' }}>
                APPROVED FOR DEEP SEA
              </div>
              <div style={{ fontSize: '10px', marginTop: '4px', color: '#666' }}>100% 0-Internet Ready</div>
            </div>
          </div>

          {/* Boat & Origin Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>REGISTERED VESSEL:</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{activeData.vesselProfile?.name}</div>
              <div style={{ fontSize: '12px', color: '#334155' }}>Reg: <strong>{activeData.vesselProfile?.reg}</strong></div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>DEPARTURE HARBOUR:</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{activeData.originHarbor?.name}</div>
              <div style={{ fontSize: '12px', color: '#334155' }}>{activeData.originHarbor?.state} &bull; {activeData.originHarbor?.coast}</div>
            </div>
          </div>

          {/* Target Fish Shoal */}
          <div style={{ border: '2px solid #0284c7', borderRadius: '8px', padding: '14px', marginBottom: '16px', backgroundColor: '#f0f9ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0369a1' }}>🎯 TARGET POTENTIAL FISHING ZONE (PFZ)</span>
              <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>
                {activeData.targetPFZ?.confidence} MATCH
              </span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#0c4a6e' }}>
              {activeData.targetPFZ?.species}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '12px', color: '#0369a1', fontWeight: 'bold' }}>
              <span>Distance: {activeData.targetPFZ?.distance_nm}</span>
              <span>Water Temp: {activeData.targetPFZ?.sst_celsius}</span>
              <span>Depth: {activeData.targetPFZ?.depth}</span>
            </div>
          </div>

          {/* Steer Compass & Fuel Saved */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ border: '2px solid #059669', borderRadius: '8px', padding: '12px', backgroundColor: '#ecfdf5', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#047857' }}>ESTIMATED DIESEL SAVINGS</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#065f46', marginTop: '4px' }}>{activeData.navigationRoute?.costSavedINR}</div>
              <div style={{ fontSize: '11px', color: '#047857' }}>{activeData.navigationRoute?.dieselSavedLitres} saved via surface currents</div>
            </div>
            <div style={{ border: '2px solid #059669', borderRadius: '8px', padding: '12px', backgroundColor: '#ecfdf5', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#047857' }}>BORDER STATUS (IMBL)</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#065f46', marginTop: '4px' }}>SAFE VOYAGE</div>
              <div style={{ fontSize: '11px', color: '#047857' }}>Clear of International Boundaries</div>
            </div>
          </div>

          {/* Navigation Waypoint Table */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '8px' }}>
              🧭 STEP-BY-STEP COMPASS STEERING WAYPOINTS:
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '6px' }}>Step</th>
                  <th style={{ padding: '6px' }}>Action / Waypoint</th>
                  <th style={{ padding: '6px' }}>GPS Latitude</th>
                  <th style={{ padding: '6px' }}>GPS Longitude</th>
                </tr>
              </thead>
              <tbody>
                {activeData.navigationRoute?.waypoints?.map((w, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '6px', fontWeight: 'bold' }}>Step {w.step || idx + 1}</td>
                    <td style={{ padding: '6px' }}>{w.label}</td>
                    <td style={{ padding: '6px', fontFamily: 'monospace', fontWeight: 'bold' }}>{w.lat?.toFixed(3)}° N</td>
                    <td style={{ padding: '6px', fontFamily: 'monospace', fontWeight: 'bold' }}>{w.lng?.toFixed(3)}° E</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safety & Emergency Footer */}
          <div style={{ borderTop: '2px solid #000', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
            <div>
              <strong>🚨 INDIAN COAST GUARD EMERGENCY:</strong> Toll-Free <strong>1554</strong> &bull; Marine VHF <strong>Channel 16</strong>
            </div>
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              Project ORCA &bull; ISRO Smart India Hackathon
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
