import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MarineMap from './components/MarineMap';
import Telemetry from './components/Telemetry';
import WeatherCard from './components/WeatherCard';
import AgentChat from './components/AgentChat';
import OfflineSync from './components/OfflineSync';
import MobileBottomNav from './components/MobileBottomNav';
import VesselModal from './components/VesselModal';
import ProductTour from './components/ProductTour';

import {
  HARBORS,
  BOUNDARIES,
  VESSEL_PROFILES,
  generateHotspots,
  computeVoyageRoute,
  checkGeofenceProximity,
  generateWeather,
  generateResearcherAnalytics,
  processClientChat
} from './services/marineEngine';

const API_BASE_URL = 'http://localhost:8000';
const isLocalEnv = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

function App() {
  const [selectedHarbor, setSelectedHarbor] = useState('malpe');
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedVessel, setSelectedVessel] = useState('trawler'); // 'trawler' | 'fibre' | 'canoe'
  const [selectedPersona, setSelectedPersona] = useState('fisherman'); // 'fisherman' | 'researcher' | 'authority'
  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('map'); // 'map' | 'chat' | 'weather' | 'pass'
  const [harbors, setHarbors] = useState(HARBORS);
  const [hotspots, setHotspots] = useState(() => generateHotspots('malpe'));
  const [selectedHotspot, setSelectedHotspot] = useState(() => generateHotspots('malpe')[0]);
  const [route, setRoute] = useState(() => computeVoyageRoute(HARBORS.malpe, generateHotspots('malpe')[0], 'trawler'));
  const [weather, setWeather] = useState(() => generateWeather(generateHotspots('malpe')[0].lat, generateHotspots('malpe')[0].lng));
  const [boundaries, setBoundaries] = useState(BOUNDARIES);
  const [geofence, setGeofence] = useState(() => checkGeofenceProximity(generateHotspots('malpe')[0].lat, generateHotspots('malpe')[0].lng));
  const [isOffline, setIsOffline] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: '🐋 **Welcome to Project ORCA — Marine Ecosystem Reasoning & Collaborative Agents (ISRO PS-26176)**!\n\nI am your collaborative Agentic AI assistant. I autonomously synthesize ISRO satellite Earth Observation data (Oceansat-3 Chlorophyll-a, INSAT-3D/3DR SST, and INCOIS Ocean State Forecasts) with multi-agent reasoning.\n\nToggle between **🎣 Fisherman**, **🔬 Marine Researcher**, and **🚨 Coastal Authority** modes at any time, or query me in English, ಕನ್ನಡ, தமிழ், తెలుగు, हिन्दी, or മലയാളം!',
      voiceScript: 'Welcome to Project ORCA. Your collaborative Marine Intelligence Co-Pilot is online and calibrated for your vessel.'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [collaboratingAgents, setCollaboratingAgents] = useState([
    { name: 'Matsya Drishti Agent', status: 'Active', summary: 'SST & Chlorophyll mapping' },
    { name: 'Sagara Vayu Agent', status: 'Active', summary: 'Live wave & current vectors' },
    { name: 'Nava Setu Agent', status: 'Active', summary: 'A* fuel-optimal pathfinding' },
    { name: 'Samudra Raksha Agent', status: 'Active', summary: 'IMBL boundary monitoring' }
  ]);

  // Check first-time user tour trigger
  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem('orca_tour_seen');
      if (!hasSeenTour) {
        const timer = setTimeout(() => setIsTourOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  // Update harbor & vessel data on selection change
  const updateHarborData = async (harborKey, vesselKey = selectedVessel) => {
    const validHarborKey = HARBORS[harborKey] ? harborKey : 'malpe';
    const localHarbor = HARBORS[validHarborKey];
    const localHotspots = generateHotspots(validHarborKey);
    const topHotspot = localHotspots[0];
    const localRoute = computeVoyageRoute(localHarbor, topHotspot, vesselKey);
    const localGeofence = checkGeofenceProximity(topHotspot.lat, topHotspot.lng);
    const localWeather = generateWeather(topHotspot.lat, topHotspot.lng);

    // Immediate zero-latency local update
    setHotspots(localHotspots);
    setSelectedHotspot(topHotspot);
    setRoute(localRoute);
    setGeofence(localGeofence);
    setWeather(localWeather);

    // Only attempt localhost fetch if explicitly running in a local developer environment
    if (isLocalEnv && !isOffline) {
      try {
        const hRes = await fetch(`${API_BASE_URL}/api/harbors`);
        if (hRes.ok) {
          const hData = await hRes.json();
          if (hData && typeof hData === 'object' && !Array.isArray(hData)) {
            setHarbors(hData.harbors || hData);
          }
        }
        const pfzRes = await fetch(`${API_BASE_URL}/api/pfz-hotspots/${validHarborKey}`);
        if (pfzRes.ok) {
          const pfzData = await pfzRes.json();
          const list = Array.isArray(pfzData) ? pfzData : (pfzData?.hotspots || []);
          if (list.length > 0) {
            setHotspots(list);
            setSelectedHotspot(list[0]);
          }
        }
      } catch (err) {}
    }
  };

  // Initial Load
  useEffect(() => {
    updateHarborData(selectedHarbor, selectedVessel);
  }, [selectedHarbor, selectedVessel]);

  // Handle Vessel Change
  const handleVesselChange = (vesselKey) => {
    setSelectedVessel(vesselKey);
    const currentHarborObj = safeHarbors[selectedHarbor] || safeHarbors.malpe || HARBORS.malpe;
    const newRoute = computeVoyageRoute(currentHarborObj, selectedHotspot, vesselKey);
    setRoute(newRoute);
  };

  // Handle Hotspot Click
  const handleSelectHotspot = async (spot) => {
    if (!spot) return;
    setSelectedHotspot(spot);
    const validHarborKey = harbors?.[selectedHarbor] ? selectedHarbor : 'malpe';
    const currentHarborObj = harbors?.[validHarborKey] || HARBORS[validHarborKey] || HARBORS.malpe;

    const localRoute = computeVoyageRoute(currentHarborObj, spot, selectedVessel);
    const localGeofence = checkGeofenceProximity(spot.lat, spot.lng);
    const localWeather = generateWeather(spot.lat, spot.lng);
    setRoute(localRoute);
    setGeofence(localGeofence);
    setWeather(localWeather);

    if (isLocalEnv && !isOffline) {
      try {
        const routeRes = await fetch(`${API_BASE_URL}/api/analyze-voyage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            harbor_id: validHarborKey,
            target_hotspot_id: spot.id,
            language: selectedLang,
            vessel_profile: selectedVessel
          })
        });
        if (routeRes.ok) {
          const routeData = await routeRes.json();
          if (routeData?.route) setRoute(routeData.route);
        }
      } catch (err) {}
    }
  };

  // Handle Multi-Agent Chat Query
  const handleSendMessage = async (userText) => {
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setIsProcessing(true);

    if (isOffline || !isLocalEnv) {
      setTimeout(() => {
        const result = processClientChat(userText, selectedHarbor, selectedLang, selectedVessel);
        setMessages([
          ...newMessages,
          {
            sender: 'agent',
            text: result.response_text,
            voiceScript: result.voice_script,
            voiceScriptPhonetic: result.voice_script_phonetic
          }
        ]);
        setCollaboratingAgents(result.collaborating_agents);
        setIsProcessing(false);
      }, 450);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          harbor_id: selectedHarbor,
          language: selectedLang,
          vessel_profile: selectedVessel
        })
      });

      if (!response.ok) throw new Error('API unreachable');

      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          sender: 'agent',
          text: data.response_text,
          voiceScript: data.voice_script,
          voiceScriptPhonetic: data.voice_script_phonetic
        }
      ]);
      if (data.collaborating_agents) {
        setCollaboratingAgents(data.collaborating_agents);
      }
      if (data.evidence) {
        if (data.evidence.route) setRoute(data.evidence.route);
        if (data.evidence.weather) setWeather(data.evidence.weather);
        if (data.evidence.geofence) setGeofence(data.evidence.geofence);
      }
    } catch (error) {
      const result = processClientChat(userText, selectedHarbor, selectedLang, selectedVessel);
      setMessages([
        ...newMessages,
        {
          sender: 'agent',
          text: result.response_text,
          voiceScript: result.voice_script,
          voiceScriptPhonetic: result.voice_script_phonetic,
          agentic_steps: result.agentic_steps,
          evidence: result.evidence
        }
      ]);
      setCollaboratingAgents(result.collaborating_agents);
    } finally {
      setIsProcessing(false);
    }
  };

  const safeHarbors = (harbors && typeof harbors === 'object' && Object.keys(harbors).length > 0) ? harbors : HARBORS;
  const currentHarborObj = safeHarbors[selectedHarbor] || safeHarbors.malpe || HARBORS.malpe;
  const researcherData = generateResearcherAnalytics(selectedHarbor);

  return (
    <div className="min-h-screen ocean-ambient-bg flex flex-col justify-between pb-24 lg:pb-4 py-2 sm:py-3">
      
      {/* Floating Modern Header */}
      <Navbar
        selectedHarbor={selectedHarbor}
        onHarborChange={(h) => setSelectedHarbor(h)}
        selectedLang={selectedLang}
        onLangChange={(l) => setSelectedLang(l)}
        selectedVessel={selectedVessel}
        onOpenVesselModal={() => setIsVesselModalOpen(true)}
        onStartTour={() => setIsTourOpen(true)}
        harbors={safeHarbors}
        isOffline={isOffline}
        selectedPersona={selectedPersona}
        onPersonaChange={setSelectedPersona}
      />

      {/* Main Single-DOM Layout */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 w-full space-y-4 sm:space-y-5 my-3 sm:my-4 flex-1">
        
        {/* Stakeholder Persona Specialized Status Strip */}
        {selectedPersona === 'researcher' && (
          <div className="bg-gradient-to-r from-cyan-950/80 via-[#020b17]/90 to-blue-950/80 border border-cyan-400/40 rounded-2xl p-3 sm:p-4 text-xs shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2">
              <span className="font-black text-cyan-300 flex items-center gap-2">
                <span className="text-base">🔬</span> ISRO Satellite Oceanographic & Ecosystem Research Analytics ({currentHarborObj.name})
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-200 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                Oceansat-3 OCM & INSAT-3D
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">SST-Chl Correlation</span>
                <span className="text-white font-black text-sm">r = {researcherData.sst_chlorophyll_correlation}</span>
                <span className="text-emerald-400 block text-[9px]">Inverse Upwelling Front</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Thermocline Depth</span>
                <span className="text-cyan-300 font-black text-sm">{researcherData.thermocline_depth_m} meters</span>
                <span className="text-slate-300 block text-[9px]">{researcherData.thermocline_gradient}</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Bakun Upwelling</span>
                <span className="text-amber-300 font-black text-sm">{researcherData.upwelling_index_bakun.split(' ')[0]}</span>
                <span className="text-emerald-300 block text-[9px]">Active Coastal Pump</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Shelf Break Dist</span>
                <span className="text-teal-300 font-black text-sm">{researcherData.shelf_break_distance_nm} NM</span>
                <span className="text-slate-300 block text-[9px]">Bathymetric Contour</span>
              </div>
            </div>
          </div>
        )}

        {selectedPersona === 'authority' && (
          <div className="bg-gradient-to-r from-amber-950/80 via-[#020b17]/90 to-rose-950/80 border border-amber-400/40 rounded-2xl p-3 sm:p-4 text-xs shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2">
              <span className="font-black text-amber-300 flex items-center gap-2">
                <span className="text-base">🚨</span> Coastal Governance, Border (IMBL) & Hazard Enforcement Dashboard
              </span>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                INCOIS / Indian Coast Guard EEZ
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Border (IMBL) Distance</span>
                <span className="text-emerald-400 font-black text-sm">{geofence?.nearest_imbl_distance_km || 138} km</span>
                <span className="text-slate-300 block text-[9px]">Status: {geofence?.status || 'SAFE'}</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Active MPAs</span>
                <span className="text-amber-300 font-black text-sm">{boundaries?.protected_areas?.length || 4} Sanctuaries</span>
                <span className="text-rose-400 block text-[9px]">Trawling Prohibited</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Lightning CAPE</span>
                <span className="text-emerald-300 font-black text-sm">{weather?.lightning_radar?.cape_index_j_kg || 420} J/kg</span>
                <span className="text-emerald-400 block text-[9px]">Safe (&lt;1000 J/kg)</span>
              </div>
              <div className="bg-white/[0.04] p-2 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[9px]">Port Tidal Clearance</span>
                <span className="text-cyan-300 font-black text-sm">+{weather?.tide?.water_level_m || 1.28}m</span>
                <span className="text-slate-300 block text-[9px]">{weather?.tide?.current_phase || 'Flood Tide'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Top 4 Telemetry Metric Capsules */}
        <div className={activeMobileTab === 'map' ? 'block' : 'hidden lg:block'}>
          <Telemetry
            route={route}
            hotspot={selectedHotspot}
            weather={weather}
            geofence={geofence}
            selectedLang={selectedLang}
          />
        </div>

        {/* 2-Column Responsive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          
          {/* 1. Interactive Dark Matter Marine Map with Floating Action HUD */}
          <div className={`lg:col-span-7 w-full ${activeMobileTab === 'map' ? 'block' : 'hidden lg:block'}`}>
            <MarineMap
              harbor={currentHarborObj}
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={handleSelectHotspot}
              route={route}
              boundaries={boundaries}
              onOpenChat={() => setActiveMobileTab('chat')}
              selectedLang={selectedLang}
              selectedPersona={selectedPersona}
            />
          </div>

          {/* 2. Collaborative Agentic Chat */}
          <div className={`lg:col-span-5 w-full ${activeMobileTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
            <AgentChat
              onSendMessage={handleSendMessage}
              messages={messages}
              isProcessing={isProcessing}
              collaboratingAgents={collaboratingAgents}
              activeVoiceScript={messages[messages.length - 1]?.voiceScript}
              selectedLang={selectedLang}
              selectedPersona={selectedPersona}
            />
          </div>

        </div>

        {/* Bottom Section: Weather Telemetry & Deep-Sea Offline Sync */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* Weather Card */}
          <div className={`lg:col-span-7 ${activeMobileTab === 'weather' ? 'block' : 'hidden lg:block'}`}>
            <WeatherCard
              weather={weather}
              hotspot={selectedHotspot}
              selectedLang={selectedLang}
              selectedPersona={selectedPersona}
            />
          </div>

          {/* Offline Sync Card */}
          <div className={`lg:col-span-5 flex flex-col justify-center ${activeMobileTab === 'pass' ? 'block' : 'hidden lg:block'}`}>
            <OfflineSync
              harbor={currentHarborObj}
              selectedHotspot={selectedHotspot}
              route={route}
              weather={weather}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
              selectedLang={selectedLang}
            />
          </div>

        </div>

      </main>

      {/* Vessel Profile Setup Modal */}
      <VesselModal
        isOpen={isVesselModalOpen}
        onClose={() => setIsVesselModalOpen(false)}
        selectedVessel={selectedVessel}
        onSelectVessel={handleVesselChange}
        selectedLang={selectedLang}
      />

      {/* Interactive Product Tour Walkthrough */}
      <ProductTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        selectedLang={selectedLang}
        onNavigateTab={(tab) => setActiveMobileTab(tab)}
      />

      {/* Native Mobile Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onTabChange={(tab) => setActiveMobileTab(tab)}
        hasUnreadMessages={false}
        selectedLang={selectedLang}
      />

      {/* Desktop Footer */}
      <footer className="hidden lg:block max-w-7xl mx-auto px-4 py-3 text-center text-slate-500 text-[11px] font-mono w-full border-t border-white/[0.05] mt-2">
        <p>Project ORCA &bull; Built for Smart India Hackathon (SIH 2026) &bull; Sponsoring Ministry: ISRO (Dept. of Space)</p>
      </footer>

    </div>
  );
}

export default App;
