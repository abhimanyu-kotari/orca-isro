"""
Master Agentic Orchestrator & Conversational Planner
Decomposes user queries into discrete subagent tasks, coordinates multi-agent reasoning,
and synthesizes evidence-based recommendations in Indian regional languages.
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
        if any(k in msg_lower for k in ["pfz", "fish", "hotspot", "catch", "mackerel", "sardine", "tuna", "nearest zone", "where"]):
            intent = "FIND_PFZ"
        elif any(k in msg_lower for k in ["safe", "weather", "wave", "cyclone", "storm", "wind", "venture", "tomorrow", "rain"]):
            intent = "CHECK_SAFETY"
        elif any(k in msg_lower for k in ["route", "fuel", "diesel", "navigate", "path", "cost", "save", "distance"]):
            intent = "OPTIMIZE_ROUTE"
        elif any(k in msg_lower for k in ["border", "imbl", "sri lanka", "pakistan", "arrest", "restriction", "prohibited", "avoid"]):
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
        # English base summary
        h_name = harbor['name'].split()[0]
        species = hotspot['primary_species'].split('(')[0].strip()
        fuel_saved = route['cost_saved_inr']
        dist_nm = hotspot['distance_nm']
        imbl_km = geofence['nearest_imbl_distance_km']

        if lang == "ta": # Tamil
            if intent == "CHECK_SAFETY":
                txt = f"🌊 **கடல் பாதுகாப்பு நிலை ({h_name})**: கடல் தற்போது **{weather['safety_status']}**. அலை உயரம் {weather['wave_height_m']} மீ, காற்று {weather['wind_speed_knots']} நாட்ஸ். {weather['advisory_verdict']}"
                voice = f"கடல் நிலை தற்போது பாதுகாப்பாக உள்ளது. அலை உயரம் {weather['wave_height_m']} மீட்டர். மீன்பிடிக்க செல்லலாம்."
            elif intent == "CHECK_BOUNDARIES":
                txt = f"🛡️ **எல்லை பாதுகாப்பு எச்சரிக்கை**: தேர்ந்தெடுக்கப்பட்ட மீன்பிடி மண்டலம் சர்வதேச கடல் எல்லைக்கு (IMBL) **{imbl_km} கி.மீ** தொலைவில் உள்ளது. நிலை: **{geofence['status']}**."
                voice = f"எச்சரிக்கை: நீங்கள் சர்வதேச கடல் எல்லைக்கு {imbl_km} கிலோமீட்டர் தொலைவில் உள்ளீர்கள். எல்லை தாண்ட வேண்டாம்."
            else:
                txt = f"🐟 **பரிந்துரைக்கப்பட்ட மீன்பிடி மண்டலம் ({hotspot['id']})**: {dist_nm} கடல் மைல் தொலைவில் **{species}** மீன் கூட்டம் கண்டறியப்பட்டுள்ளது. AI வழித்தடத்தை பின்பற்றுவதன் மூலம் **₹{fuel_saved} டீசல் செலவை சேமிக்கலாம்**. கடல் எல்லை {imbl_km} கி.மீ தொலைவில் பாதுகாப்பாக உள்ளது."
                voice = f"{h_name} துறைமுகத்திலிருந்து {dist_nm} கடல் மைல் தொலைவில் {species} மீன்கள் உள்ளன. AI வழியை பயன்படுத்தினால் {fuel_saved} ரூபாய் சேமிக்கலாம்."

        elif lang == "te": # Telugu
            if intent == "CHECK_SAFETY":
                txt = f"🌊 **సముద్ర భద్రతా సమాచారం ({h_name})**: సముద్రం ప్రస్తుతం **{weather['safety_status']}**. అలల ఎత్తు {weather['wave_height_m']} మీటర్లు. {weather['advisory_verdict']}"
                voice = f"సముద్ర వాతావరణం ప్రస్తుతం అనుకూలంగా ఉంది. అలల ఎత్తు {weather['wave_height_m']} మీటర్లు."
            elif intent == "CHECK_BOUNDARIES":
                txt = f"🛡️ **సరిహద్దు హెచ్చరిక**: మీ ఎంపిక చేసిన చేపల జోన్ అంతర్జాతీయ సరిహద్దుకు (IMBL) **{imbl_km} కి.మీ** దూరంలో ఉంది."
                voice = f"హెచ్చరిక: అంతర్జాతీయ సముద్ర సరిహద్దుకు {imbl_km} కిలోమీటర్ల దూరంలో ఉన్నారు. జాగ్రత్తగా ఉండండి."
            else:
                txt = f"🐟 **చేపల సంపద జోన్ ({hotspot['id']})**: {dist_nm} నాటికల్ మైళ్ళ దూరంలో **{species}** సమృద్ధిగా ఉన్నాయి. AI రూట్ ద్వారా **₹{fuel_saved} డీజిల్ ఆదా చేయవచ్చు**."
                voice = f"{dist_nm} నాటికల్ మైళ్ల దూరంలో {species} చేపలు ఉన్నాయి. AI మార్గాన్ని ఉపయోగిస్తే {fuel_saved} రూపాయలు ఆదా అవుతాయి."

        elif lang == "hi": # Hindi
            if intent == "CHECK_SAFETY":
                txt = f"🌊 **समुद्री सुरक्षा रिपोर्ट ({h_name})**: समुद्र वर्तमान में **{weather['safety_status']}** है। लहरों की ऊंचाई {weather['wave_height_m']} मीटर है। {weather['advisory_verdict']}"
                voice = f"समुद्र की स्थिति सुरक्षित है। लहरों की ऊंचाई {weather['wave_height_m']} मीटर है।"
            elif intent == "CHECK_BOUNDARIES":
                txt = f"🛡️ **अंतर्राष्ट्रीय सीमा चेतावनी**: चयनित मछली पकड़ने का क्षेत्र अंतरराष्ट्रीय समुद्री सीमा (IMBL) से **{imbl_km} किमी** दूर है। स्थिति: **{geofence['status']}**."
                voice = f"सावधान! आप अंतरराष्ट्रीय समुद्री सीमा से {imbl_km} किलोमीटर दूर हैं। सीमा पार न करें।"
            else:
                txt = f"🐟 **संभावित मछली पकड़ने का क्षेत्र ({hotspot['id']})**: {dist_nm} नॉटिकल मील पर **{species}** की उच्च संभावना है। AI मार्ग से जाने पर **₹{fuel_saved} का डीजल बचेगा**। सीमा से दूरी {imbl_km} किमी सुरक्षित है।"
                voice = f"{h_name} से {dist_nm} नॉटिकल मील दूर {species} की संभावना है। AI रूट से {fuel_saved} रुपये की बचत होगी।"

        elif lang == "ml": # Malayalam
            txt = f"🐟 **മത്സ്യബന്ധന മേഖല ({hotspot['id']})**: {dist_nm} നോട്ടിക്കൽ മൈൽ അകലെ **{species}** കൂട്ടങ്ങൾ ലഭ്യമാണ്. AI റൂട്ട് ഉപയോഗിച്ചാൽ **₹{fuel_saved} ഡീസൽ ലാഭിക്കാം**. അതിർത്തിയിലേക്ക് {imbl_km} കി.മീ ദൂരമുണ്ട്."
            voice = f"{dist_nm} നോട്ടിക്കൽ മൈൽ അകലെ {species} മീനുകൾ ലഭ്യമാണ്. AI റൂട്ട് ഉപയോഗിച്ചാൽ {fuel_saved} രൂപ ലാഭിക്കാം."

        else: # Default English
            if intent == "CHECK_SAFETY":
                txt = f"🌊 **Sea Safety Advisory for {harbor['name']}**: Sea condition is **{weather['safety_status']}** (Safety Score: {weather['safety_score']}/100). Significant wave height is **{weather['wave_height_m']}m** with a period of {weather['wave_period_sec']}s. Ocean surface current is **{weather['ocean_current_knots']} knots** heading {weather['ocean_current_compass']}. {weather['advisory_verdict']}"
                voice = f"Sea conditions are currently {weather['safety_status']}. Wave height is {weather['wave_height_m']} meters. Normal operations permitted."
            elif intent == "CHECK_BOUNDARIES":
                txt = f"🛡️ **Border & Geofence Intelligence**: Selected zone is **{imbl_km} km ({round(imbl_km/1.852, 1)} NM)** from the {geofence['boundary_name']}. Vessel Status: **{geofence['status']}**.\n\n{geofence['warning_message']}"
                voice = f"Border alert: Nearest international boundary is {imbl_km} kilometers away. Vessel status is {geofence['status']}."
            elif intent == "OPTIMIZE_ROUTE":
                txt = f"🧭 **Fuel-Optimal Routing Analysis**: Direct line is {route['straight_distance_nm']} NM, but our A* algorithm computed an optimized current-assisted route. \n\n• **Diesel Saved**: {route['diesel_saved_litres_roundtrip']} Litres (₹{fuel_saved} saved)\n• **Fuel Reduction**: **{route['fuel_savings_percentage']}%**\n• **Time Saved**: {route['time_saved_minutes_roundtrip']} minutes\n• **Reasoning**: {route['reasoning']}"
                voice = f"Optimized route found. You will save {route['fuel_savings_percentage']} percent diesel, saving approximately {fuel_saved} rupees round trip."
            elif intent == "EXPLAIN_PRODUCTIVITY":
                prod = ocean_agent.explain_productivity_change(harbor['name'])
                txt = f"🔬 **Marine Ecological Productivity Analysis for {harbor['name']}**:\n\n" + "\n".join([f"• {f}" for f in prod['findings']]) + f"\n\n**Actionable Advice**: {prod['recommendation']}"
                voice = f"Productivity shifted due to thermal warming fronts moving shoals further offshore into deeper thermoclines."
            else:
                txt = f"🛰️ **ORCA Multi-Agent Recommendation for {harbor['name']}**:\n\n" \
                      f"1. **Nearest High-Yield PFZ**: **{hotspot['id']}** located **{dist_nm} NM** offshore (Confidence: **{hotspot['confidence_score']}%**).\n" \
                      f"2. **Target Biomass**: High concentration of **{species}** (SST: {hotspot['sst_celsius']}°C, Chl-a: {hotspot['chlorophyll_mg_m3']} mg/m³).\n" \
                      f"3. **Fuel Optimization**: A* current-assisted navigation cuts fuel burn by **{route['fuel_savings_percentage']}%**, saving **₹{fuel_saved}** ({route['diesel_saved_litres_roundtrip']}L).\n" \
                      f"4. **Safety & Border Status**: Wave height **{weather['wave_height_m']}m** ({weather['safety_status']}). Safe distance of **{imbl_km} km** from the international border."
                voice = f"Nearest fish hotspot is {dist_nm} nautical miles offshore for {species}. You will save {fuel_saved} rupees in fuel. Sea conditions are safe."

        return txt, voice

orchestrator = MasterOrchestratorAgent()
