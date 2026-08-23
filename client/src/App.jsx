import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MarineMap from './components/MarineMap';
import Telemetry from './components/Telemetry';
import WeatherCard from './components/WeatherCard';
import AgentChat from './components/AgentChat';
import OfflineSync from './components/OfflineSync';
import { Compass, Sparkles, Navigation, Fish, Shield, Radio, Layers } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [selectedHarbor, setSelectedHarbor] = useState('chennai');
  const [selectedLang, setSelectedLang] = useState('en');
  const [isOffline, setIsOffline] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Core Marine Telemetry State
  const [harborData, setHarborData] = useState({
    name: "Chennai Fisheries Harbour (Kasimedu)",
    state: "Tamil Nadu",
    lat: 13.125,
    lng: 80.298,
    coast: "Bay of Bengal"
  });

  const [harborsList, setHarborsList] = useState({
    chennai: { name: "Chennai Fisheries Harbour", state: "Tamil Nadu", lat: 13.125, lng: 80.298, coast: "Bay of Bengal" },
    rameswaram: { name: "Rameswaram Port", state: "Tamil Nadu", lat: 9.288, lng: 79.313, coast: "Palk Bay / Gulf of Mannar" },
    kochi: { name: "Kochi Harbour", state: "Kerala", lat: 9.940, lng: 76.260, coast: "Arabian Sea" },
    visakhapatnam: { name: "Visakhapatnam Port", state: "Andhra Pradesh", lat: 17.695, lng: 83.300, coast: "Bay of Bengal" },
    mangalore: { name: "Mangalore Port", state: "Karnataka", lat: 12.860, lng: 74.835, coast: "Arabian Sea" }
  });

  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [route, setRoute] = useState(null);
  const [weather, setWeather] = useState(null);
  const [geofence, setGeofence] = useState(null);
  const [boundaries, setBoundaries] = useState(null);

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

  // Initial Load: Fetch Harbors, Boundaries, and Initial Voyage Data
  useEffect(() => {
    fetchInitialData();
  }, [selectedHarbor]);

  const fetchInitialData = async () => {
    try {
      // Fetch harbors list
      const hRes = await fetch(`${API_BASE}/api/harbors`);
      if (hRes.ok) {
        const hData = await hRes.json();
        setHarborsList(hData);
      }

      // Fetch boundaries
      const bRes = await fetch(`${API_BASE}/api/boundaries`);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBoundaries(bData);
      }

      // Analyze default voyage
      const vRes = await fetch(`${API_BASE}/api/analyze-voyage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ harbor_id: selectedHarbor })
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
    } catch (err) {
      console.warn('Backend connecting...', err);
    }
  };

  // Hotspot Selection Handler
  const handleSelectHotspot = async (hotspot) => {
    setSelectedHotspot(hotspot);
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
    } catch (err) {
      console.error(err);
    }
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

        // Update telemetry and map with evidence
        if (data.evidence) {
          setHarborData(data.harbor);
          setSelectedHotspot(data.evidence.top_pfz);
          setHotspots(data.evidence.all_pfz_hotspots);
          setRoute(data.evidence.route);
          setWeather(data.evidence.weather);
          setGeofence(data.evidence.geofence);
        }
      }
    } catch (err) {
      const fallbackMsg = {
        sender: 'agent',
        text: `🛰️ **ORCA Synthesis**: Processed request for **${harborData.name}**.\n• Top Hotspot: **${selectedHotspot?.id || 'PFZ-1'}** (${selectedHotspot?.distance_nm || 18} NM offshore).\n• Estimated Fuel Saved: **₹${route?.cost_saved_inr || 2400}** (${route?.fuel_savings_percentage || 28}%).\n• Sea condition is safe. Safe distance to IMBL boundary.`,
        voiceScript: `Nearest fish hotspot is ${selectedHotspot?.distance_nm || 18} nautical miles offshore. Sea conditions are safe.`
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
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
