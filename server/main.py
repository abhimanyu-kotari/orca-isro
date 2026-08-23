"""
FastAPI Server for Project ORCA (ISRO PS ID: 26176)
Exposes REST API endpoints for the Agentic AI Multi-Agent Engine.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from agents.ocean_agent import ocean_agent
from agents.weather_agent import weather_agent
from agents.geofence_agent import geofence_agent
from agents.routing_agent import routing_agent
from agents.orchestrator import orchestrator

app = FastAPI(
    title="ORCA: Marine EcoSystem Reasoning API",
    description="Agentic AI Marine Intelligence & Safe Navigation Platform for ISRO (PS ID: 26176)",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default is http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class ChatRequest(BaseModel):
    message: str
    harbor_id: Optional[str] = "chennai"
    language: Optional[str] = "en"

class VoyageRequest(BaseModel):
    harbor_id: str
    target_hotspot_id: Optional[str] = None
    language: Optional[str] = "en"

@app.get("/")
def root():
    return {
        "platform": "ORCA Marine Intelligence Co-Pilot",
        "organization": "Indian Space Research Organisation (ISRO)",
        "problem_statement_id": "26176",
        "status": "Online",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "Healthy",
        "agents": [
            {"agent": "Master Orchestrator", "status": "Ready"},
            {"agent": "Ocean Analytics Agent", "status": "Ready"},
            {"agent": "Weather & Risk Agent", "status": "Ready"},
            {"agent": "Routing & Fuel Optimizer", "status": "Ready"},
            {"agent": "Geofencing & Boundary Agent", "status": "Ready"}
        ]
    }

@app.get("/api/harbors")
def get_harbors():
    return ocean_agent.get_all_harbors()

@app.get("/api/boundaries")
def get_boundaries():
    return geofence_agent.get_all_boundaries()

@app.get("/api/pfz-hotspots/{harbor_id}")
def get_hotspots(harbor_id: str):
    return ocean_agent.detect_pfz_hotspots(harbor_id)

@app.get("/api/weather/{lat}/{lng}")
def get_weather(lat: float, lng: float):
    return weather_agent.get_marine_conditions(lat, lng)

@app.post("/api/chat")
def chat_with_agents(req: ChatRequest):
    try:
        result = orchestrator.process_query(
            user_message=req.message,
            harbor_id=req.harbor_id or "chennai",
            language=req.language or "en"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-voyage")
def analyze_voyage(req: VoyageRequest):
    try:
        harbors = ocean_agent.get_all_harbors()
        harbor = harbors.get(req.harbor_id.lower(), harbors["chennai"])
        hotspots = ocean_agent.detect_pfz_hotspots(req.harbor_id)
        
        # Select target hotspot
        target = hotspots[0]
        if req.target_hotspot_id:
            for h in hotspots:
                if h["id"] == req.target_hotspot_id:
                    target = h
                    break

        weather = weather_agent.get_marine_conditions(target["lat"], target["lng"])
        geofence = geofence_agent.check_point_proximity(target["lat"], target["lng"])
        route = routing_agent.calculate_optimal_voyage(
            start_lat=harbor["lat"],
            start_lng=harbor["lng"],
            target_lat=target["lat"],
            target_lng=target["lng"],
            current_speed_knots=weather["ocean_current_knots"],
            current_direction_deg=weather["ocean_current_direction_deg"]
        )

        return {
            "harbor": harbor,
            "selected_hotspot": target,
            "all_hotspots": hotspots,
            "weather": weather,
            "geofence": geofence,
            "route": route
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
