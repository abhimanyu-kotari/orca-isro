import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MarineMap from './components/MarineMap';
import Telemetry from './components/Telemetry';
import WeatherCard from './components/WeatherCard';
import AgentChat from './components/AgentChat';
import OfflineSync from './components/OfflineSync';
import {
  HARBORS,
  BOUNDARIES,
  generateHotspots,
  computeVoyageRoute,
  checkGeofenceProximity,
  generateWeather,
  processClientChat
} from './services/marineEngine';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [selectedHarbor, setSelectedHarbor] = useState('chennai');
  const [selectedLang, setSelectedLang] = useState('en');
  const [isOffline, setIsOffline] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Core Marine State initialized with client-side engine
  const [harborData, setHarborData] = useState(HARBORS.chennai);
  const [harborsList, setHarborsList] = useState(HARBORS);
  const [boundaries, setBoundaries] = useState(BOUNDARIES);

  const initialHotspots = generateHotspots('chennai');
  const [hotspots, setHotspots] = useState(initialHotspots);
  const [selectedHotspot, setSelectedHotspot] = useState(initialHotspots[0]);
  const [route, setRoute] = useState(computeVoyageRoute(HARBORS.chennai, initialHotspots[0]));
  const [weather, setWeather] = useState(generateWeather(initialHotspots[0].lat, initialHotspots[0].lng));
  const [geofence, setGeofence] = useState(checkGeofenceProximity(initialHotspots[0].lat, initialHotspots[0].lng));

  // Multi-Agent Chat Messages
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: '🛰️ **Welcome to ORCA Marine Co-Pilot (ISRO PS-26176)**!\n\nI am your collaborative Agentic AI assistant. I continuously reason over satellite Earth Observation data (SST, Chlorophyll-a, ocean currents, and weather forecasts).\n\nAsk me anything in English or your mother tongue (தமிழ், తెలుగు, हिन्दी, മലയാളം):',
      voiceScript: 'Welcome to Project ORCA. I am your AI marine navigation and safety co-pilot.'
    }
  ]);

  const [collaboratingAgents, setCollaboratingAgents] = useState([
    { name: 'Ocean Analytics Agent', status: 'Ready', summary: 'SST & Chlorophyll mapping' },
    { name: 'Weather Intelligence Agent', status: 'Ready', summary: 'Live wave & current vectors' },
    { name: 'Routing Optimization Agent', status: 'Ready', summary: 'A* fuel-optimal pathfinder' },
    { name: 'Geofencing & Safety Agent', status: 'Ready', summary: 'IMBL boundary monitoring' }
  ]);

  // Harbor Switch Handler
  useEffect(() => {
    updateHarborData(selectedHarbor);
  }, [selectedHarbor]);

  const updateHarborData = async (harborKey) => {
    // 1. Immediately apply client-side data (Instant responsiveness on Mobile/Vercel)
    const currentHarbor = HARBORS[harborKey] || HARBORS.chennai;
    setHarborData(currentHarbor);

    const newHotspots = generateHotspots(harborKey);
    setHotspots(newHotspots);
    const topHotspot = newHotspots[0];
    setSelectedHotspot(topHotspot);

    const newRoute = computeVoyageRoute(currentHarbor, topHotspot);
    setRoute(newRoute);

    const newWeather = generateWeather(topHotspot.lat, topHotspot.lng);
    setWeather(newWeather);

    const newGeofence = checkGeofenceProximity(topHotspot.lat, topHotspot.lng);
    setGeofence(newGeofence);

    // 2. Try fetching from live FastAPI backend if available
    try {
      const vRes = await fetch(`${API_BASE}/api/analyze-voyage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ harbor_id: harborKey })
      });
      if (vRes.ok) {
        const vData = await vRes.json();
        setHarborData(vData.harbor);
        setHotspots(vData.all_hotspots);
        setSelectedHotspot(vData.selected_hotspot);
        setRoute(vData.route);
        setWeather(vData.weather);
        setGeofence(vData.geofence);
      }
    } catch (e) {
      // Backend not running on this device (e.g. mobile/cloud); client-side engine is active.
    }
  };

  // Hotspot Click Handler
  const handleSelectHotspot = async (hotspot) => {
    setSelectedHotspot(hotspot);

    // Local calculation
    const newRoute = computeVoyageRoute(harborData, hotspot);
    setRoute(newRoute);
    const newWeather = generateWeather(hotspot.lat, hotspot.lng);
    setWeather(newWeather);
    const newGeofence = checkGeofenceProximity(hotspot.lat, hotspot.lng);
    setGeofence(newGeofence);

    // Backend attempt
    try {
      const res = await fetch(`${API_BASE}/api/analyze-voyage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          harbor_id: selectedHarbor,
          target_hotspot_id: hotspot.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        setRoute(data.route);
        setWeather(data.weather);
        setGeofence(data.geofence);
      }
    } catch (err) {}
  };

  // Chat Message Submission Handler
  const handleSendMessage = async (userText) => {
    const userMsg = { sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          harbor_id: selectedHarbor,
          language: selectedLang
        })
      });

      if (res.ok) {
        const data = await res.json();
        const agentMsg = {
          sender: 'agent',
          text: data.response_text,
          voiceScript: data.voice_script
        };
        setMessages((prev) => [...prev, agentMsg]);
        setCollaboratingAgents(data.collaborating_agents);

        if (data.evidence) {
          setHarborData(data.harbor);
          setSelectedHotspot(data.evidence.top_pfz);
          setHotspots(data.evidence.all_pfz_hotspots);
          setRoute(data.evidence.route);
          setWeather(data.evidence.weather);
          setGeofence(data.evidence.geofence);
        }
        return;
      }
    } catch (err) {
      // Backend unavailable; process via client-side multi-agent engine
    }

    // Client-side agent execution
    setTimeout(() => {
      const clientRes = processClientChat(userText, selectedHarbor, selectedLang);
      const agentMsg = {
        sender: 'agent',
        text: clientRes.response_text,
        voiceScript: clientRes.voice_script
      };
      setMessages((prev) => [...prev, agentMsg]);
      setCollaboratingAgents(clientRes.collaborating_agents);

      if (clientRes.evidence) {
        setSelectedHotspot(clientRes.evidence.top_pfz);
        setHotspots(clientRes.evidence.all_pfz_hotspots);
        setRoute(clientRes.evidence.route);
        setWeather(clientRes.evidence.weather);
        setGeofence(clientRes.evidence.geofence);
      }
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-ocean-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navigation Bar */}
      <Navbar
        selectedHarbor={selectedHarbor}
        onHarborChange={setSelectedHarbor}
        selectedLang={selectedLang}
        onLangChange={setSelectedLang}
        harbors={harborsList}
        isOffline={isOffline}
      />

      {/* Main Tactical Cockpit */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 lg:p-6 space-y-4">
        
        {/* Real-time Telemetry Row */}
        <Telemetry
          route={route}
          hotspot={selectedHotspot}
          weather={weather}
          geofence={geofence}
        />

        {/* Core Layout: Map & Multi-Agent Conversational Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Interactive Satellite Map (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <MarineMap
              harbor={harborData}
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={handleSelectHotspot}
              route={route}
              boundaries={boundaries}
            />

            {/* Live Weather & Sea State Card */}
            <WeatherCard
              weather={weather}
              hotspot={selectedHotspot}
            />
          </div>

          {/* Right Column: Multi-Agent Conversational Interface (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <AgentChat
              onSendMessage={handleSendMessage}
              messages={messages}
              isProcessing={isProcessing}
              collaboratingAgents={collaboratingAgents}
              selectedLang={selectedLang}
            />

            {/* Deep-Sea Offline Cache Downloader */}
            <OfflineSync
              harbor={harborData}
              selectedHotspot={selectedHotspot}
              route={route}
              weather={weather}
              isOffline={isOffline}
              onToggleOffline={() => setIsOffline(!isOffline)}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-ocean-800/80 bg-ocean-950/90 py-3 text-center text-xs text-slate-500 font-mono">
        <p>Project ORCA &bull; Built for Smart India Hackathon (SIH 2026) &bull; Sponsoring Ministry: ISRO (Dept of Space)</p>
      </footer>

    </div>
  );
}
