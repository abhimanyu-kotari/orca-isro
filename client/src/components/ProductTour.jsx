import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Compass, Ship, Anchor, Globe2, Fuel, ShieldCheck, MessageSquare, FileText, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProductTour({ isOpen, onClose, selectedLang = 'en', onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const cardRef = useRef(null);

  // Multilingual Tour Steps Content
  const tourContent = {
    en: [
      {
        targetId: 'tour-brand',
        tab: 'map',
        icon: Sparkles,
        badge: 'Step 1 of 7 &bull; Overview',
        title: 'Welcome to Project ORCA 🇮🇳',
        desc: 'Project ORCA (ISRO PS-26176) is an AI Marine Intelligence platform. It uses satellite Earth Observation (SST, Chlorophyll) and collaborative agents to help fishermen find high-yield zones, save diesel, and stay safe.',
        actionHint: 'Let’s take a quick 1-minute walkthrough!'
      },
      {
        targetId: 'tour-harbor-lang',
        tab: 'map',
        icon: Anchor,
        badge: 'Step 2 of 7 &bull; Port & Language',
        title: 'Select Coastal Harbor & Mother Tongue',
        desc: 'Choose your departure harbor (Malpe, Mangalore, Chennai, Veraval, etc.) and your regional language (Kannada, Tulu, Tamil, Telugu, Hindi, Malayalam). All routes and AI voice adapt instantly.',
        actionHint: 'Supports 7 Indian coastal languages.'
      },
      {
        targetId: 'tour-vessel',
        tab: 'map',
        icon: Ship,
        badge: 'Step 3 of 7 &bull; Boat Calibration',
        title: 'Calibrate Your Vessel Profile',
        desc: 'Select whether you are sailing a Mechanized Trawler (20 L/hr), Motorized Fibre Boat (6.5 L/hr), or Traditional Country Craft (3.2 L/hr). This fine-tunes AI fuel math, speed, and safety buffers.',
        actionHint: 'Includes authentic boat specs & photos.'
      },
      {
        targetId: 'tour-telemetry',
        tab: 'map',
        icon: Fuel,
        badge: 'Step 4 of 7 &bull; Live Telemetry',
        title: 'Real-Time Financial & Safety Stats',
        desc: 'Instantly view your estimated diesel cost saved in Rupees (₹), travel time saved, CO2 reduction, and distance to the International Maritime Boundary Line (IMBL).',
        actionHint: 'Color-coded cards for quick cockpit scanning.'
      },
      {
        targetId: 'tour-map',
        tab: 'map',
        icon: Compass,
        badge: 'Step 5 of 7 &bull; Map & Steer Guidance',
        title: 'Interactive ISRO Satellite Map & Heading Steer',
        desc: 'Click on any 🐟 Fish Hotspot to view water temperature, chlorophyll, and depth. Tap "Plot & Steer Route" to activate the Live Compass HUD with real-time degrees (e.g., 288° WNW) and voice audio!',
        actionHint: 'Green line = AI current-assisted route (-28% fuel).'
      },
      {
        targetId: 'tour-chat',
        tab: 'chat',
        icon: MessageSquare,
        badge: 'Step 6 of 7 &bull; AI Co-Pilot',
        title: 'Conversational Co-Pilot (Voice & Multilingual)',
        desc: 'Ask questions by typing or speaking in your mother tongue (ಕನ್ನಡ, ತುಳು, தமிழ், മലയാളം, etc.). 4 autonomous subagents collaborate to diagnose fish migrations, weather conditions, and border safety.',
        actionHint: 'Tap the 🔊 button to listen to audio responses.'
      },
      {
        targetId: 'tour-pass',
        tab: 'pass',
        icon: FileText,
        badge: 'Step 7 of 7 &bull; 0-Internet Pass',
        title: 'Deep-Sea 0-Network Voyage Pass & SOS',
        desc: 'Before sailing out of mobile coverage, download or print your official single-page A4 Fisherman Voyage Pass with GPS waypoint coordinates and Coast Guard SOS helplines (1554).',
        actionHint: 'Works 100% offline in deep ocean waters!'
      }
    ],
    kn: [
      {
        targetId: 'tour-brand',
        tab: 'map',
        icon: Sparkles,
        badge: 'ಹಂತ 1 / 7 &bull; ಪರಿಚಯ',
        title: 'ಪ್ರಾಜೆಕ್ಟ್ ಒರ್ಕಾ (ORCA) ಗೆ ಸುಸ್ವಾಗತ 🇮🇳',
        desc: 'ಇದು ISRO ಉಪಗ್ರಹ ತಂತ್ರಜ್ಞಾನ (SST ಮತ್ತು ಕ್ಲೋರೊಫಿಲ್) ಆಧಾರಿತ AI ವೇದಿಕೆ. ಮೀನುಗಾರರಿಗೆ ಸಮೃದ್ಧ ಮೀನಿನ ವಲಯಗಳನ್ನು ಹುಡುಕಲು, ಡೀಸೆಲ್ ಉಳಿಸಲು ಮತ್ತು ಗಡಿ ರಕ್ಷಣೆ ಒದಗಿಸಲು ಇದು ನೆರವಾಗುತ್ತದೆ.',
        actionHint: 'ತ್ವರಿತ 1 ನಿಮಿಷದ ಮಾರ್ಗದರ್ಶನ ನೋಡಿ!'
      },
      {
        targetId: 'tour-harbor-lang',
        tab: 'map',
        icon: Anchor,
        badge: 'ಹಂತ 2 / 7 &bull; ಬಂದರು ಮತ್ತು ಭಾಷೆ',
        title: 'ಕರಾವಳಿ ಬಂದರು ಮತ್ತು ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
        desc: 'ನಿಮ್ಮ ನಿರ್ಗಮನ ಬಂದರು (ಮಲ್ಪೆ, ಮಂಗಳೂರು, ಚೆನ್ನೈ, ಇತ್ಯಾದಿ) ಮತ್ತು ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯನ್ನು (ಕನ್ನಡ, ತುಳು, ತಮಿಳು, ಇತ್ಯಾದಿ) ಆಯ್ಕೆಮಾಡಿ. AI ತಕ್ಷಣವೇ ಆ ಭಾಷೆಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.',
        actionHint: '7 ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.'
      },
      {
        targetId: 'tour-vessel',
        tab: 'map',
        icon: Ship,
        badge: 'ಹಂತ 3 / 7 &bull; ದೋಣಿ ಸೆಟಪ್',
        title: 'ದೋಣಿ ಮಾದರಿಯನ್ನು ಹೊಂದಿಸಿ',
        desc: 'ನಿಮ್ಮ ದೋಣಿ ಮೆಕನೈಸ್ಡ್ ಟ್ರಾಲರ್, ಫೈಬರ್ ಬೋಟ್ ಅಥವಾ ಸಾಂಪ್ರದಾಯಿಕ ದೋಣಿ ಎಂಬುದನ್ನು ಆರಿಸಿ. ಇದರಿಂದ ಡೀಸೆಲ್ ಉಳಿತಾಯವನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.',
        actionHint: 'ದೋಣಿಯ ವೇಗ ಮತ್ತು ಸುರಕ್ಷಿತ ಅಂತರ ಲೆಕ್ಕಚಾರ.'
      },
      {
        targetId: 'tour-telemetry',
        tab: 'map',
        icon: Fuel,
        badge: 'ಹಂತ 4 / 7 &bull; ನೇರ ವಿವರಗಳು',
        title: 'ಡೀಸೆಲ್ ಉಳಿತಾಯ ಮತ್ತು ಗಡಿ ವಿವರ',
        desc: 'ಉಳಿತಾಯವಾಗುವ ರೂಪಾಯಿ (₹), ಪ್ರಯಾಣದ ಸಮಯ ಮತ್ತು ಅಂತಾರಾಷ್ಟ್ರೀಯ ಕಡಲ ಗಡಿಯಿಂದ (IMBL) ಇರುವ ಸುರಕ್ಷಿತ ದೂರವನ್ನು ನೇರವಾಗಿ ವೀಕ್ಷಿಸಿ.',
        actionHint: 'ಬಣ್ಣ-ಕೋಡೆಡ್ ಕಾರ್ಡ್‌ಗಳು.'
      },
      {
        targetId: 'tour-map',
        tab: 'map',
        icon: Compass,
        badge: 'ಹಂತ 5 / 7 &bull; ನಕ್ಷೆ ಮತ್ತು ದಿಕ್ಸೂಚಿ',
        title: 'ISRO ನಕ್ಷೆ ಮತ್ತು ಲೈವ್ ದಿಕ್ಸೂಚಿ ಸ್ಟಿಯರಿಂಗ್',
        desc: 'ನಕ್ಷೆಯಲ್ಲಿ 🐟 ಮೀನಿನ ಗುರುತನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ. "Plot & Steer Route" ಒತ್ತಿ ಲೈವ್ ದಿಕ್ಸೂಚಿ ಕೋನ (ಉದಾ: 288° WNW) ಮತ್ತು ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ!',
        actionHint: 'ಹಸಿರು ಗೆರೆ = ಪ್ರವಾಹ ಆಧಾರಿತ ಉಳಿತಾಯ ಮಾರ್ಗ.'
      },
      {
        targetId: 'tour-chat',
        tab: 'chat',
        icon: MessageSquare,
        badge: 'ಹಂತ 6 / 7 &bull; AI ಸಹಾಯಕ',
        title: 'ORCA AI ಸಹ-ಪೈಲಟ್ (ಧ್ವನಿ ಮತ್ತು ಚಾಟ್)',
        desc: 'ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ. ಹವಾಮಾನ, ಮೀನಿನ ಮಾಹಿತಿ ಮತ್ತು ಗಡಿ ಭದ್ರತೆಯ ಬಗ್ಗೆ 4 AI ಏಜೆಂಟ್‌ಗಳು ಉತ್ತರಿಸುತ್ತಾರೆ.',
        actionHint: 'ಧ್ವನಿ ಕೇಳಲು 🔊 ಬಟನ್ ಒತ್ತಿರಿ.'
      },
      {
        targetId: 'tour-pass',
        tab: 'pass',
        icon: FileText,
        badge: 'ಹಂತ 7 / 7 &bull; ಆಫ್‌ಲೈನ್ ಪಾಸ್',
        title: '0-ನೆಟ್‌ವರ್ಕ್ ಆಫ್‌ಲೈನ್ ಯಾನ ಪಾಸ್',
        desc: 'ಸಮುದ್ರಕ್ಕೆ ಹೋಗುವ ಮುನ್ನ GPS ಪಾಯಿಂಟ್‌ಗಳು ಮತ್ತು ಕೋಸ್ಟ್ ಗಾರ್ಡ್ ತುರ್ತು ಸಂಖ್ಯೆ (1554) ಒಳಗೊಂಡ ಅಧಿಕೃತ A4 ಪಾಸ್ ಅನ್ನು ಪ್ರಿಂಟ್ ಅಥವಾ ಸೇವ್ ಮಾಡಿಕೊಳ್ಳಿ.',
        actionHint: 'ಆಳಸಮುದ್ರದಲ್ಲಿ 100% ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ!'
      }
    ],
    tcy: [
      {
        targetId: 'tour-brand',
        tab: 'map',
        icon: Sparkles,
        badge: 'ಹಂತ 1 / 7 &bull; ಪರಿಚಯ',
        title: 'ಪ್ರಾಜೆಕ್ಟ್ ಒರ್ಕಾ (ORCA) ಗ್ ಸ್ವಾಗತ 🇮🇳',
        desc: 'ಇದು ISRO ಉಪಗ್ರಹ ತಂತ್ರಜ್ಞಾನ ಆಧಾರಿತ AI ಸಿಸ್ಟಮ್. ಕರಾವಳಿದ ಮೀನುಗಾರರೆಗ್ ಮೀನ್ ತಿಕ್ಕುನ ಜಾಗೆ, ಡೀಸೆಲ್ ಒರಿಪುನ ಸಾದಿ ಬೊಕ್ಕ ಗಡಿದ ರಕ್ಷಣೆ ಕೊರ್ಪುಂಡು.',
        actionHint: '1 ನಿಮಿಷದ ಗೈಡ್ ತೂಲೆ!'
      },
      {
        targetId: 'tour-harbor-lang',
        tab: 'map',
        icon: Anchor,
        badge: 'ಹಂತ 2 / 7 &bull; ಬಂದರ್ ಬೊಕ್ಕ ಭಾಷೆ',
        title: 'ಕರಾವಳಿದ ಬಂದರ್ ಬೊಕ್ಕ ತುಳು ಭಾಷೆ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ',
        desc: 'ಮಲ್ಪೆ, ಮಂಗಳೂರು ಬಂದರ್ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ ಬೊಕ್ಕ ತುಳು ಭಾಷೆನ್ ಆರಿಸಲೆ. AI ಮಾತಾ ಮಾಹಿತಿನ್ ತುಳುಟೇ ಕೊರ್ಪುಂಡು.',
        actionHint: 'ತುಳು ಕರಾವಳಿ ಭಾಷೆಡ್ ಲಭ್ಯ ಉಂಡು.'
      },
      {
        targetId: 'tour-vessel',
        tab: 'map',
        icon: Ship,
        badge: 'ಹಂತ 3 / 7 &bull; ಬೋಟ್ ಸೆಟಪ್',
        title: 'ಈರೆನ ಬೋಟ್ ಮಾದರಿ ಸೆಟ್ ಮಲ್ಪುಲೆ',
        desc: 'ಟ್ರಾಲ್ ಬೋಟ್, ಫೈಬರ್ ಬೋಟ್ ಅತ್ತ್ಂಡ ನಾಡ್ದೋಣಿ ಆರಿಸಲೆ. ಐತ ಪ್ರಕಾರ ಡೀಸೆಲ್ ಒರಿಪುನ ಲೆಕ್ಕ ಮಲ್ಪುವ.',
        actionHint: 'ಬೋಟ್ ದ ವೇಗ ಬೊಕ್ಕ ರೇಂಜ್ ಲೆಕ್ಕಚಾರ.'
      },
      {
        targetId: 'tour-telemetry',
        tab: 'map',
        icon: Fuel,
        badge: 'ಹಂತ 4 / 7 &bull; ಲೈವ್ ಮಾಹಿತಿ',
        title: 'ಡೀಸೆಲ್ ಒರಿಪು ಬೊಕ್ಕ ಗಡಿದ ದೂರ',
        desc: 'ಒರಿಪುನ ರುಪಾಯಿ (₹), ಪ್ರಯಾಣದ ಸಮಯ ಬೊಕ್ಕ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿರ್ದ್ ಸುರಕ್ಷಿತ ದೂರನ್ ಮುಲ್ಪ ತೂವೊಲಿ.',
        actionHint: 'ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಕಾರ್ಡ್ ಲು.'
      },
      {
        targetId: 'tour-map',
        tab: 'map',
        icon: Compass,
        badge: 'ಹಂತ 5 / 7 &bull; ನಕ್ಷೆ ಬೊಕ್ಕ ದಿಕ್ಸೂಚಿ',
        title: 'ISRO ನಕ್ಷೆ ಬೊಕ್ಕ ದಿಕ್ಸೂಚಿ ಗೈಡೆನ್ಸ್',
        desc: 'ನಕ್ಷೆಡ್ 🐟 ಮೀನ್ದ ಗುರುತು ಕ್ಲಿಕ್ ಮಲ್ಪುಲೆ. "Plot & Steer Route" ಒತ್ತಿಂಡ ಲೈವ್ ದಿಕ್ಸೂಚಿ ಡಿಗ್ರಿ (288° WNW) ಬೊಕ್ಕ ಧ್ವನಿ ಕೇನೊಲಿ!',
        actionHint: 'ಪಚ್ಚೆ ಗೆರೆ = ಡೀಸೆಲ್ ಒರಿಪುನ AI ಸಾದಿ.'
      },
      {
        targetId: 'tour-chat',
        tab: 'chat',
        icon: MessageSquare,
        badge: 'ಹಂತ 6 / 7 &bull; AI ಕೋ-ಪೈಲಟ್',
        title: 'ORCA AI ಕೋ-ಪೈಲಟ್ (ತುಳು ಧ್ವನಿ)',
        desc: 'ತುಳುಟೇ ಪಾತೆರ್ಲೆ ಅತ್ತ್ಂಡ ಟೈಪ್ ಮಲ್ಪುಲೆ. ಹವಾಮಾನ, ಮೀನ್ದ ಮಾಹಿತಿ ಬೊಕ್ಕ ಗಡಿದ ಬಗ್ಗೆ AI ವಿವರ ಕೊರ್ಪುಂಡು.',
        actionHint: 'ಧ್ವನಿ ಕೇನೆರೆ 🔊 ಬಟನ್ ಒತ್ತಿಲೆ.'
      },
      {
        targetId: 'tour-pass',
        tab: 'pass',
        icon: FileText,
        badge: 'ಹಂತ 7 / 7 &bull; ಆಫ್‌ಲೈನ್ ಪಾಸ್',
        title: '0-ನೆಟ್‌ವರ್ಕ್ ಆಫ್‌ಲೈನ್ ಬೋಟ್ ಪಾಸ್',
        desc: 'ಕಡಲ್ ಗ್ ಪೋಪಿನ ದುಂಬು GPS ಪಾಯಿಂಟ್ಸ್ ಬೊಕ್ಕ ಕೋಸ್ಟ್ ಗಾರ್ಡ್ ನಂಬರ್ (1554) ಉಪ್ಪುನ ಅಧಿಕೃತ A4 ಪಾಸ್ ಪ್ರಿಂಟ್ ಮಲ್ತೊನ್ಲೆ.',
        actionHint: 'ಆಳ ಕಡಲ್ಡ್ ಇಂಟರ್ನೆಟ್ ದಾಂತೆ ಕೆಲಸ ಮಲ್ಪುಂಡು!'
      }
    ],
    ta: [
      {
        targetId: 'tour-brand',
        tab: 'map',
        icon: Sparkles,
        badge: 'படி 1 / 7 &bull; அறிமுகம்',
        title: 'ப்ராஜெக்ட் ஓர்கா (ORCA) விற்கு நல்வரவு 🇮🇳',
        desc: 'ISRO செயற்கைக்கோள் தரவு (SST மற்றும் குளோரோபில்) மூலம் மீனவர்களுக்கு அதிக மீன் கிடைக்கும் பகுதிகள், டீசல் சேமிப்பு மற்றும் கடல் பாதுகாப்பு வழங்கும் AI தளம்.',
        actionHint: '1 நிமிட விரைவு வழிகாட்டல்!'
      },
      {
        targetId: 'tour-harbor-lang',
        tab: 'map',
        icon: Anchor,
        badge: 'படி 2 / 7 &bull; துறைமுகம் & மொழி',
        title: 'துறைமுகம் மற்றும் தமிழ் மொழியைத் தேர்ந்தெடுக்கவும்',
        desc: 'சென்னை, ராமேஸ்வரம் போன்ற உங்கள் துறைமுகத்தைத் தேர்வு செய்து, தமிழ் மொழியைத் தேர்ந்தெடுக்கவும். AI பதில்கள் மற்றும் குரல் உடனடியாக மாறும்.',
        actionHint: '7 மொழிகளில் கிடைக்கிறது.'
      },
      {
        targetId: 'tour-vessel',
        tab: 'map',
        icon: Ship,
        badge: 'படி 3 / 7 &bull; படகு அமைப்பு',
        title: 'படகு வகையை அமைக்கவும்',
        desc: 'விசைப்படகு, ஃபைபர் படகு அல்லது நாட்டுப்படகைத் தேர்ந்தெடுக்கவும். இதன் மூலம் டீசல் நுகர்வு துல்லியமாக கணக்கிடப்படுகிறது.',
        actionHint: 'படகு வேகம் மற்றும் பாதுகாப்பு வரம்பு.'
      },
      {
        targetId: 'tour-telemetry',
        tab: 'map',
        icon: Fuel,
        badge: 'படி 4 / 7 &bull; நேரடி விவரங்கள்',
        title: 'டீசல் சேமிப்பு & எல்லை பாதுகாப்பு',
        desc: 'சேமிக்கப்படும் ரூபாய் (₹), பயண நேரம் மற்றும் சர்வதேச கடல் எல்லை (IMBL) தூரத்தை நேரடியாகப் பார்க்கலாம்.',
        actionHint: 'வண்ணமயமான கார்டுகள்.'
      },
      {
        targetId: 'tour-map',
        tab: 'map',
        icon: Compass,
        badge: 'படி 5 / 7 &bull; வரைபடம் & திசைகாட்டி',
        title: 'ISRO வரைபடம் & நேரடி திசைகாட்டி வழிகாட்டல்',
        desc: 'வரைபடத்தில் 🐟 மீன் குறியீட்டைத் தட்டவும். "Plot & Steer Route" அழுத்தி நேரடி திசைகாட்டி கோணம் (எ.கா. 288° WNW) மற்றும் தமிழ் குரல் வழிகாட்டலைப் பெறவும்!',
        actionHint: 'பச்சை கோடு = AI நீரோட்ட வழித்தடம்.'
      },
      {
        targetId: 'tour-chat',
        tab: 'chat',
        icon: MessageSquare,
        badge: 'படி 6 / 7 &bull; AI உதவி',
        title: 'ORCA AI உரையாடல் உதவி (குரல் & தமிழ்)',
        desc: 'தமிழில் தட்டச்சு செய்யவும் அல்லது பேசவும். வானிலை, மீன் நடமாட்டம் மற்றும் எல்லை பாதுகாப்பு குறித்து 4 AI ஏஜெண்டுகள் பதிலளிக்கும்.',
        actionHint: 'குரல் கேட்க 🔊 பட்டனை அழுத்தவும்.'
      },
      {
        targetId: 'tour-pass',
        tab: 'pass',
        icon: FileText,
        badge: 'படி 7 / 7 &bull; ஆஃப்லைன் பாஸ்',
        title: '0-இணைய ஆஃப்லைன் பயண பாஸ்',
        desc: 'கடலுக்குச் செல்லும் முன் GPS வழிகள் மற்றும் கடலோர காவல்படை அவசர எண் (1554) கொண்ட அதிகாரப்பூர்வ A4 பாஸை அச்சிடவும்.',
        actionHint: 'ஆழ்கடலில் 100% இணையம் இல்லாமல் செயல்படும்!'
      }
    ],
    ml: [
      {
        targetId: 'tour-brand',
        tab: 'map',
        icon: Sparkles,
        badge: 'ഘട്ടം 1 / 7 &bull; ആമുഖം',
        title: 'പ്രൊജക്റ്റ് ഓർക്ക (ORCA) യിലേക്ക് സ്വാഗതം 🇮🇳',
        desc: 'ഐഎസ്ആർഒ ഉപഗ്രഹ വിവരങ്ങൾ അടിസ്ഥാനമാക്കി മത്സ്യത്തൊഴിലാളികൾക്ക് ഉയർന്ന മത്സ്യ ലഭ്യതയും ഡീസൽ ലാഭവും സുരക്ഷയും നൽകുന്ന എഐ പ്ലാറ്റ്‌ഫോം.',
        actionHint: '1 മിനിറ്റ് ഗൈഡ് കാണുക!'
      },
      {
        targetId: 'tour-harbor-lang',
        tab: 'map',
        icon: Anchor,
        badge: 'ഘട്ടം 2 / 7 &bull; ഹാർബർ & ഭാഷ',
        title: 'ഹാർബറും മലയാളം ഭാഷയും തിരഞ്ഞെടുക്കുക',
        desc: 'കൊച്ചി, വിഴിഞ്ഞം തുടങ്ങിയ ഹാർബറുകളും മലയാളം ഭാഷയും തിരഞ്ഞെടുക്കുക. എഐ തത്സമയം മലയാളത്തിൽ പ്രതികരിക്കും.',
        actionHint: '7 പ്രാദേശിക ഭാഷകളിൽ ലഭ്യമാണ്.'
      },
      {
        targetId: 'tour-vessel',
        tab: 'map',
        icon: Ship,
        badge: 'ഘട്ടം 3 / 7 &bull; ബോട്ട് സെറ്റപ്പ്',
        title: 'ബോട്ട് വിവരങ്ങൾ സജ്ജമാക്കുക',
        desc: 'ട്രോളർ, ഫൈബർ ബോട്ട് അല്ലെങ്കിൽ പരമ്പരാഗത ബോട്ട് തിരഞ്ഞെടുക്കുക. ഇതിലൂടെ ഡീസൽ കണക്കുകൂട്ടൽ കൃത്യമാകും.',
        actionHint: 'ബോട്ട് സ്പീഡും സുരക്ഷിത പരിധിയും.'
      },
      {
        targetId: 'tour-telemetry',
        tab: 'map',
        icon: Fuel,
        badge: 'ഘട്ടം 4 / 7 &bull; തത്സമയ വിവരങ്ങൾ',
        title: 'ഡീസൽ ലാഭവും അതിർത്തി വിവരങ്ങളും',
        desc: 'ലാഭിച്ച രൂപ (₹), യാത്രാ സമയം, അന്താരാഷ്ട്ര അതിർത്തിയിലേക്കുള്ള (IMBL) സുരക്ഷിത ദൂരം എന്നിവ തത്സമയം കാണാം.',
        actionHint: 'കളർ-കോഡഡ് കാർഡുകൾ.'
      },
      {
        targetId: 'tour-map',
        tab: 'map',
        icon: Compass,
        badge: 'ഘട്ടം 5 / 7 &bull; മാപ്പും കോമ്പസും',
        title: 'ISRO മാപ്പും ലൈവ് കോമ്പസ് ഗൈഡൻസും',
        desc: 'മാപ്പിലെ 🐟 മത്സ്യ ഐക്കണിൽ ക്ലിക്ക് ചെയ്യുക. "Plot & Steer Route" ക്ലിക്ക് ചെയ്ത് കോമ്പസ് ദിശയും (288° WNW) മലയാളം ശബ്ദ നിർദ്ദേശങ്ങളും നേടുക!',
        actionHint: 'പച്ച വര = എഐ ഒഴുക്ക് റൂട്ട്.'
      },
      {
        targetId: 'tour-chat',
        tab: 'chat',
        icon: MessageSquare,
        badge: 'ഘട്ടം 6 / 7 &bull; എഐ കോ-പൈലറ്റ്',
        title: 'ORCA എഐ കോ-പൈലറ്റ് (ശബ്ദവും ചാറ്റും)',
        desc: 'മലയാളത്തിൽ സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യുക. കാലാവസ്ഥയും മത്സ്യ വിവരങ്ങളും എഐ വിശദീകരിക്കും.',
        actionHint: 'ശബ്ദം കേൾക്കാൻ 🔊 ബട്ടൺ അമർത്തുക.'
      },
      {
        targetId: 'tour-pass',
        tab: 'pass',
        icon: FileText,
        badge: 'ഘട്ടം 7 / 7 &bull; ഓഫ്‌ലൈൻ പാസ്',
        title: '0-നെറ്റ്‌വർക്ക് ഓഫ്‌ലൈൻ യാത്രാ പാസ്',
        desc: 'ആഴക്കടലിലേക്ക് പോകുന്നതിന് മുൻപ് GPS പോയിന്റുകളും കോസ്റ്റ് ഗാർഡ് നമ്പറും (1554) അടങ്ങിയ ഔദ്യോഗിക പാസ് പ്രിന്റ് ചെയ്യുക.',
        actionHint: 'ആഴക്കടലിൽ ഇന്റർനെറ്റ് ഇല്ലാതെ പ്രവർത്തിക്കും!'
      }
    ],
    hi: [
      {
        targetId: 'tour-brand',
        tab: 'map',
        icon: Sparkles,
        badge: 'चरण 1 / 7 &bull; परिचय',
        title: 'प्रोजेक्ट ओर्का (ORCA) में आपका स्वागत है 🇮🇳',
        desc: 'यह ISRO उपग्रह डेटा (SST और क्लोरोफिल) द्वारा संचालित AI प्लेटफॉर्म है जो मछुआरों को मछली के सबसे समृद्ध क्षेत्र, डीजल बचत और सीमा सुरक्षा प्रदान करता है।',
        actionHint: 'त्वरित 1 मिनट का टूर देखें!'
      },
      {
        targetId: 'tour-harbor-lang',
        tab: 'map',
        icon: Anchor,
        badge: 'चरण 2 / 7 &bull; बंदरगाह और भाषा',
        title: 'तटीय बंदरगाह और भाषा चुनें',
        desc: 'वेरावल, पोरबंदर, चेन्नई आदि बंदरगाह और अपनी भाषा (हिन्दी, गुजराती, आदि) चुनें। AI तुरंत चयनित भाषा में उत्तर देगा।',
        actionHint: '7 भारतीय भाषाओं में उपलब्ध।'
      },
      {
        targetId: 'tour-vessel',
        tab: 'map',
        icon: Ship,
        badge: 'चरण 3 / 7 &bull; नाव सेटअप',
        title: 'अपनी नाव का प्रकार चुनें',
        desc: 'मैकेनाइज्ड ट्रॉलर, फाइबर बोट या पारंपरिक नाव चुनें ताकि डीजल बचत और सीमा सुरक्षा की सटीक गणना हो सके।',
        actionHint: 'नाव की गति और सुरक्षित दूरी।'
      },
      {
        targetId: 'tour-telemetry',
        tab: 'map',
        icon: Fuel,
        badge: 'चरण 4 / 7 &bull; लाइव आंकड़े',
        title: 'डीजल बचत और समुद्री सीमा',
        desc: 'बचाए गए रुपये (₹), यात्रा समय और अंतरराष्ट्रीय समुद्री सीमा (IMBL) से सुरक्षित दूरी को तुरंत देखें।',
        actionHint: 'स्पष्ट रंगीन कार्ड।'
      },
      {
        targetId: 'tour-map',
        tab: 'map',
        icon: Compass,
        badge: 'चरण 5 / 7 &bull; नक्शा और कम्पास',
        title: 'ISRO नक्शा और लाइव कम्पास स्टीयरिंग',
        desc: 'नक्शे पर किसी भी 🐟 मछली पॉइंट पर क्लिक करें। "Plot & Steer Route" दबाकर लाइव कम्पास कोण (जैसे 288° WNW) और हिन्दी वॉयस गाइडेंस प्राप्त करें!',
        actionHint: 'हरी रेखा = AI करंट-असिस्टेड मार्ग।'
      },
      {
        targetId: 'tour-chat',
        tab: 'chat',
        icon: MessageSquare,
        badge: 'चरण 6 / 7 &bull; AI को-पायलट',
        title: 'ORCA AI को-पायलट (वॉयस और चैट)',
        desc: 'हिन्दी में बोलें या टाइप करें। मौसम, मछली की स्थिति और सीमा सुरक्षा के लिए 4 AI एजेंट्स मिलकर सलाह देते हैं।',
        actionHint: 'वॉयस सुनने के लिए 🔊 बटन दबाएं।'
      },
      {
        targetId: 'tour-pass',
        tab: 'pass',
        icon: FileText,
        badge: 'चरण 7 / 7 &bull; ऑफलाइन पास',
        title: '0-इंटरनेट डीप-सी यात्रा पास',
        desc: 'गहरे समुद्र में जाने से पहले GPS पॉइंट्स और कोस्ट गार्ड इमरजेंसी नंबर (1554) वाला आधिकारिक A4 पास प्रिंट या सेव करें।',
        actionHint: 'समुद्र में बिना इंटरनेट के 100% काम करता है!'
      }
    ]
  };

  const steps = tourContent[selectedLang] || tourContent.en;
  const currentStepData = steps[currentStep] || steps[0];
  const IconComponent = currentStepData.icon || Sparkles;

  // Track target element position
  useEffect(() => {
    if (!isOpen) return;

    // Switch mobile tab if necessary
    if (onNavigateTab && currentStepData.tab) {
      onNavigateTab(currentStepData.tab);
    }

    const updateRect = () => {
      const el = document.getElementById(currentStepData.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    };

    const timer = setTimeout(updateRect, 200);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isOpen, currentStep, currentStepData.targetId, currentStepData.tab, onNavigateTab]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-auto flex items-center justify-center p-3 sm:p-4 transition-all duration-300">
      
      {/* Dark Backdrop Spotlight with Blur */}
      <div 
        onClick={handleFinish}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Glowing Cutout Highlight Ring over Target Element */}
      {targetRect && (
        <div
          className="fixed pointer-events-none transition-all duration-300 rounded-3xl z-[10001]"
          style={{
            top: `${Math.max(10, targetRect.top - 8)}px`,
            left: `${Math.max(10, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            boxShadow: '0 0 0 9999px rgba(2, 8, 20, 0.85), 0 0 35px rgba(0, 245, 160, 0.7), inset 0 0 20px rgba(0, 245, 160, 0.4)',
            border: '2px solid #00f5a0'
          }}
        />
      )}

      {/* Interactive Tour Floating Card */}
      <div 
        ref={cardRef}
        className="relative z-[10002] w-full max-w-lg bg-[#020b17]/98 border-2 border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,1)] text-white space-y-4 animate-fadeIn ring-2 ring-emerald-400/40"
      >
        
        {/* Step Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/15 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(0,245,160,0.5)] shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-black text-emerald-400 uppercase tracking-wider block" dangerouslySetInnerHTML={{ __html: currentStepData.badge }} />
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide mt-0.5">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition shrink-0"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour Description Body */}
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
            {currentStepData.desc}
          </p>

          <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-[11px] text-emerald-300 font-mono font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{currentStepData.actionHint}</span>
          </div>
        </div>

        {/* Progress Bar & Navigation Controls */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
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

          {/* Action Buttons */}
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
              <span>{currentStep === steps.length - 1 ? 'Finish & Sail 🎉' : 'Next Step'}</span>
              {currentStep === steps.length - 1 ? <Check className="w-4 h-4 stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
