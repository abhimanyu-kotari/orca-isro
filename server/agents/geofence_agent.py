"""
Geofencing & Boundary Safety Agent
Monitors proximity to International Maritime Boundary Lines (IMBL),
Marine Protected Areas (MPA), and naval restricted corridors.
"""

import math
from typing import List, Dict, Any

class GeofenceSafetyAgent:
    def __init__(self):
        # International Maritime Boundary Lines (IMBL) waypoints
        self.imbl_boundaries = {
            "india_srilanka": {
                "name": "India - Sri Lanka International Maritime Boundary (Palk Strait / Gulf of Mannar)",
                "country": "Sri Lanka",
                "risk_level": "HIGH",
                "points": [
                    {"lat": 10.083, "lng": 79.866},
                    {"lat": 9.950, "lng": 79.766},
                    {"lat": 9.533, "lng": 79.483},
                    {"lat": 9.100, "lng": 79.250},
                    {"lat": 8.700, "lng": 79.050},
                    {"lat": 8.366, "lng": 78.916}
                ]
            },
            "india_pakistan": {
                "name": "India - Pakistan Maritime Boundary (Sir Creek / Arabian Sea)",
                "country": "Pakistan",
                "risk_level": "CRITICAL",
                "points": [
                    {"lat": 23.600, "lng": 68.050},
                    {"lat": 23.450, "lng": 67.850},
                    {"lat": 23.200, "lng": 67.500},
                    {"lat": 22.800, "lng": 67.100}
                ]
            }
        }

        # Marine Protected Areas & Ecologically Sensitive Zones (No-fishing corridors)
        self.protected_areas = [
            {
                "id": "MPA-GOM",
                "name": "Gulf of Mannar Biosphere Reserve (Coral Reef Sanctuary)",
                "type": "No Trawling Zone",
                "center_lat": 9.15,
                "center_lng": 78.95,
                "radius_km": 15
            },
            {
                "id": "MPA-GAHIR",
                "name": "Gahirmatha Marine Sanctuary (Olive Ridley Turtle Nesting Zone)",
                "type": "Seasonal Fishing Ban Area",
                "center_lat": 20.72,
                "center_lng": 87.05,
                "radius_km": 20
            }
        ]

    def get_all_boundaries(self) -> Dict[str, Any]:
        return {
            "imbl_lines": self.imbl_boundaries,
            "protected_areas": self.protected_areas
        }

    def check_point_proximity(self, lat: float, lng: float) -> Dict[str, Any]:
        """
        Calculates distance to nearest IMBL boundary point and checks if inside any Marine Protected Area.
        """
        min_imbl_dist_km = 9999.0
        nearest_boundary_name = ""
        nearest_pt = None

        for key, boundary in self.imbl_boundaries.items():
            for pt in boundary["points"]:
                # Haversine distance
                d = self._haversine(lat, lng, pt["lat"], pt["lng"])
                if d < min_imbl_dist_km:
                    min_imbl_dist_km = d
                    nearest_boundary_name = boundary["name"]
                    nearest_pt = pt

        # Status categorization
        if min_imbl_dist_km > 25:
            status = "SAFE"
            alert_level = "GREEN"
            warning_msg = f"Vessel is in unrestricted territorial waters ({round(min_imbl_dist_km, 1)} km to {nearest_boundary_name.split()[0]} border)."
        elif min_imbl_dist_km > 10:
            status = "ADVISORY"
            alert_level = "YELLOW"
            warning_msg = f"Notice: Approaching maritime border zone ({round(min_imbl_dist_km, 1)} km from {nearest_boundary_name.split()[0]} IMBL)."
        elif min_imbl_dist_km > 4:
            status = "WARNING"
            alert_level = "ORANGE"
            warning_msg = f"PROXIMITY WARNING: Only {round(min_imbl_dist_km, 1)} km from {nearest_boundary_name.split()[0]} boundary! Steer course away immediately."
        else:
            status = "CRITICAL BORDER BREACH RISK"
            alert_level = "RED"
            warning_msg = f"CRITICAL HAZARD: Imminent crossing of International Maritime Boundary ({round(min_imbl_dist_km, 1)} km)! Risk of vessel seizure."

        # Check MPA
        inside_mpa = None
        for mpa in self.protected_areas:
            dist_to_mpa = self._haversine(lat, lng, mpa["center_lat"], mpa["center_lng"])
            if dist_to_mpa < mpa["radius_km"]:
                inside_mpa = mpa
                break

        return {
            "nearest_imbl_distance_km": round(min_imbl_dist_km, 1),
            "nearest_imbl_distance_nm": round(min_imbl_dist_km / 1.852, 1),
            "boundary_name": nearest_boundary_name,
            "status": status,
            "alert_level": alert_level,
            "warning_message": warning_msg,
            "nearest_imbl_point": nearest_pt,
            "inside_protected_area": inside_mpa
        }

    def _haversine(self, lat1, lon1, lat2, lon2):
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

geofence_agent = GeofenceSafetyAgent()
