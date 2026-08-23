# 🛰️ Project ORCA: Marine EcoSystem Reasoning with Collaborative Agents
**SIH 2026 Problem Statement ID**: `26176`  
**Sponsoring Organization**: **Indian Space Research Organisation (ISRO) / Department of Space**  
**Category**: Software | **Theme**: Space Technology & Agentic AI

---

## 🌊 Overview
ORCA is an Agentic AI-powered marine decision-support platform designed to transform complex satellite Earth Observation data (SST, Chlorophyll, ocean currents, and weather forecasts) into actionable, life-saving, and fuel-optimal recommendations for Indian fishermen and coastal authorities.

---

## 🤖 Multi-Agent Architecture
* 🛰️ **Ocean Analytics Agent**: Ingests Sea Surface Temperature (SST) and Chlorophyll-a density to detect high-yield Potential Fishing Zones (PFZs).
* ⛈️ **Weather & Risk Agent**: Fetches real-time wave heights, wind vectors, and cyclone alerts via open marine APIs to compute a Sea Safety Score.
* 🧭 **Routing & Fuel Optimization Agent**: Runs $A^*$ pathfinding across dynamic ocean current vectors to cut diesel consumption by 20–28%.
* 🛡️ **Geofencing & Boundary Agent**: Evaluates vessel proximity to the International Maritime Boundary Line (IMBL) and Marine Protected Areas (MPAs).
* 🗣️ **Conversational Orchestrator**: Multi-turn dialogue agent with automatic language detection and voice output in Indian regional languages (Tamil, Telugu, Malayalam, Bengali, Hindi, English).

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons + Leaflet.js
* **Backend**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, NumPy, Geopy
* **Data Sources**: Open-Meteo Marine API (100% free open access), Leaflet/CartoDB tiles
* **Voice Engine**: Browser-native Web Speech API

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd server
pip install -r requirements.txt
python main.py
```
Backend runs at: `http://localhost:8000`

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`
