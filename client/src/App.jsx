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

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [selectedHarbor, setSelectedHarbor] = useState('malpe');
  const [selectedLang, setSelectedLang] = useState('en');
  const [harbors, setHarbors] = useState(HARBORS);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [route, setRoute] = useState(null);
  const [weather, setWeather] = useState(null);
  const [boundaries, setBoundaries] = useState(BOUNDARIES);
  const [geofence, setGeofence] = useState(null);
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
    const localHarbor = HARBORS[harborKey] || HARBORS.malpe;
    const localHotspots = generateHotspots(harborKey);
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

    // Try backend sync if running locally
    if (!isOffline) {
      try {
        const hRes = await fetch(`${API_BASE_URL}/api/harbors`);
        if (hRes.ok) {
          const hData = await hRes.json();
          setHarbors(hData.harbors);
        }
        const pfzRes = await fetch(`${API_BASE_URL}/api/pfz?harbor=${harborKey}`);
        if (pfzRes.ok) {
          const pfzData = await pfzRes.json();
          if (pfzData.hotspots && pfzData.hotspots.length > 0) {
            setHotspots(pfzData.hotspots);
            setSelectedHotspot(pfzData.hotspots[0]);
          }
        }
      } catch (err) {
        // Standalone engine handles everything gracefully
      }
    }
  };

  // Initial Load
  useEffect(() => {
    updateHarborData(selectedHarbor);
  }, [selectedHarbor]);

  // Handle Hotspot Click
  const handleSelectHotspot = async (spot) => {
    setSelectedHotspot(spot);
    const currentHarborObj = harbors[selectedHarbor] || HARBORS[selectedHarbor] || HARBORS.malpe;

    // Instant local compute
    const localRoute = computeVoyageRoute(currentHarborObj, spot);
    const localGeofence = checkGeofenceProximity(spot.lat, spot.lng);
    const localWeather = generateWeather(spot.lat, spot.lng);
    setRoute(localRoute);
    setGeofence(localGeofence);
    setWeather(localWeather);

    if (!isOffline) {
      try {
        const routeRes = await fetch(`${API_BASE_URL}/api/route/optimize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start_lat: currentHarborObj.lat,
            start_lng: currentHarborObj.lng,
            target_lat: spot.lat,
            target_lng: spot.lng
          })
        });
        if (routeRes.ok) {
          const routeData = await routeRes.json();
          setRoute(routeData.route);
        }
      } catch (err) {}
    }
  };

  // Handle Multi-Agent Chat Query
  const handleSendMessage = async (userText) => {
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setIsProcessing(true);

    // If offline or on mobile without backend, process client-side instantly
    if (isOffline) {
      setTimeout(() => {
        const result = processClientChat(userText, selectedHarbor, selectedLang);
        setMessages([
          ...newMessages,
          {
            sender: 'agent',
            text: result.response_text,
            voiceScript: result.voice_script
          }
        ]);
        setCollaboratingAgents(result.collaborating_agents);
        setIsProcessing(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          harbor: selectedHarbor,
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
          voiceScript: data.voice_script
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
      // Graceful fallback to client engine
      const result = processClientChat(userText, selectedHarbor, selectedLang);
      setMessages([
        ...newMessages,
        {
          sender: 'agent',
          text: result.response_text,
          voiceScript: result.voice_script
        }
      ]);
      setCollaboratingAgents(result.collaborating_agents);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentHarborObj = harbors[selectedHarbor] || HARBORS[selectedHarbor] || HARBORS.malpe;

  return (
    <div className="min-h-screen ocean-ambient-bg flex flex-col justify-between py-2 sm:py-3">
      
      {/* Floating Modern Header */}
      <Navbar
        selectedHarbor={selectedHarbor}
        onHarborChange={(h) => setSelectedHarbor(h)}
        selectedLang={selectedLang}
        onLangChange={(l) => setSelectedLang(l)}
        harbors={harbors}
        isOffline={isOffline}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 w-full space-y-3.5 sm:space-y-5 my-3 sm:my-4 flex-1">
        
        {/* Top 4 Telemetry Metric Capsules */}
        <Telemetry
          route={route}
          hotspot={selectedHotspot}
          weather={weather}
          geofence={geofence}
        />

        {/* 2-Column Split: Map & Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-start">
          
          {/* Interactive Dark Matter Marine Map (7 Cols) */}
          <div className="lg:col-span-7 w-full">
            <MarineMap
              harbor={currentHarborObj}
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={handleSelectHotspot}
              route={route}
              boundaries={boundaries}
            />
          </div>

          {/* Collaborative Agentic Chat (5 Cols) */}
          <div className="lg:col-span-5 w-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-stretch">
          
          <div className="lg:col-span-7">
            <WeatherCard
              weather={weather}
              hotspot={selectedHotspot}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
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

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-3 text-center text-slate-500 text-[11px] font-mono w-full border-t border-white/[0.05] mt-2">
        <p>Project ORCA &bull; Built for Smart India Hackathon (SIH 2026) &bull; Sponsoring Ministry: ISRO (Dept. of Space)</p>
      </footer>

    </div>
  );
}

export default App;
