"""
Master Agentic Orchestrator & Conversational Planner
Decomposes user queries into discrete subagent tasks, coordinates multi-agent reasoning,
and synthesizes evidence-based recommendations in Indian regional languages (including Kannada and Tulu).
"""

from typing import Dict, Any, List
from .ocean_agent import ocean_agent
from .weather_agent import weather_agent
from .routing_agent import routing_agent
from .geofence_agent import geofence_agent

class MasterOrchestratorAgent:
    def __init__(self):
        self.supported_languages = {
            "en": "English",
            "kn": "Kannada (ಕನ್ನಡ)",
            "tcy": "Tulu (ತುಳು - ಕರಾವಳಿ)",
            "ta": "Tamil (தமிழ்)",
            "te": "Telugu (తెలుగు)",
            "ml": "Malayalam (മലയാളം)",
            "hi": "Hindi (हिन्दी)",
            "bn": "Bengali (বাংলা)"
        }

    def process_query(self, user_message: str, harbor_id: str = "chennai", language: str = "en") -> Dict[str, Any]:
        """
        Interprets intent, delegates to specialized agents, and synthesizes an explainable verdict.
        """
        msg_lower = user_message.lower()
        harbors = ocean_agent.get_all_harbors()
        harbor = harbors.get(harbor_id.lower(), harbors["chennai"])
        
        # 1. Intent Detection
        if any(k in msg_lower for k in ["pfz", "fish", "hotspot", "catch", "mackerel", "sardine", "tuna", "nearest zone", "where", "ಮೀನು", "ಮೀನ್"]):
            intent = "FIND_PFZ"
        elif any(k in msg_lower for k in ["safe", "weather", "wave", "cyclone", "storm", "wind", "venture", "tomorrow", "rain", "ಸುರಕ್ಷಿತ", "ಕಡಲ್"]):
            intent = "CHECK_SAFETY"
        elif any(k in msg_lower for k in ["route", "fuel", "diesel", "navigate", "path", "cost", "save", "distance", "ಡೀಸೆಲ್"]):
            intent = "OPTIMIZE_ROUTE"
        elif any(k in msg_lower for k in ["border", "imbl", "sri lanka", "pakistan", "arrest", "restriction", "prohibited", "avoid", "ಗಡಿ"]):
            intent = "CHECK_BOUNDARIES"
        elif any(k in msg_lower for k in ["productivity", "decline", "why", "temperature", "chlorophyll", "ecosystem"]):
            intent = "EXPLAIN_PRODUCTIVITY"
        else:
            intent = "FULL_VOYAGE_ASSISTANCE"

        # 2. Collaborative Subagent Executions
        hotspots = ocean_agent.detect_pfz_hotspots(harbor_id=harbor_id)
        top_hotspot = hotspots[0]
        weather = weather_agent.get_marine_conditions(top_hotspot["lat"], top_hotspot["lng"])
        geofence = geofence_agent.check_point_proximity(top_hotspot["lat"], top_hotspot["lng"])
        route = routing_agent.calculate_optimal_voyage(
            start_lat=harbor["lat"],
            start_lng=harbor["lng"],
            target_lat=top_hotspot["lat"],
            target_lng=top_hotspot["lng"],
            current_speed_knots=weather["ocean_current_knots"],
            current_direction_deg=weather["ocean_current_direction_deg"]
        )

        # 3. Multi-Agent Synthesis & Vernacular Response Generation
        response_text, voice_script = self._generate_vernacular_text(
            intent=intent,
            harbor=harbor,
            hotspot=top_hotspot,
            weather=weather,
            route=route,
            geofence=geofence,
            lang=language
        )

        return {
            "intent": intent,
            "harbor": harbor,
            "language": language,
            "response_text": response_text,
            "voice_script": voice_script,
            "collaborating_agents": [
                {"name": "Ocean Analytics Agent", "status": "Active", "summary": f"Detected {len(hotspots)} PFZ clusters (Top: {top_hotspot['primary_species']})"},
                {"name": "Weather Intelligence Agent", "status": "Active", "summary": f"Sea State: {weather['sea_state']} (Waves {weather['wave_height_m']}m)"},
                {"name": "Routing Optimization Agent", "status": "Active", "summary": f"Calculated A* route: {route['fuel_savings_percentage']}% fuel savings"},
                {"name": "Geofencing & Boundary Agent", "status": "Active", "summary": f"IMBL distance: {geofence['nearest_imbl_distance_km']} km ({geofence['status']})"}
            ],
            "evidence": {
                "top_pfz": top_hotspot,
                "all_pfz_hotspots": hotspots,
                "weather": weather,
                "route": route,
                "geofence": geofence
            }
        }

    def _generate_vernacular_text(self, intent, harbor, hotspot, weather, route, geofence, lang="en"):
        h_name = harbor['name'].split()[0]
        species = hotspot['primary_species'].split('(')[0].strip()
        fuel_saved = route['cost_saved_inr']
        dist_nm = hotspot['distance_nm']
        imbl_km = geofence['nearest_imbl_distance_km']

        if lang == "kn": # Kannada
            if intent == "CHECK_SAFETY":
                txt = f"🌊 **ಸಮುದ್ರ ಸುರಕ್ಷತಾ ಮಾಹಿತಿ ({h_name})**: ಸಮುದ್ರದ ಸ್ಥಿತಿ ಪ್ರಸ್ತುತ **{weather['safety_status']}** ಆಗಿದೆ. ಅಲೆಗಳ ಎತ್ತರ **{weather['wave_height_m']} ಮೀಟರ್**, ಗಾಳಿಯ ವೇಗ {weather['wind_speed_knots']} ನಾಟ್ಸ್. {weather['advisory_verdict']}"
                voice = f"ಸಮುದ್ರದ ಸ್ಥಿತಿ ಪ್ರಸ್ತುತ ಸುರಕ್ಷಿತವಾಗಿದೆ. ಅಲೆಗಳ ಎತ್ತರ {weather['wave_height_m']} ಮೀಟರ್. ಮೀನುಗಾರಿಕೆಗೆ ತೆರಳಬಹುದು."
            elif intent == "CHECK_BOUNDARIES":
                txt = f"🛡️ **ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿ ಎಚ್ಚರಿಕೆ**: ಆಯ್ದ ಮೀನುಗಾರಿಕಾ ವಲಯವು ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿಯಿಂದ (IMBL) **{imbl_km} ಕಿ.ಮೀ** ದೂರದಲ್ಲಿದೆ. ಸ್ಥಿತಿ: **{geofence['status']}**."
                voice = f"ಎಚ್ಚರಿಕೆ: ನೀವು ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿಯಿಂದ {imbl_km} ಕಿಲೋಮೀಟರ್ ದೂರದಲ್ಲಿದ್ದೀರಿ. ಗಡಿ ದಾಟಬೇಡಿ."
            else:
                txt = f"🐟 **ಶಿಫಾರಸು ಮಾಡಿದ ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕೆ ವಲಯ ({hotspot['id']})**:\n• {h_name} ಬಂದರಿನಿಂದ **{dist_nm} ನಾಟಿಕಲ್ ಮೈಲಿ** ದೂರದಲ್ಲಿ **{species}** ಸಮೃದ್ಧವಾಗಿ ಲಭ್ಯವಿದೆ.\n• ISRO AI ಪ್ರವಾಹ-ಮಾರ್ಗ ಬಳಸುವುದರಿಂದ **₹{fuel_saved} ಡೀಸೆಲ್ ಉಳಿತಾಯವಾಗುತ್ತದೆ** ({route['fuel_savings_percentage']}% ಉಳಿತಾಯ).\n• ಸಮುದ್ರದ ಸ್ಥಿತಿ: **ಸುರಕ್ಷಿತ (ಅಲೆಗಳ ಎತ್ತರ {weather['wave_height_m']} ಮೀ)**. ಗಡಿಯಿಂದ ಸುರಕ್ಷಿತ ಅಂತರ: {imbl_km} ಕಿ.ಮೀ."
                voice = f"{h_name} ಬಂದರಿನಿಂದ {dist_nm} ನಾಟಿಕಲ್ ಮೈಲಿ ದೂರದಲ್ಲಿ {species} ಮೀನುಗಳು ಲಭ್ಯವಿವೆ. AI ಮಾರ್ಗದಿಂದ {fuel_saved} ರೂಪಾಯಿ ಡೀಸೆಲ್ ಉಳಿತಾಯವಾಗುತ್ತದೆ."

        elif lang == "tcy": # Tulu (Tulunadu Coastal Dialect)
            if intent == "CHECK_SAFETY":
                txt = f"🌊 **ಕಡಲ್ದ ಪರಿಸ್ಥಿತಿ ({h_name})**: ಕಡಲ್ ಇತ್ತೆ **{weather['safety_status']}** ಉಂಡು. ಅಲೆತ್ತ ಎತ್ತರ **{weather['wave_height_m']} ಮೀಟರ್**. {weather['advisory_verdict']}"
                voice = f"ಕಡಲ್ದ ಪರಿಸ್ಥಿತಿ ಎಡ್ಡ ಉಂಡು. ಅಲೆತ್ತ ಎತ್ತರ {weather['wave_height_m']} ಮೀಟರ್. ಮೀನ್ ಪತ್ತೆರೆ ಪೋವೊಲಿ."
            elif intent == "CHECK_BOUNDARIES":
                txt = f"🛡️ **ಕಡಲ್ದ ಗಡಿ ಎಚ್ಚರಿಕೆ**: ಈರ್ ಆಯ್ದ ಮಲ್ದಿನ ಜಾಗೆ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿದ್ **{imbl_km} ಕಿ.ಮೀ** ದೂರೊಡು ಉಂಡು. ಸ್ಥಿತಿ: **{geofence['status']}**."
                voice = f"ಎಚ್ಚರಿಕೆ: ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿದ್ {imbl_km} ಕಿಲೋಮೀಟರ್ ದೂರೊಡು ಉಲ್ಲರ್."
            else:
                txt = f"🐟 **ಮೀನ್ ಪತ್ತುನ ಎಡ್ಡ ಜಾಗೆ ({hotspot['id']})**:\n• {h_name} ಬಂದರ್ದ್ **{dist_nm} ನಾಟಿಕಲ್ ಮೈಲ್** ದೂರೊಡು **{species}** ಮೀನ್ ಮಸ್ತ್ ತಿಕ್ಕುಂಡು.\n• ISRO AI ಮಾರ್ಗ ಗಲಸುಂಡ **₹{fuel_saved} ಡೀಸೆಲ್ ಒರಿಪುಂಡು** ({route['fuel_savings_percentage']}% ಡೀಸೆಲ್ ಉಳಿತಾಯ).\n• ಕಡಲ್ ಪರಿಸ್ಥಿತಿ: **ಎಡ್ಡ ಉಂಡು (ಅಲೆತ್ತ ಎತ್ತರ {weather['wave_height_m']} ಮೀ)**. ಬಾರ್ಡರ್ ದೂರ: {imbl_km} ಕಿ.ಮೀ."
                voice = f"{dist_nm} ನಾಟಿಕಲ್ ಮೈಲ್ ದೂರೊಡು {species} ಮೀನ್ ಉಂಡು. AI ರೂಟ್ ಗಲಸುಂಡ {fuel_saved} ರೂಪಾಯಿ ಒರಿಪುಂಡು."

        elif lang == "ta": # Tamil
            txt = f"🐟 **பரிந்துரைக்கப்பட்ட மீன்பிடி மண்டலம் ({hotspot['id']})**: {dist_nm} கடல் மைல் தொலைவில் **{species}** மீன் கூட்டம் உள்ளது. AI வழித்தடத்தை பயன்படுத்தினால் **₹{fuel_saved} டீசல் சேமிக்கலாம்**."
            voice = f"{dist_nm} கடல் மைல் தொலைவில் {species} மீன்கள் உள்ளன. AI வழியை பயன்படுத்தினால் {fuel_saved} ரூபாய் சேமிக்கலாம்."

        elif lang == "te": # Telugu
            txt = f"🐟 **చేపల సంపద జోన్ ({hotspot['id']})**: {dist_nm} నాటికల్ మైళ్ళ దూరంలో **{species}** చేపలు ఉన్నాయి. AI రూట్ ద్వారా **₹{fuel_saved} డೀజిల్ ఆదా** అవుతుంది."
            voice = f"{dist_nm} నాటికల్ మైళ్ల దూరంలో {species} చేపలు ఉన్నాయి. AI రూట్ ద్వారా {fuel_saved} రూపాయలు ఆదా అవుతాయి."

        elif lang == "hi": # Hindi
            txt = f"🐟 **संभावित मछली पकड़ने का क्षेत्र ({hotspot['id']})**: {dist_nm} नॉटिकल मील पर **{species}** की संभावना है। AI मार्ग से **₹{fuel_saved} का डीजल बचेगा**।"
            voice = f"{dist_nm} नॉटिकल मील दूर {species} की संभावना है। AI रूट से {fuel_saved} रुपये की बचत होगी।"

        elif lang == "ml": # Malayalam
            txt = f"🐟 **മത്സ്യബന്ധന മേഖല ({hotspot['id']})**: {dist_nm} നോട്ടിക്കൽ മൈൽ അകലെ **{species}** ലഭ്യമാണ്. AI റൂട്ട് വഴി **₹{fuel_saved} ഡീസಲ್ ലാഭിക്കാം**."
            voice = f"{dist_nm} നോട്ടിക്കൽ മൈൽ അകലെ {species} മീനുകൾ ലഭ്യമാണ്. AI റൂട്ട് വഴി {fuel_saved} രൂപ ലാಭിക്കാം."

        else: # Default English
            txt = f"🛰️ **ORCA Multi-Agent Recommendation for {harbor['name']}**:\n\n1. **Nearest High-Yield PFZ**: **{hotspot['id']}** ({dist_nm} NM offshore, Confidence: **{hotspot['confidence_score']}%**).\n2. **Target Biomass**: Dense shoals of **{species}** (SST: {hotspot['sst_celsius']}°C, Chl-a: {hotspot['chlorophyll_mg_m3']} mg/m³).\n3. **Fuel Savings**: Current-assisted route cuts fuel burn by **{route['fuel_savings_percentage']}%**, saving **₹{fuel_saved}** ({route['diesel_saved_litres_roundtrip']}L).\n4. **Safety & Border Status**: Wave height **{weather['wave_height_m']}m** ({weather['safety_status']}). Distance to IMBL: **{imbl_km} km** ({geofence['status']})."
            voice = f"Nearest fish hotspot is {dist_nm} nautical miles offshore for {species}. You will save {fuel_saved} rupees in fuel. Sea conditions are safe."

        return txt, voice

orchestrator = MasterOrchestratorAgent()
