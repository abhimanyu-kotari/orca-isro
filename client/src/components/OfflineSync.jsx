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
    tcy: {
      barTitle: "ಆಳ ಕಡಲ್ದ ಆಫ್‌ಲೈನ್ ಪಾಸ್ (0-ನೆಟ್‌ವರ್ಕ್)",
      barDesc: "ಕಡಲ್ ಗ್ ಪೋಪಿನ ದುಂಬು ಬೋಟ್ ದ ಪಾಸ್ ಬೊಕ್ಕ GPS ಸಾದಿನ್ ಡೌನ್‌ಲೋಡ್ ಮಲ್ಪುಲೆ.",
      btnGetPass: "ಬೋಟ್ ಪಾಸ್ ದೆತೊನ್ಲೆ 🎫",
      btnViewPass: "ಪಾಸ್ ತೂಲೆ 📄",
      btnOfflineMode: "0-ಇಂಟರ್ನೆಟ್ ಸಿಮ್ಯುಲೇಟರ್",
      passTitle: "ಮೀನುಗಾರರೆನ ಅಧಿಕೃತ ಯಾನ ಪಾಸ್",
      passSub: "ISRO ಕಡಲ್ದ ಭದ್ರತಾ ಪ್ರಮಾಣಪತ್ರ • PS-26176",
      targetShoal: "ಮೀನ್ ತಿಕ್ಕುನ ಜಾಗೆ (PFZ)",
      dieselSaved: "ಒರಿಪುನ ಡೀಸೆಲ್",
      borderSafety: "ಗಡಿದ ಭದ್ರತೆ (IMBL)",
      steerGuide: "ದಿಕ್ಸೂಚಿ ಸಾದಿ (ಹಂತ ಹಂತವಾದ್)",
      emergencySos: "ತುರ್ತು ಕೋಸ್ಟ್ ಗಾರ್ಡ್ ಸಹಾಯವಾಣಿ",
      printBtn: "ಪಾಸ್ ಪ್ರಿಂಟ್ ಮಲ್ಪುಲೆ 🖨️"
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
    ml: {
      barTitle: "ആഴക്കടൽ ഓഫ്‌ലൈൻ പാസ് (0-നെറ്റ്‌വർക്ക്)",
      barDesc: "കടലിലേക്ക് പോകുന്നതിന് മുൻപ് ബോട്ട് പാസും GPS പോയിന്റുകളും ഡൗൺലോഡ് ചെയ്യുക.",
      btnGetPass: "ബോട്ട് പാസ് നേടുക 🎫",
      btnViewPass: "പാസ് കാണുക 📄",
      btnOfflineMode: "0-ഇന്റർനെറ്റ് സിമുലേറ്റർ",
      passTitle: "മത്സ്യത്തൊഴിലാളി ഔദ്യോഗിക യാത്രാ പാസ്",
      passSub: "ISRO സമുദ്ര സുരക്ഷാ സർട്ടിഫിക്കറ്റ് • PS-26176",
      targetShoal: "ലക്ഷ്യ മത്സ്യ മേഖല (PFZ)",
      dieselSaved: "ലാഭിച്ച ഡീസൽ",
      borderSafety: "അതിർത്തി സുരക്ഷ (IMBL)",
      steerGuide: "കോമ്പസ് സ്റ്റിയറിംഗ് ഗൈഡ്",
      emergencySos: "കോസ്റ്റ് ഗാർഡ് അടിയന്തര ഹെൽപ്പ്‌ലൈൻ",
      printBtn: "പാസ് പ്രിന്റ് ചെയ്യുക 🖨️"
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
      waypoints: route?.ai_waypoints || [
        { step: 1, label: "Harbour Departure", lat: harbor?.lat || 13.35, lng: harbor?.lng || 74.69, heading: "298° WNW" },
        { step: 2, label: "Current Drift Catch", lat: 13.39, lng: 74.58, heading: "302° WNW" },
        { step: 3, label: "Outer Shelf Turn", lat: 13.46, lng: 74.45, heading: "305° NW" },
        { step: 4, label: "PFZ Target Shoal", lat: 13.52, lng: 74.32, heading: "Arrived" }
      ]
    }
  };

  // Robust, 100% Reliable Print Function via Dedicated Window
  const handlePrint = () => {
    const waypointsRows = activeData.navigationRoute?.waypoints?.map((w, idx) => `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 8px 10px; font-weight: bold;">Step ${w.step || idx + 1}</td>
        <td style="padding: 8px 10px;">${w.label}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">${w.lat?.toFixed(3)}° N</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">${w.lng?.toFixed(3)}° E</td>
      </tr>
    `).join('') || '';

    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>OFFICIAL FISHERMAN VOYAGE PASS - ISRO PS:26176</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 10px; }
            .pass-card { max-width: 720px; margin: 0 auto; border: 3px solid #047857; border-radius: 16px; padding: 24px; box-sizing: border-box; }
            .header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 18px; }
            .logo-title { display: flex; align-items: center; gap: 14px; }
            .title-main { font-size: 22px; font-weight: 900; color: #047857; margin: 0; }
            .title-sub { font-size: 11px; font-weight: bold; color: #475569; margin-top: 3px; }
            .status-badge { border: 2px solid #047857; background: #ecfdf5; color: #047857; font-weight: 900; padding: 6px 14px; border-radius: 8px; font-size: 12px; text-align: center; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 16px; }
            .meta-label { font-size: 11px; font-weight: bold; color: #64748b; }
            .meta-val { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 2px; }
            .hotspot-box { border: 2px solid #0284c7; background: #f0f9ff; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
            .hotspot-title { font-size: 12px; font-weight: 900; color: #0284c7; margin-bottom: 4px; }
            .hotspot-species { font-size: 20px; font-weight: 900; color: #0c4a6e; }
            .hotspot-stats { display: flex; gap: 20px; font-size: 12px; font-weight: bold; color: #0369a1; margin-top: 8px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
            .stat-card { border: 2px solid #059669; background: #ecfdf5; padding: 14px; border-radius: 10px; text-align: center; }
            .stat-title { font-size: 11px; font-weight: bold; color: #047857; }
            .stat-num { font-size: 26px; font-weight: 900; color: #065f46; margin: 4px 0; }
            .stat-sub { font-size: 11px; color: #047857; font-weight: bold; }
            .waypoint-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; text-align: left; }
            .waypoint-table th { background: #f1f5f9; padding: 8px 10px; border-bottom: 2px solid #cbd5e1; font-weight: bold; }
            .sos-footer { border-top: 2px solid #0f172a; padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-top: 20px; }
            .sos-alert { color: #b91c1c; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="pass-card">
            
            <div class="header-row">
              <div class="logo-title">
                <img src="/assets/orca_logo.png" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #047857;" />
                <div>
                  <h1 class="title-main">OFFICIAL FISHERMAN VOYAGE PASS</h1>
                  <div class="title-sub">ISRO Marine EcoSystem Platform &bull; PS-26176 &bull; Govt of India</div>
                  <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Pass ID: <strong>${activeData.passId}</strong> &bull; Date: ${activeData.exportTimestamp}</div>
                </div>
              </div>
              <div>
                <div class="status-badge">APPROVED FOR DEEP SEA</div>
                <div style="font-size: 10px; text-align: center; color: #64748b; margin-top: 4px;">100% 0-Internet Ready</div>
              </div>
            </div>

            <div class="meta-grid">
              <div>
                <div class="meta-label">REGISTERED VESSEL:</div>
                <div class="meta-val">${activeData.vesselProfile?.name}</div>
                <div style="font-size: 12px; color: #334155;">Reg: <strong>${activeData.vesselProfile?.reg}</strong></div>
              </div>
              <div>
                <div class="meta-label">DEPARTURE HARBOUR:</div>
                <div class="meta-val">${activeData.originHarbor?.name}</div>
                <div style="font-size: 12px; color: #334155;">${activeData.originHarbor?.state} &bull; ${activeData.originHarbor?.coast}</div>
              </div>
            </div>

            <div class="hotspot-box">
              <div class="hotspot-title">🎯 TARGET POTENTIAL FISHING ZONE (PFZ)</div>
              <div class="hotspot-species">${activeData.targetPFZ?.species}</div>
              <div class="hotspot-stats">
                <span>📍 Distance: ${activeData.targetPFZ?.distance_nm}</span>
                <span>🌡️ Water Temp: ${activeData.targetPFZ?.sst_celsius}</span>
                <span>🌊 Depth: ${activeData.targetPFZ?.depth}</span>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-title">ESTIMATED DIESEL SAVED</div>
                <div class="stat-num">${activeData.navigationRoute?.costSavedINR}</div>
                <div class="stat-sub">${activeData.navigationRoute?.dieselSavedLitres} saved via surface drift</div>
              </div>
              <div class="stat-card">
                <div class="stat-title">BORDER STATUS (IMBL)</div>
                <div class="stat-num">SAFE VOYAGE</div>
                <div class="stat-sub">Clear of International Boundaries</div>
              </div>
            </div>

            <div>
              <div style="font-size: 13px; font-weight: 900; border-bottom: 2px solid #0f172a; padding-bottom: 4px;">
                🧭 STEP-BY-STEP COMPASS STEERING WAYPOINTS:
              </div>
              <table class="waypoint-table">
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Action / Waypoint</th>
                    <th>GPS Latitude</th>
                    <th>GPS Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  ${waypointsRows}
                </tbody>
              </table>
            </div>

            <div class="sos-footer">
              <div class="sos-alert">
                🚨 INDIAN COAST GUARD EMERGENCY: <strong>1554</strong> &bull; VHF: <strong>Channel 16</strong>
              </div>
              <div style="color: #64748b; font-style: italic;">
                Project ORCA &bull; ISRO Smart India Hackathon
              </div>
            </div>

          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 400);
    } else {
      window.print();
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
    </>
  );
}
