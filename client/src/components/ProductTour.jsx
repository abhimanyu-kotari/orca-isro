import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check, 
  Compass, 
  Ship, 
  Anchor, 
  Globe2, 
  Fuel, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Volume2, 
  Navigation, 
  Printer, 
  PhoneCall, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProductTour({ isOpen, onClose, selectedLang = 'en', onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Multilingual Step Content
  const tourData = {
    en: {
      steps: [
        {
          badge: "Step 1 of 7 • System Overview",
          title: "Welcome to Project ORCA 🇮🇳",
          desc: "Project ORCA (ISRO PS-26176) is an AI-powered Marine Intelligence platform designed for Indian fishermen and coastal authorities. It ingests satellite Earth Observation data (SST, Chlorophyll-a, ocean currents) to detect high-yield fish zones and compute low-fuel navigation routes.",
          hint: "Collaborative Agentic AI • Dual Online / 0-Internet Mode",
          tab: "map"
        },
        {
          badge: "Step 2 of 7 • Harbor & Language",
          title: "Select Coastal Port & Regional Language",
          desc: "Switch between 8 major Indian fishing harbors (Malpe, Mangalore, Chennai, Veraval, Kochi, Visakhapatnam, Paradip, Rameswaram) and 7 coastal languages (Kannada, Tulu, Tamil, Telugu, Hindi, Malayalam, English). All advice and spoken voice dynamically adapt.",
          hint: "Tailored to local fishing communities across both East & West coasts.",
          tab: "map"
        },
        {
          badge: "Step 3 of 7 • Boat Profile Calibration",
          title: "Calibrate Your Fisherman Vessel Profile",
          desc: "Select your boat type to calibrate AI engine calculations: Mechanized Trawler (20 L/hr, 60 NM range), Motorized Fibre Boat (6.5 L/hr, 28 NM range), or Traditional Country Craft (3.2 L/hr, 12 NM range).",
          hint: "Ensures accurate diesel savings and safe coastal distance buffers.",
          tab: "map"
        },
        {
          badge: "Step 4 of 7 • Real-Time Telemetry",
          title: "Live Financial, Time & Boundary Telemetry",
          desc: "Inspect live mission telemetry in 4 color-coded capsules: Marine Shoal species match (%), Diesel Money Saved (₹) via ocean currents, Roundtrip Time Saved (mins), and distance to International Maritime Boundary Line (IMBL).",
          hint: "High-contrast glanceable cockpit metrics for deck operations.",
          tab: "map"
        },
        {
          badge: "Step 5 of 7 • Interactive Map & Steer HUD",
          title: "ISRO Satellite Map & Live Steer Compass",
          desc: "Tap on any 🐟 Fish Hotspot to view SST, Chlorophyll, and depth. Click 'Plot & Steer Route ⚡' to launch the Live Steer Compass HUD showing dynamic heading degrees (e.g. 288° WNW), turn distance, and spoken voice guidance!",
          hint: "Green Line = AI current-assisted route (-28% fuel) vs. Gray Dashed Line.",
          tab: "map"
        },
        {
          badge: "Step 6 of 7 • Conversational Co-Pilot",
          title: "Collaborative AI Co-Pilot (Voice & Multilingual)",
          desc: "Chat or speak in your mother tongue with 4 collaborative subagents (Matsya Drishti, Sagara Vayu, Nava Setu, Samudra Raksha). Ask about weather safety, fish migration patterns, or boundary clearances.",
          hint: "Tap 🔊 on any message to listen to regional speech audio.",
          tab: "chat"
        },
        {
          badge: "Step 7 of 7 • 0-Internet Voyage Pass",
          title: "Deep-Sea 0-Network Voyage Pass & SOS",
          desc: "Before heading into deep sea beyond cellular towers, download or print your official single-page A4 Fisherman Voyage Pass with GPS waypoint coordinates, vessel registration, and Indian Coast Guard SOS (1554 & VHF Ch-16).",
          hint: "100% functional with zero internet connectivity at sea.",
          tab: "pass"
        }
      ]
    },
    kn: {
      steps: [
        {
          badge: "ಹಂತ 1 / 7 • ಪರಿಚಯ",
          title: "ಪ್ರಾಜೆಕ್ಟ್ ಒರ್ಕಾ (ORCA) ಗೆ ಸುಸ್ವಾಗತ 🇮🇳",
          desc: "ಇದು ISRO ಉಪಗ್ರಹ ತಂತ್ರಜ್ಞಾನ (SST ಮತ್ತು ಕ್ಲೋರೊಫಿಲ್) ಆಧಾರಿತ ಸಮುದ್ರ AI ವೇದಿಕೆ. ಭಾರತೀಯ ಮೀನುಗಾರರಿಗೆ ಸಮೃದ್ಧ ಮೀನಿನ ವಲಯಗಳನ್ನು ಹುಡುಕಲು, ಡೀಸೆಲ್ ಉಳಿಸಲು ಮತ್ತು ಸುರಕ್ಷಿತ ಸಂಚಾರ ಒದಗಿಸಲು ನೆರವಾಗುತ್ತದೆ.",
          hint: "4 ಸಹಯೋಗಿ AI ಏಜೆಂಟ್‌ಗಳು • 0-ಇಂಟರ್ನೆಟ್ ಸೌಲಭ್ಯ",
          tab: "map"
        },
        {
          badge: "ಹಂತ 2 / 7 • ಬಂದರು ಮತ್ತು ಭಾಷೆ",
          title: "ಕರಾವಳಿ ಬಂದರು ಮತ್ತು ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
          desc: "ಮಲ್ಪೆ, ಮಂಗಳೂರು, ಚೆನ್ನೈ, ವೆರಾವಲ್ ಮುಂತಾದ 8 ಬಂದರುಗಳು ಮತ್ತು ಕನ್ನಡ, ತುಳು, ತಮಿಳು, ಹಿಂದಿ, ಮಲಯಾಳಂ ಮುಂತಾದ 7 ಭಾಷೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. AI ತಕ್ಷಣವೇ ಆ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸುತ್ತದೆ.",
          hint: "ಸ್ಥಳೀಯ ಮೀನುಗಾರ ಸಮುದಾಯಗಳಿಗೆ ಸಂಪೂರ್ಣ ದೇಶೀಯ ಭಾಷಾ ಬೆಂಬಲ.",
          tab: "map"
        },
        {
          badge: "ಹಂತ 3 / 7 • ದೋಣಿ ಸೆಟಪ್",
          title: "ದೋಣಿ ಮಾದರಿಯನ್ನು ಹೊಂದಿಸಿ",
          desc: "ನಿಮ್ಮ ದೋಣಿ ಮೆಕನೈಸ್ಡ್ ಟ್ರಾಲರ್ (20 ಲೀ/ಗಂಟೆ), ಫೈಬರ್ ಬೋಟ್ (6.5 ಲೀ/ಗಂಟೆ) ಅಥವಾ ಸಾಂಪ್ರದಾಯಿಕ ದೋಣಿ (3.2 ಲೀ/ಗಂಟೆ) ಎಂಬುದನ್ನು ಆರಿಸಿ. ಇದರಿಂದ ಡೀಸೆಲ್ ಉಳಿತಾಯ ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಲ್ಪಡುತ್ತದೆ.",
          hint: "ದೋಣಿಯ ವೇಗ ಮತ್ತು ಸುರಕ್ಷಿತ ಅಂತರ ಲೆಕ್ಕಚಾರ.",
          tab: "map"
        },
        {
          badge: "ಹಂತ 4 / 7 • ನೇರ ಅಂಕಿಅಂಶಗಳು",
          title: "ಡೀಸೆಲ್ ಉಳಿತಾಯ ಮತ್ತು ಗಡಿ ವಿವರ",
          desc: "ಉಳಿತಾಯವಾಗುವ ರೂಪಾಯಿ (₹), ಪ್ರಯಾಣದ ಸಮಯ ಮತ್ತು ಅಂತಾರಾಷ್ಟ್ರೀಯ ಕಡಲ ಗಡಿಯಿಂದ (IMBL) ಇರುವ ಸುರಕ್ಷಿತ ದೂರವನ್ನು 4 ಬಣ್ಣ-ಕೋಡೆಡ್ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ನೇರವಾಗಿ ವೀಕ್ಷಿಸಿ.",
          hint: "ಮೀನುಗಾರರ ಡೆಕ್ ಕಾರ್ಯಾಚರಣೆಗೆ ಸ್ಪಷ್ಟವಾದ ನೋಟ.",
          tab: "map"
        },
        {
          badge: "ಹಂತ 5 / 7 • ನಕ್ಷೆ ಮತ್ತು ದಿಕ್ಸೂಚಿ",
          title: "ISRO ನಕ್ಷೆ ಮತ್ತು ಲೈವ್ ದಿಕ್ಸೂಚಿ ಸ್ಟಿಯರಿಂಗ್",
          desc: "ನಕ್ಷೆಯಲ್ಲಿ 🐟 ಮೀನಿನ ಗುರುತನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ. 'Plot & Steer Route ⚡' ಒತ್ತಿ ಲೈವ್ ದಿಕ್ಸೂಚಿ ಕೋನ (ಉದಾ: 288° WNW), ತಿರುವಿನ ಅಂತರ ಮತ್ತು ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ!",
          hint: "ಹಸಿರು ಗೆರೆ = ಪ್ರವಾಹ ಆಧಾರಿತ ಉಳಿತಾಯ ಮಾರ್ಗ (-28% ಡೀಸೆಲ್).",
          tab: "map"
        },
        {
          badge: "ಹಂತ 6 / 7 • AI ಸಹಾಯಕ",
          title: "ORCA AI ಸಹ-ಪೈಲಟ್ (ಧ್ವನಿ ಮತ್ತು ಚಾಟ್)",
          desc: "ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ. ಹವಾಮಾನ, ಮೀನಿನ ಸ್ಥಳಾಂತರ ಮತ್ತು ಗಡಿ ಭದ್ರತೆಯ ಬಗ್ಗೆ 4 AI ಏಜೆಂಟ್‌ಗಳು ಉತ್ತರಿಸುತ್ತಾರೆ.",
          hint: "ಧ್ವನಿ ಕೇಳಲು 🔊 ಬಟನ್ ಒತ್ತಿರಿ.",
          tab: "chat"
        },
        {
          badge: "ಹಂತ 7 / 7 • ಆಫ್‌ಲೈನ್ ಪಾಸ್",
          title: "0-ನೆಟ್‌ವರ್ಕ್ ಆಫ್‌ಲೈನ್ ಯಾನ ಪಾಸ್",
          desc: "ಸಮುದ್ರಕ್ಕೆ ಹೋಗುವ ಮುನ್ನ GPS ಪಾಯಿಂಟ್‌ಗಳು ಮತ್ತು ಕೋಸ್ಟ್ ಗಾರ್ಡ್ ತುರ್ತು ಸಂಖ್ಯೆ (1554) ಒಳಗೊಂಡ ಅಧಿಕೃತ A4 ಪಾಸ್ ಅನ್ನು ಪ್ರಿಂಟ್ ಅಥವಾ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಸೇವ್ ಮಾಡಿಕೊಳ್ಳಿ.",
          hint: "ಆಳಸಮುದ್ರದಲ್ಲಿ ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ 100% ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ!",
          tab: "pass"
        }
      ]
    },
    tcy: {
      steps: [
        {
          badge: "ಹಂತ 1 / 7 • ಪರಿಚಯ",
          title: "ಪ್ರಾಜೆಕ್ಟ್ ಒರ್ಕಾ (ORCA) ಗ್ ಸ್ವಾಗತ 🇮🇳",
          desc: "ಇದು ISRO ಉಪಗ್ರಹ ತಂತ್ರಜ್ಞಾನ ಆಧಾರಿತ ಸಮುದ್ರ AI ಸಿಸ್ಟಮ್. ಕರಾವಳಿದ ಮೀನುಗಾರರೆಗ್ ಮೀನ್ ತಿಕ್ಕುನ ಜಾಗೆ, ಡೀಸೆಲ್ ಒರಿಪುನ ಸಾದಿ ಬೊಕ್ಕ ಗಡಿದ ರಕ್ಷಣೆ ಕೊರ್ಪುಂಡು.",
          hint: "4 ಸಹಯೋಗಿ AI ಏಜೆಂಟ್ ಲು • 0-ಇಂಟರ್ನೆಟ್ ಸೌಲಭ್ಯ",
          tab: "map"
        },
        {
          badge: "ಹಂತ 2 / 7 • ಬಂದರ್ ಬೊಕ್ಕ ಭಾಷೆ",
          title: "ಕರಾವಳಿದ ಬಂದರ್ ಬೊಕ್ಕ ತುಳು ಭಾಷೆ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ",
          desc: "ಮಲ್ಪೆ, ಮಂಗಳೂರು ಬಂದರ್ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ ಬೊಕ್ಕ ತುಳು ಭಾಷೆನ್ ಆರಿಸಲೆ. AI ಮಾತಾ ಮಾಹಿತಿನ್ ತುಳುಟೇ ಕೊರ್ಪುಂಡು.",
          hint: "ತುಳು ಕರಾವಳಿ ಭಾಷೆಡ್ ಲಭ್ಯ ಉಂಡು.",
          tab: "map"
        },
        {
          badge: "ಹಂತ 3 / 7 • ಬೋಟ್ ಸೆಟಪ್",
          title: "ಈರೆನ ಬೋಟ್ ಮಾದರಿ ಸೆಟ್ ಮಲ್ಪುಲೆ",
          desc: "ಟ್ರಾಲ್ ಬೋಟ್, ಫೈಬರ್ ಬೋಟ್ ಅತ್ತ್ಂಡ ನಾಡ್ದೋಣಿ ಆರಿಸಲೆ. ಐತ ಪ್ರಕಾರ ಡೀಸೆಲ್ ಒರಿಪುನ ಲೆಕ್ಕ ಮಲ್ಪುವ.",
          hint: "ಬೋಟ್ ದ ವೇಗ ಬೊಕ್ಕ ರೇಂಜ್ ಲೆಕ್ಕಚಾರ.",
          tab: "map"
        },
        {
          badge: "ಹಂತ 4 / 7 • ಲೈವ್ ಮಾಹಿತಿ",
          title: "ಡೀಸೆಲ್ ಒರಿಪು ಬೊಕ್ಕ ಗಡಿದ ದೂರ",
          desc: "ಒರಿಪುನ ರುಪಾಯಿ (₹), ಪ್ರಯಾಣದ ಸಮಯ ಬೊಕ್ಕ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿರ್ದ್ ಸುರಕ್ಷಿತ ದೂರನ್ ಮುಲ್ಪ ತೂವೊಲಿ.",
          hint: "ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಕಾರ್ಡ್ ಲು.",
          tab: "map"
        },
        {
          badge: "ಹಂತ 5 / 7 • ನಕ್ಷೆ ಬೊಕ್ಕ ದಿಕ್ಸೂಚಿ",
          title: "ISRO ನಕ್ಷೆ ಬೊಕ್ಕ ದಿಕ್ಸೂಚಿ ಗೈಡೆನ್ಸ್",
          desc: "ನಕ್ಷೆಡ್ 🐟 ಮೀನ್ದ ಗುರುತು ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ. 'Plot & Steer Route ⚡' ಒತ್ತಿಂಡ ಲೈವ್ ದಿಕ್ಸೂಚಿ ಡಿಗ್ರಿ (288° WNW) ಬೊಕ್ಕ ಧ್ವನಿ ಕೇನೊಲಿ!",
          hint: "ಪಚ್ಚೆ ಗೆರೆ = ಡೀಸೆಲ್ ಒರಿಪುನ AI ಸಾದಿ (-28% ಡೀಸೆಲ್).",
          tab: "map"
        },
        {
          badge: "ಹಂತ 6 / 7 • AI ಕೋ-ಪೈಲಟ್",
          title: "ORCA AI ಕೋ-ಪೈಲಟ್ (ತುಳು ಧ್ವನಿ)",
          desc: "ತುಳುಟೇ ಪಾತೆರ್ಲೆ ಅತ್ತ್ಂಡ ಟೈಪ್ ಮಲ್ಪುಲೆ. ಹವಾಮಾನ, ಮೀನ್ದ ಮಾಹಿತಿ ಬೊಕ್ಕ ಗಡಿದ ಬಗ್ಗೆ AI ವಿವರ ಕೊರ್ಪುಂಡು.",
          hint: "ಧ್ವನಿ ಕೇನೆರೆ 🔊 ಬಟನ್ ಒತ್ತಿಲೆ.",
          tab: "chat"
        },
        {
          badge: "ಹಂತ 7 / 7 • ಆಫ್‌ಲೈನ್ ಪಾಸ್",
          title: "0-ನೆಟ್‌ವರ್ಕ್ ಆಫ್‌ಲೈನ್ ಬೋಟ್ ಪಾಸ್",
          desc: "ಕಡಲ್ ಗ್ ಪೋಪಿನ ದುಂಬು GPS ಪಾಯಿಂಟ್ಸ್ ಬೊಕ್ಕ ಕೋಸ್ಟ್ ಗಾರ್ಡ್ ನಂಬರ್ (1554) ಉಪ್ಪುನ ಅಧಿಕೃತ A4 ಪಾಸ್ ಪ್ರಿಂಟ್ ಮಲ್ತೊನ್ಲೆ.",
          hint: "ಆಳ ಕಡಲ್ಡ್ ಇಂಟರ್ನೆಟ್ ದಾಂತೆ ಕೆಲಸ ಮಲ್ಪುಂಡು!",
          tab: "pass"
        }
      ]
    },
    ta: {
      steps: [
        {
          badge: "படி 1 / 7 • அறிமுகம்",
          title: "ப்ராஜெக்ட் ஓர்கா (ORCA) விற்கு நல்வரவு 🇮🇳",
          desc: "ISRO செயற்கைக்கோள் தரவு (SST மற்றும் குளோரோபில்) மூலம் மீனவர்களுக்கு அதிக மீன் கிடைக்கும் பகுதிகள், டீசல் சேமிப்பு மற்றும் கடல் பாதுகாப்பு வழங்கும் AI தளம்.",
          hint: "4 கூட்டு AI ஏஜெண்டுகள் • 0-இணைய வசதி",
          tab: "map"
        },
        {
          badge: "படி 2 / 7 • துறைமுகம் & மொழி",
          title: "துறைமுகம் மற்றும் தமிழ் மொழியைத் தேர்ந்தெடுக்கவும்",
          desc: "சென்னை, ராமேஸ்வரம் போன்ற உங்கள் துறைமுகத்தைத் தேர்வு செய்து, தமிழ் மொழியைத் தேர்ந்தெடுக்கவும். AI பதில்கள் மற்றும் குரல் உடனடியாக மாறும்.",
          hint: "7 இந்திய மொழிகளில் கிடைக்கிறது.",
          tab: "map"
        },
        {
          badge: "படி 3 / 7 • படகு அமைப்பு",
          title: "படகு வகையை அமைக்கவும்",
          desc: "விசைப்படகு, ஃபைபர் படகு அல்லது நாட்டுப்படகைத் தேர்ந்தெடுக்கவும். இதன் மூலம் டீசல் நுகர்வு துல்லியமாக கணக்கிடப்படுகிறது.",
          hint: "படகு வேகம் மற்றும் பாதுகாப்பு வரம்பு.",
          tab: "map"
        },
        {
          badge: "படி 4 / 7 • நேரடி விவரங்கள்",
          title: "டீசல் சேமிப்பு & எல்லை பாதுகாப்பு",
          desc: "சேமிக்கப்படும் ரூபாய் (₹), பயண நேரம் மற்றும் சர்வதேச கடல் எல்லை (IMBL) தூரத்தை நேரடியாகப் பார்க்கலாம்.",
          hint: "தெளிவான வண்ண கார்டுகள்.",
          tab: "map"
        },
        {
          badge: "படி 5 / 7 • வரைபடம் & திசைகாட்டி",
          title: "ISRO வரைபடம் & நேரடி திசைகாட்டி வழிகாட்டல்",
          desc: "வரைபடத்தில் 🐟 மீன் குறியீட்டைத் தட்டவும். 'Plot & Steer Route ⚡' அழுத்தி நேரடி திசைகாட்டி கோணம் (எ.கா. 288° WNW) மற்றும் தமிழ் குரல் வழிகாட்டலைப் பெறவும்!",
          hint: "பச்சை கோடு = AI நீரோட்ட வழித்தடம் (-28% டீசல்).",
          tab: "map"
        },
        {
          badge: "படி 6 / 7 • AI உதவி",
          title: "ORCA AI உரையாடல் உதவி (குரல் & தமிழ்)",
          desc: "தமிழில் தட்டச்சு செய்யவும் அல்லது பேசவும். வானிலை, மீன் நடமாட்டம் மற்றும் எல்லை பாதுகாப்பு குறித்து 4 AI ஏஜெண்டுகள் பதிலளிக்கும்.",
          hint: "குரல் கேட்க 🔊 பட்டனை அழுத்தவும்.",
          tab: "chat"
        },
        {
          badge: "படி 7 / 7 • ஆஃப்லைன் பாஸ்",
          title: "0-இணைய ஆஃப்லைன் பயண பாஸ்",
          desc: "கடலுக்குச் செல்லும் முன் GPS வழிகள் மற்றும் கடலோர காவல்படை அவசர எண் (1554) கொண்ட அதிகாரப்பூர்வ A4 பாஸை அச்சிடவும்.",
          hint: "ஆழ்கடலில் 100% இணையம் இல்லாமல் செயல்படும்!",
          tab: "pass"
        }
      ]
    },
    ml: {
      steps: [
        {
          badge: "ഘട്ടം 1 / 7 • ആമുഖം",
          title: "പ്രൊജക്റ്റ് ഓർക്ക (ORCA) യിലേക്ക് സ്വാഗതം 🇮🇳",
          desc: "ഐഎസ്ആർഒ ഉപഗ്രഹ വിവരങ്ങൾ അടിസ്ഥാനമാക്കി മത്സ്യത്തൊഴിലാളികൾക്ക് ഉയർന്ന മത്സ്യ ലഭ്യതയും ഡീസൽ ലാഭവും സുരക്ഷയും നൽകുന്ന എഐ പ്ലാറ്റ്‌ഫോം.",
          hint: "4 സഹകരണ എഐ ഏജന്റുകൾ • 0-ഇന്റർനെറ്റ് സൗകര്യം",
          tab: "map"
        },
        {
          badge: "ഘട്ടം 2 / 7 • ഹാർബർ & ഭാഷ",
          title: "ഹാർബറും മലയാളം ഭാഷയും തിരഞ്ഞെടുക്കുക",
          desc: "കൊച്ചി, വിഴിഞ്ഞം തുടങ്ങിയ ഹാർബറുകളും മലയാളം ഭാഷയും തിരഞ്ഞെടുക്കുക. എഐ തത്സമയം മലയാളത്തിൽ പ്രതികരിക്കും.",
          hint: "7 പ്രാദേശിക ഭാഷകളിൽ ലഭ്യമാണ്.",
          tab: "map"
        },
        {
          badge: "ഘട്ടം 3 / 7 • ബോട്ട് സെറ്റപ്പ്",
          title: "ബോട്ട് വിവരങ്ങൾ സജ്ജമാക്കുക",
          desc: "ട്രോളർ, ഫൈബർ ബോട്ട് അല്ലെങ്കിൽ പരമ്പരാഗത ബോട്ട് തിരഞ്ഞെടുക്കുക. ഇതിലൂടെ ഡീസൽ കണക്കുകൂട്ടൽ കൃത്യമാകും.",
          hint: "ബോട്ട് സ്പീഡും സുരക്ഷിത പരിധിയും.",
          tab: "map"
        },
        {
          badge: "ഘട്ടം 4 / 7 • തത്സമയ വിവരങ്ങൾ",
          title: "ഡീസൽ ലാഭവും അതിർത്തി വിവരങ്ങളും",
          desc: "ലാഭിച്ച രൂപ (₹), യാത്രാ സമയം, അന്താരാഷ്ട്ര അതിർത്തിയിലേക്കുള്ള (IMBL) സുരക്ഷിത ദൂരം എന്നിവ തത്സമയം കാണാം.",
          hint: "കളർ-കോഡഡ് കാർഡുകൾ.",
          tab: "map"
        },
        {
          badge: "ഘട്ടം 5 / 7 • മാപ്പും കോമ്പസും",
          title: "ISRO മാപ്പും ലൈവ് കോമ്പസ് ഗൈഡൻസും",
          desc: "മാപ്പിലെ 🐟 മത്സ്യ ഐക്കണിൽ ക്ലിക്ക് ചെയ്യുക. 'Plot & Steer Route ⚡' ക്ലിക്ക് ചെയ്ത് കോമ്പസ് ദിശയും (288° WNW) മലയാളം ശബ്ദ നിർദ്ദേശങ്ങളും നേടുക!",
          hint: "പച്ച വര = എഐ ഒഴുക്ക് റൂട്ട് (-28% ഡീസൽ).",
          tab: "map"
        },
        {
          badge: "ഘട്ടം 6 / 7 • എഐ കോ-പൈലറ്റ്",
          title: "ORCA എഐ കോ-പൈലറ്റ് (ശബ്ദവും ചാറ്റും)",
          desc: "മലയാളത്തിൽ സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യുക. കാലാവസ്ഥയും മത്സ്യ വിവരങ്ങളും എഐ വിശദീകരിക്കും.",
          hint: "ശബ്ദം കേൾക്കാൻ 🔊 ബട്ടൺ അമർത്തുക.",
          tab: "chat"
        },
        {
          badge: "ഘട്ടം 7 / 7 • ഓഫ്‌ലൈൻ പാസ്",
          title: "0-നെറ്റ്‌വർക്ക് ഓഫ്‌ലൈൻ യാത്രാ പാസ്",
          desc: "ആഴക്കടലിലേക്ക് പോകുന്നതിന് മുൻപ് GPS പോയിന്റുകളും കോസ്റ്റ് ഗാർഡ് നമ്പറും (1554) അടങ്ങിയ ഔദ്യോഗിക പാസ് പ്രിന്റ് ചെയ്യുക.",
          hint: "ആഴക്കടലിൽ ഇന്റർനെറ്റ് ഇല്ലാതെ പ്രവർത്തിക്കും!",
          tab: "pass"
        }
      ]
    },
    hi: {
      steps: [
        {
          badge: "चरण 1 / 7 • परिचय",
          title: "प्रोजेक्ट ओर्का (ORCA) में आपका स्वागत है 🇮🇳",
          desc: "यह ISRO उपग्रह डेटा (SST और क्लोरोफिल) द्वारा संचालित AI प्लेटफॉर्म है जो मछुआरों को मछली के सबसे समृद्ध क्षेत्र, डीजल बचत और सीमा सुरक्षा प्रदान करता है।",
          hint: "4 सहयोगी AI एजेंट्स • 0-इंटरनेट सुविधा",
          tab: "map"
        },
        {
          badge: "चरण 2 / 7 • बंदरगाह और भाषा",
          title: "तटीय बंदरगाह और भाषा चुनें",
          desc: "वेरावल, पोरबंदर, चेन्नई आदि बंदरगाह और अपनी भाषा (हिन्दी, गुजराती, आदि) चुनें। AI तुरंत चयनित भाषा में उत्तर देगा।",
          hint: "7 भारतीय भाषाओं में उपलब्ध।",
          tab: "map"
        },
        {
          badge: "चरण 3 / 7 • नाव सेटअप",
          title: "अपनी नाव का प्रकार चुनें",
          desc: "मैकेनाइज्ड ट्रॉलर, फाइबर बोट या पारंपरिक नाव चुनें ताकि डीजल बचत और सीमा सुरक्षा की सटीक गणना हो सके।",
          hint: "नाव की गति और सुरक्षित दूरी।",
          tab: "map"
        },
        {
          badge: "चरण 4 / 7 • लाइव आंकड़े",
          title: "डीजल बचत और समुद्री सीमा",
          desc: "बचाए गए रुपये (₹), यात्रा समय और अंतरराष्ट्रीय समुद्री सीमा (IMBL) से सुरक्षित दूरी को तुरंत देखें।",
          hint: "स्पष्ट रंगीन कार्ड।",
          tab: "map"
        },
        {
          badge: "चरण 5 / 7 • नक्शा और कम्पास",
          title: "ISRO नक्शा और लाइव कम्पास स्टीयरिंग",
          desc: "नक्शे पर किसी भी 🐟 मछली पॉइंट पर क्लिक करें। 'Plot & Steer Route ⚡' दबाकर लाइव कम्पास कोण (जैसे 288° WNW) और हिन्दी वॉयस गाइडेंस प्राप्त करें!",
          hint: "हरी रेखा = AI करंट-असिस्टेड मार्ग (-28% डीजल)।",
          tab: "map"
        },
        {
          badge: "चरण 6 / 7 • AI को-पायलट",
          title: "ORCA AI को-पायलट (वॉयस और चैट)",
          desc: "हिन्दी में बोलें या टाइप करें। मौसम, मछली की स्थिति और सीमा सुरक्षा के लिए 4 AI एजेंट्स मिलकर सलाह देते हैं।",
          hint: "वॉयस सुनने के लिए 🔊 बटन दबाएं।",
          tab: "chat"
        },
        {
          badge: "चरण 7 / 7 • ऑफलाइन पास",
          title: "0-इंटरनेट डीप-सी यात्रा पास",
          desc: "गहरे समुद्र में जाने से पहले GPS पॉइंट्स और कोस्ट गार्ड इमरजेंसी नंबर (1554) वाला आधिकारिक A4 पास प्रिंट या सेव करें।",
          hint: "समुद्र में बिना इंटरनेट के 100% काम करता है!",
          tab: "pass"
        }
      ]
    }
  };

  const currentLangPack = tourData[selectedLang] || tourData.en;
  const currentStepData = currentLangPack.steps[currentStep] || currentLangPack.steps[0];

  // Auto-switch tabs when stepping through the tour
  useEffect(() => {
    if (!isOpen) return;
    if (onNavigateTab && currentStepData.tab) {
      onNavigateTab(currentStepData.tab);
    }
  }, [isOpen, currentStep, currentStepData.tab, onNavigateTab]);

  const handleNext = () => {
    if (currentStep < currentLangPack.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('orca_tour_seen', 'true');
    } catch (e) {}

    // Confetti celebration
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    onClose();
  };

  if (!isOpen) return null;

  // Render Visual Simulation Preview for each step
  const renderStepPreview = (stepIdx) => {
    switch (stepIdx) {
      case 0: // Overview
        return (
          <div className="bg-[#010814] rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/orca_logo.png" 
                alt="ORCA Emblem" 
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_20px_rgba(0,245,160,0.5)] shrink-0 animate-pulse"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">PROJECT ORCA</span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">ISRO PS-26176</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">Marine EcoSystem Reasoning with Collaborative Agents</p>
              </div>
            </div>
          </div>
        );

      case 1: // Ports & Languages
        return (
          <div className="bg-[#010814] rounded-2xl p-3.5 border border-cyan-500/30 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1"><Anchor className="w-3.5 h-3.5" /> 8 Coastal Harbors</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" /> 7 Regional Languages</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">⚓ Malpe (Udupi)</span>
              <span className="px-2.5 py-1 rounded-xl bg-white/10 text-slate-300">⚓ Mangalore</span>
              <span className="px-2.5 py-1 rounded-xl bg-white/10 text-slate-300">⚓ Chennai</span>
              <span className="px-2.5 py-1 rounded-xl bg-white/10 text-slate-300">⚓ Veraval</span>
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">🌐 ಕನ್ನಡ</span>
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">🌐 ತುಳು</span>
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">🌐 தமிழ்</span>
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">🌐 മലയാളം</span>
            </div>
          </div>
        );

      case 2: // Vessel Setup
        return (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl overflow-hidden border-2 border-emerald-400 relative h-20 shadow-[0_0_15px_rgba(0,245,160,0.3)] flex flex-col justify-end p-2 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(2,11,23,0.95), rgba(2,11,23,0.4)), url('/assets/vessel_trawler.png')" }}>
              <span className="text-[10px] font-black text-white">🚢 Trawler</span>
              <span className="text-[9px] text-emerald-300 font-mono">20 L/hr &bull; 60 NM</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/20 relative h-20 flex flex-col justify-end p-2 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(2,11,23,0.95), rgba(2,11,23,0.4)), url('/assets/vessel_fibre.png')" }}>
              <span className="text-[10px] font-black text-white">🚤 Fibre Boat</span>
              <span className="text-[9px] text-slate-300 font-mono">6.5 L/hr &bull; 28 NM</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/20 relative h-20 flex flex-col justify-end p-2 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to top, rgba(2,11,23,0.95), rgba(2,11,23,0.4)), url('/assets/vessel_country.png')" }}>
              <span className="text-[10px] font-black text-white">🚣 Country Craft</span>
              <span className="text-[9px] text-slate-300 font-mono">3.2 L/hr &bull; 12 NM</span>
            </div>
          </div>
        );

      case 3: // Telemetry
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-emerald-300 font-bold">🐟 Marine Shoal</span>
              <p className="text-sm font-black text-white mt-0.5">97% Match</p>
              <span className="text-[9px] text-emerald-400 font-mono">Indian Mackerel</span>
            </div>
            <div className="bg-amber-500/15 border border-amber-400/40 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-amber-300 font-bold">⛽ Fuel Saved</span>
              <p className="text-sm font-black text-amber-300 mt-0.5">₹2,400</p>
              <span className="text-[9px] text-amber-400 font-mono">-28.5% Diesel</span>
            </div>
            <div className="bg-cyan-500/15 border border-cyan-400/40 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-cyan-300 font-bold">⏱️ Time Saved</span>
              <p className="text-sm font-black text-cyan-300 mt-0.5">75 mins</p>
              <span className="text-[9px] text-slate-300 font-mono">10.4 kts speed</span>
            </div>
            <div className="bg-rose-500/15 border border-rose-400/40 rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-rose-300 font-bold">🛡️ IMBL Border</span>
              <p className="text-sm font-black text-rose-300 mt-0.5">SAFE</p>
              <span className="text-[9px] text-slate-300 font-mono">&gt; 18 km buffer</span>
            </div>
          </div>
        );

      case 4: // Map & Steer HUD
        return (
          <div className="bg-[#020b17] border-2 border-emerald-400 rounded-2xl p-3.5 space-y-2 shadow-[0_0_25px_rgba(0,245,160,0.25)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 bg-emerald-500/25 border border-emerald-400/60 px-3 py-1 rounded-xl">
                <Navigation className="w-4 h-4 text-emerald-400 transform -rotate-45 animate-pulse" />
                <span className="text-sm font-black text-white font-mono">288° WNW</span>
              </div>
              <div className="text-left text-xs font-black text-emerald-300">
                Next Turn: 4.5 NM <span className="text-slate-300 font-normal font-mono">(+1.35 kts assist)</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-400 text-slate-950 text-[10px] font-black">
                🔊 Voice Live
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-0.5">
              <span>⚓ Departure: Malpe</span>
              <span className="text-emerald-400 font-bold">🟢 AI Current-Assisted Route</span>
              <span>🐟 PFZ: Kingfish (31.7 NM)</span>
            </div>
          </div>
        );

      case 5: // AI Chat
        return (
          <div className="bg-[#010814] rounded-2xl p-3 border border-cyan-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono border-b border-white/10 pb-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>4 Collaborative Agents Active (Matsya Drishti, Sagara Vayu, Nava Setu, Samudra Raksha)</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 text-slate-200 space-y-1">
              <p className="font-bold text-white flex items-center justify-between">
                <span>🤖 ORCA Multi-Agent Synthesis</span>
                <span className="text-emerald-400 text-[10px] font-mono">ISRO EO Data</span>
              </p>
              <p className="text-[11px] text-slate-300">"Sea conditions are safe (wave height 1.15m). Target Kingfish shoal is 31.7 NM offshore with ₹2,400 diesel savings."</p>
            </div>
          </div>
        );

      case 6: // Offline Pass
        return (
          <div className="bg-[#010814] rounded-2xl p-3.5 border-2 border-emerald-400/60 flex items-center justify-between gap-3 text-xs shadow-inner">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-black text-sm">🎫 Official Fisherman Voyage Pass</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">100% OFFLINE</span>
              </div>
              <p className="text-[10px] text-slate-300">Single-page printable A4 clearance with GPS step waypoints.</p>
              <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1.5 pt-0.5">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Coast Guard Emergency SOS: <strong>1554</strong> &bull; VHF: <strong>Ch-16</strong></span>
              </div>
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-lg shadow-emerald-500/20">
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      
      {/* Tour Modal Card */}
      <div className="relative w-full max-w-xl bg-[#020b17] border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-[0_25px_90px_rgba(0,0,0,1)] text-white space-y-4 ring-2 ring-emerald-400/40">
        
        {/* Header Strip */}
        <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-3">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono font-black text-emerald-400 uppercase tracking-wider block">
              {currentStepData.badge}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white tracking-wide mt-0.5 flex items-center gap-2">
              {currentStepData.title}
            </h3>
          </div>

          <button
            onClick={handleFinish}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition shrink-0"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual UI Feature Simulator Box */}
        <div className="py-1">
          {renderStepPreview(currentStep)}
        </div>

        {/* Step Description & Hint */}
        <div className="space-y-2 bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
            {currentStepData.desc}
          </p>
          <div className="text-[11px] text-emerald-300 font-mono font-bold flex items-center gap-1.5 pt-1 border-t border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{currentStepData.hint}</span>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-3">
          
          {/* Step Progression Dots */}
          <div className="flex items-center gap-1.5">
            {currentLangPack.steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-6 bg-emerald-400 shadow-[0_0_10px_rgba(0,245,160,0.8)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition flex items-center gap-1 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <span>{currentStep === currentLangPack.steps.length - 1 ? 'Finish & Sail 🎉' : 'Next Step'}</span>
              {currentStep === currentLangPack.steps.length - 1 ? <Check className="w-4 h-4 stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
