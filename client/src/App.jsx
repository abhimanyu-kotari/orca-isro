import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MarineMap from './components/MarineMap';
import Telemetry from './components/Telemetry';
import WeatherCard from './components/WeatherCard';
import AgentChat from './components/AgentChat';
import OfflineSync from './components/OfflineSync';
import MobileBottomNav from './components/MobileBottomNav';

import {
  HARBORS,
  BOUNDARIES,
  generateHotspots,
  computeVoyageRoute,
  checkGeofenceProximity,
  generateWeather,
  processClientChat
} from './services/marineEngine';

const API_BASE_URL = 'http://localhost:8000';
const isLocalEnv = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

function App() {
  const [selectedHarbor, setSelectedHarbor] = useState('malpe');
  const [selectedLang, setSelectedLang] = useState('en');
  const [activeMobileTab, setActiveMobileTab] = useState('map'); // 'map' | 'chat' | 'weather' | 'pass'
  const [harbors, setHarbors] = useState(HARBORS);
  const [hotspots, setHotspots] = useState(() => generateHotspots('malpe'));
  const [selectedHotspot, setSelectedHotspot] = useState(() => generateHotspots('malpe')[0]);
  const [route, setRoute] = useState(() => computeVoyageRoute(HARBORS.malpe, generateHotspots('malpe')[0]));
  const [weather, setWeather] = useState(() => generateWeather(generateHotspots('malpe')[0].lat, generateHotspots('malpe')[0].lng));
  const [boundaries, setBoundaries] = useState(BOUNDARIES);
  const [geofence, setGeofence] = useState(() => checkGeofenceProximity(generateHotspots('malpe')[0].lat, generateHotspots('malpe')[0].lng));
  const [isOffline, setIsOffline] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: '🐋 **Welcome to ORCA Marine Intelligence Co-Pilot (ISRO PS-26176)**!\n\nI am your collaborative Agentic AI assistant. I reason over real-time satellite Earth Observation data (SST, Chlorophyll-a, ocean currents, and weather forecasts) to deliver evidence-backed fishing hotspots and fuel-optimal routing.\n\nAsk me anything in English or your mother tongue (ಕನ್ನಡ, ತುಳು, தமிழ், తెలుగు, हिन्दी, മലയാളം)!',
      voiceScript: 'Welcome to Project ORCA. Your collaborative Marine Intelligence Co-Pilot is online and ready for voyage guidance.'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [collaboratingAgents, setCollaboratingAgents] = useState([
    { name: 'Matsya Drishti Agent', status: 'Active', summary: 'SST & Chlorophyll mapping' },
    { name: 'Sagara Vayu Agent', status: 'Active', summary: 'Live wave & current vectors' },
    { name: 'Nava Setu Agent', status: 'Active', summary: 'A* fuel-optimal pathfinding' },
    { name: 'Samudra Raksha Agent', status: 'Active', summary: 'IMBL boundary monitoring' }
  ]);

  // Update harbor data on selection change
  const updateHarborData = async (harborKey) => {
    const validHarborKey = HARBORS[harborKey] ? harborKey : 'malpe';
    const localHarbor = HARBORS[validHarborKey];
    const localHotspots = generateHotspots(validHarborKey);
    const topHotspot = localHotspots[0];
    const localRoute = computeVoyageRoute(localHarbor, topHotspot);
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
    updateHarborData(selectedHarbor);
  }, [selectedHarbor]);

  // Handle Hotspot Click
  const handleSelectHotspot = async (spot) => {
    if (!spot) return;
    setSelectedHotspot(spot);
    const validHarborKey = harbors?.[selectedHarbor] ? selectedHarbor : 'malpe';
    const currentHarborObj = harbors?.[validHarborKey] || HARBORS[validHarborKey] || HARBORS.malpe;

    const localRoute = computeVoyageRoute(currentHarborObj, spot);
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
            language: selectedLang
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
        const result = processClientChat(userText, selectedHarbor, selectedLang);
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
          language: selectedLang
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
      const result = processClientChat(userText, selectedHarbor, selectedLang);
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
    } finally {
      setIsProcessing(false);
    }
  };

  const safeHarbors = (harbors && typeof harbors === 'object' && Object.keys(harbors).length > 0) ? harbors : HARBORS;
  const currentHarborObj = safeHarbors[selectedHarbor] || safeHarbors.malpe || HARBORS.malpe;

  return (
    <div className="min-h-screen ocean-ambient-bg flex flex-col justify-between pb-24 lg:pb-4 py-2 sm:py-3">
      
      {/* Floating Modern Header */}
      <Navbar
        selectedHarbor={selectedHarbor}
        onHarborChange={(h) => setSelectedHarbor(h)}
        selectedLang={selectedLang}
        onLangChange={(l) => setSelectedLang(l)}
        harbors={safeHarbors}
        isOffline={isOffline}
      />

      {/* Main Single-DOM Layout */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 w-full space-y-4 sm:space-y-5 my-3 sm:my-4 flex-1">
        
        {/* Top 4 Telemetry Metric Capsules */}
        <div className={activeMobileTab === 'map' ? 'block' : 'hidden lg:block'}>
          <Telemetry
            route={route}
            hotspot={selectedHotspot}
            weather={weather}
            geofence={geofence}
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

      {/* Native Mobile Bottom Tab Bar */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onTabChange={(tab) => setActiveMobileTab(tab)}
        hasUnreadMessages={false}
      />

      {/* Desktop Footer */}
      <footer className="hidden lg:block max-w-7xl mx-auto px-4 py-3 text-center text-slate-500 text-[11px] font-mono w-full border-t border-white/[0.05] mt-2">
        <p>Project ORCA &bull; Built for Smart India Hackathon (SIH 2026) &bull; Sponsoring Ministry: ISRO (Dept. of Space)</p>
      </footer>

    </div>
  );
}

export default App;
