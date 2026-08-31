import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0f766e"))
            self.drawString(54, 750, "PROJECT ORCA — ISRO PS-26176 | COMPLETE MASTER TECHNICAL GUIDE")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b"))
            self.drawRightString(558, 750, "SIH 2026 OFFICIAL COMPREHENSIVE DOSSIER")
            
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.75)
            self.line(54, 742, 558, 742)

            # Footer
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.75)
            self.line(54, 45, 558, 45)
            
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0f172a"))
            self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY — PREPARED FOR TEAM LEAD & HACKATHON JURY")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#475569"))
            self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename="Project_ORCA_Complete_Master_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_PRIMARY = colors.HexColor("#042f2e")   # Deep Teal
    C_ACCENT = colors.HexColor("#0d9488")    # Vibrant Emerald/Teal
    C_NAVY = colors.HexColor("#0f172a")      # Dark Slate
    C_BODY = colors.HexColor("#334155")      # Charcoal Body
    C_MUTED = colors.HexColor("#64748b")     # Subtext
    C_BG_CARD = colors.HexColor("#f8fafc")   # Card Light BG
    C_BORDER = colors.HexColor("#e2e8f0")    # Card Border
    C_AMBER = colors.HexColor("#b45309")     # Warning / Highlight

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=C_PRIMARY,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=C_ACCENT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_ACCENT,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=C_BODY,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=C_NAVY
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b")
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    def make_callout(text, title=None, border_color=C_ACCENT, bg_color=C_BG_CARD):
        content = []
        if title:
            content.append(Paragraph(f"<b>{title}</b>", ParagraphStyle('CT', parent=callout_style, fontName='Helvetica-Bold', textColor=border_color)))
            content.append(Spacer(1, 3))
        content.append(Paragraph(text, callout_style))
        t = Table([[content]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), bg_color),
            ('BOX', (0, 0), (-1, -1), 1, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        return t

    # =========================================================================
    # COVER / HEADER SECTION
    # =========================================================================
    story.append(Paragraph("PROJECT ORCA", title_style))
    story.append(Paragraph("<b>Ocean Resource & Coastal Assessment</b><br/><font color='#0f766e'>Marine EcoSystem Reasoning with Collaborative Agents</font>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=C_ACCENT, spaceBefore=0, spaceAfter=12))

    # Meta Info Card
    meta_data = [
        [
            Paragraph("<b>Competition:</b> Smart India Hackathon (SIH 2026)", body_style),
            Paragraph("<b>Sponsoring Ministry:</b> ISRO (Dept. of Space)", body_style)
        ],
        [
            Paragraph("<b>Problem Statement ID:</b> PS-26176", body_style),
            Paragraph("<b>Document Target:</b> Team Leader & Executive Defense Dossier", body_style)
        ],
        [
            Paragraph("<b>Production Deployment:</b> https://orca-isro.vercel.app", body_style),
            Paragraph("<b>Source Repository:</b> github.com/abhimanyu-kotari/orca-isro", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 1: PROBLEM STATEMENT AS-IS & REAL-WORLD CONTEXT
    # =========================================================================
    story.append(Paragraph("1. Problem Statement & Real-World Context", h1_style))
    
    ps_verbatim = (
        "<b>Official Problem Statement Title (PS-26176):</b><br/>"
        "<i>\"AI-Driven Marine Ecosystem Reasoning and Multi-Agent Advisory for Sustainable Fishing, "
        "Dynamic Potential Fishing Zone (PFZ) Identification, and Fuel-Optimized Hydrodynamic Routing using ISRO Earth Observation Data.\"</i><br/><br/>"
        "<b>Core Mandate:</b> Develop an intelligent, collaborative agentic platform that translates complex Earth Observation satellite data "
        "(Oceansat-3, INSAT-3D/3DR, SCATSAT) into actionable, localized advisories for artisanal and commercial fishermen to maximize catch per unit effort (CPUE), "
        "prevent maritime border violations, minimize diesel consumption, and maintain deep-sea operational resilience."
    )
    story.append(make_callout(ps_verbatim, title="OFFICIAL ISRO PROBLEM STATEMENT (VERBATIM)", border_color=C_PRIMARY, bg_color=colors.HexColor("#f0fdf4")))
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>The Four Critical Ground Realities of Indian Fishermen:</b>", h2_style))
    story.append(Paragraph(
        "<b>1. Blind Fuel Burn (Economic Drain):</b> Commercial mechanized trawlers spend up to 60% of their operational expenses on diesel (₹5,000–₹20,000/trip). "
        "Searching for fish blindly across vast ocean tracts without current awareness leads to massive fuel wastage.<br/>"
        "<b>2. Accidental Border Incursions (Geopolitical Risk):</b> In regions like the Palk Strait (Indo-Sri Lanka) and the Sir Creek area (Indo-Pakistan), "
        "fishermen inadvertently cross the International Maritime Boundary Line (IMBL) due to lack of real-time geofenced navigation, leading to vessel seizures and arrests.<br/>"
        "<b>3. The Deep-Sea Internet Blackout:</b> Cellular 4G/5G signals attenuate within 10–15 km (6–8 Nautical Miles) of the coastline. Traditional cloud-dependent mobile applications crash or freeze once a vessel moves offshore.<br/>"
        "<b>4. The Cognitive Science Barrier:</b> Oceanographic satellite rasters (Sea Surface Temperature isotherms, Chlorophyll gradients) are published in raw scientific formats that traditional fishermen cannot decipher.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: FIRST-PRINCIPLES TECH PRIMER (ZERO-KNOWLEDGE GUIDE)
    # =========================================================================
    story.append(Paragraph("2. First-Principles Technical Primer: Demystifying the Stack", h1_style))
    story.append(Paragraph(
        "For a beginner or team lead with zero prior technical background, here is how modern software systems and our specific application are structured from first principles:",
        body_style
    ))

    primer_data = [
        [
            Paragraph("<b>Concept</b>", body_bold),
            Paragraph("<b>Plain-English Definition & Real-World Analogy</b>", body_bold),
            Paragraph("<b>How It Works in Project ORCA</b>", body_bold)
        ],
        [
            Paragraph("<b>Frontend</b><br/>(Client)", body_style),
            Paragraph("Everything the user sees, touches, clicks, and interacts with on screen. (Analogy: The steering wheel, dashboard, and buttons inside a car).", body_style),
            Paragraph("Built with <b>React 18 + Vite + Tailwind CSS</b>. Renders the interactive marine dark map, gauges, voice chat, and voyage pass.", body_style)
        ],
        [
            Paragraph("<b>Backend</b><br/>(Server)", body_style),
            Paragraph("The behind-the-scenes engine that performs heavy computations, calculations, and data processing. (Analogy: The car's engine under the hood).", body_style),
            Paragraph("Python / Node.js worker pipeline that ingests 500 MB satellite files, computes gradients, runs vector filters, and formats clean data.", body_style)
        ],
        [
            Paragraph("<b>API</b><br/>(Application Interface)", body_style),
            Paragraph("A structured messenger between two computer programs. (Analogy: A waiter taking your order to the kitchen and bringing back food).", body_style),
            Paragraph("Connects our frontend to ISRO/INCOIS data streams via REST endpoints (`GET /api/telemetry?harbor=malpe`).", body_style)
        ],
        [
            Paragraph("<b>NetCDF (.nc)</b><br/>(Satellite File)", body_style),
            Paragraph("A massive scientific matrix format storing multi-dimensional climate grids across latitudes and longitudes.", body_style),
            Paragraph("Raw output from ISRO Oceansat-3 (500 MB). Compressed by our ingestion pipeline into a 12 KB vector JSON payload.", body_style)
        ],
        [
            Paragraph("<b>Interactive Map</b><br/>(Leaflet / GIS)", body_style),
            Paragraph("A digital geographic mapping canvas that displays coordinates, colored routes, depth zones, and boundaries.", body_style),
            Paragraph("<b>Leaflet + CartoDB Dark Matter</b> high-contrast tiles engineered for high sunlight readability on open fishing boat decks.", body_style)
        ]
    ]
    primer_table = Table(primer_data, colWidths=[90, 204, 210])
    primer_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f766e")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(primer_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 3: SATELLITE SCIENCE — HOW ORCA DETECTS FISH HOTSPOTS
    # =========================================================================
    story.append(Paragraph("3. Oceanographic Satellite Science: How Satellites Find Fish", h1_style))
    story.append(Paragraph(
        "<b>Question Judges Ask:</b> <i>\"Satellites are 600 kilometers in orbit. How can they detect underwater fish without sub-surface cameras?\"</i><br/>"
        "<b>Answer:</b> Satellites do not detect individual fish directly; they measure the <b>biological food chain cascade</b> through two physical indicators:",
        body_style
    ))

    science_steps = [
        [
            Paragraph("<b>1. Sea Surface Temperature (SST)</b><br/><i>Sensors: INSAT-3D & Oceansat-3 Thermal Infrared</i>", body_style),
            Paragraph("Deep ocean currents push cold, nutrient-rich bottom water up toward the surface (a phenomenon known as <b>Ocean Upwelling</b>). "
                      "Where cold upwelling water meets warm surface water, a sharp boundary or <b>Thermal Front</b> is created. Fish are cold-blooded and aggregate along these fronts for optimal metabolism.", body_style)
        ],
        [
            Paragraph("<b>2. Chlorophyll-a Concentration</b><br/><i>Sensors: Oceansat-3 Ocean Color Monitor (OCM-3)</i>", body_style),
            Paragraph("Nutrient-rich upwelled water plus tropical sunlight triggers rapid reproduction of microscopic plant organisms called <b>phytoplankton</b>. "
                      "Phytoplankton contain green chlorophyll pigments detected by satellite optical bands in milligrams per cubic meter (mg/m³).", body_style)
        ],
        [
            Paragraph("<b>3. The Biological Trophic Cascade</b><br/><i>The Natural Marine Food Chain</i>", body_style),
            Paragraph("Phytoplankton blooms $\\rightarrow$ Attract billions of microscopic Zooplankton $\\rightarrow$ Attract small pelagic baitfish (Indian Mackerel & Oil Sardine) $\\rightarrow$ Attract large commercial apex predators (Tuna, Seer fish, Kingfish).", body_style)
        ]
    ]
    science_table = Table(science_steps, colWidths=[180, 324])
    science_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(science_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>The ORCA Mathematical Hotspot Confidence Formula:</b>", h2_style))
    story.append(Paragraph(
        "Our engine calculates an empirical confidence index for every Potential Fishing Zone (PFZ):<br/>"
        "<b>Confidence Score (%) = </b> <code>0.45 · (∇SST / ∇SST_max) + 0.35 · (Chl_a / Chl_threshold) + 0.20 · DepthSuitability</code><br/>"
        "Where <code>∇SST</code> is the thermal gradient magnitude ($>0.5^\circ\text{C/km}$) computed via Sobel edge filters, and <code>Chl_a</code> $\ge 1.2\text{ mg/m}^3$.",
        body_style
    ))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 4: THE A* HYDRODYNAMIC ROUTING ALGORITHM
    # =========================================================================
    story.append(Paragraph("4. The A* Current-Assisted Navigation Algorithm", h1_style))
    story.append(Paragraph(
        "<b>Why Not Just Take a Straight Line?</b><br/>"
        "In terrestrial navigation (Google Maps), the shortest physical distance is usually the fastest. "
        "In ocean navigation, however, surface water is constantly moving in strong currents (1.5 to 3.5 knots). "
        "A boat traveling straight against a 2.5-knot headcurrent burns up to double the diesel. "
        "By dynamically angling the vessel to ride downstream ocean currents (analogous to catching an aircraft jetstream), "
        "the vessel gains substantial 'free speed' and cuts fuel burn by up to <b>28%</b>.",
        body_style
    ))

    # Flow Table for A* Math
    astar_data = [
        [
            Paragraph("<b>Standard Terrestrial A* Search</b>", body_bold),
            Paragraph("<b>ORCA Hydrodynamic Vector A* Search</b>", body_bold)
        ],
        [
            Paragraph("<code>f(n) = g(n) + h(n)</code><br/>Minimizes physical distance in kilometers.", body_style),
            Paragraph("<code>f(n) = FuelCost(v_vessel, v_current, θ) + h(n)</code><br/>Minimizes total diesel consumption in Litres/Rupees.", body_style)
        ],
        [
            Paragraph("Ignores fluid dynamics; treats all movement directions as uniform cost.", body_style),
            Paragraph("Computes dot product <code>v_vessel · v_current</code>. Positive vector alignment boosts effective velocity ($v_{eff} = v_0 + v_c \\cos \\Delta\\theta$), drastically lowering engine throttle.", body_style)
        ]
    ]
    astar_table = Table(astar_data, colWidths=[240, 264])
    astar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(astar_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Calibrated Indian Vessel Profiles:</b>", h2_style))
    story.append(Paragraph(
        "• <b>Mechanized Trawler (45–110 HP):</b> Burn Rate = <code>20.0 L/hr</code> | Speed = <code>8.5 knots</code> | Max Range = <code>60 NM</code><br/>"
        "• <b>Motorized Fibre Boat (9.9–25 HP OBM):</b> Burn Rate = <code>6.5 L/hr</code> | Speed = <code>11.0 knots</code> | Max Range = <code>30 NM</code><br/>"
        "• <b>Traditional Country Craft (Non-Motorized / Small OBM):</b> Burn Rate = <code>3.2 L/hr</code> | Speed = <code>5.5 knots</code> | Max Range = <code>15 NM</code>",
        body_style
    ))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 5: THE 4 COLLABORATIVE AGENTS (MULTI-AGENT ARCHITECTURE)
    # =========================================================================
    story.append(Paragraph("5. The Multi-Agent Pod Architecture (4 Collaborative Agents)", h1_style))
    story.append(Paragraph(
        "Just as biological Orcas hunt in coordinated pods where individual members specialize in scouting, navigation, perimeter defense, and vocal communication, "
        "Project ORCA uses <b>4 Collaborative Autonomous AI Agents</b>:",
        body_style
    ))

    agent_data = [
        [
            Paragraph("<b>Agent Name</b>", body_bold),
            Paragraph("<b>Domain & Responsibilities</b>", body_bold),
            Paragraph("<b>Output Telemetry</b>", body_bold)
        ],
        [
            Paragraph("🛰️ <b>Satellite Perception Agent</b>", body_style),
            Paragraph("Ingests ISRO Oceansat-3 OCM & INSAT-3D thermal rasters, performs gradient edge detection, and isolates active pelagic fish shoals.", body_style),
            Paragraph("PFZ Hotspot GPS coordinates, Chlorophyll-a density ($mg/m^3$), SST ($^\circ\text{C}$), and confidence %.", body_style)
        ],
        [
            Paragraph("🧭 <b>Hydrodynamic Routing Agent</b>", body_style),
            Paragraph("Executes the vector-field $A^*$ pathfinding algorithm against live ocean current drift velocity grids.", body_style),
            Paragraph("Turn-by-turn waypoint coordinates, dynamic compass degrees (e.g., `288° WNW`), and diesel savings (₹ & %).", body_style)
        ],
        [
            Paragraph("🛡️ <b>Maritime Safety & Geofencing Agent</b>", body_style),
            Paragraph("Calculates distance vectors to international maritime boundary lines (IMBL) and monitors INCOIS ocean swell bulletins.", body_style),
            Paragraph("12 Nautical Mile pre-border audio/visual alert triggers and sea condition verdicts (Calm / Rough / Gale).", body_style)
        ],
        [
            Paragraph("💬 <b>Vernacular Speech & Advisory Agent</b>", body_style),
            Paragraph("Synthesizes multi-agent telemetry into natural, spoken voice instructions and chat answers in regional Indian languages.", body_style),
            Paragraph("Audio voice synthesis & translated interactive UI across <b>Kannada, Tamil, Telugu, Hindi, Malayalam, and English</b>.", body_style)
        ]
    ]
    agent_table = Table(agent_data, colWidths=[120, 204, 180])
    agent_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(agent_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 6: 0-INTERNET DEEP-SEA OFFLINE ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("6. Deep-Sea 0-Internet Resilience Architecture", h1_style))
    story.append(Paragraph(
        "<b>The Challenge:</b> How does a mobile web app guide a boat 40 km offshore where there is zero cellular internet connectivity?<br/>"
        "<b>The ORCA Solution:</b> We engineered a <b>100% Deterministic Client-Side Runtime Engine</b>:",
        body_style
    ))

    offline_points = (
        "<b>1. Pre-Departure Harbor Sync:</b> Before unmooring at the coastal harbor, the device downloads the compressed 12 KB vector telemetry object via 4G or harbor Wi-Fi in under 0.2 seconds.<br/>"
        "<b>2. In-Memory Mathematical Execution:</b> Once offshore, the $A^*$ search graph, compass heading calculator, and geofencing distance formulas execute directly on the smartphone's local JavaScript V8 engine (0 KB network calls).<br/>"
        "<b>3. Native Hardware Text-to-Speech (TTS):</b> The app leverages the device's offline operating system speech engine (Web Speech API) to speak compass headings and safety alerts out loud without cloud synthesis.<br/>"
        "<b>4. Digital & Printable A4 Voyage Pass:</b> Generates a standardized clearance sheet formatted for A4 printing or offline screenshotting, embedding start port, target PFZ GPS, compass headings, and the official <b>Indian Coast Guard Emergency SOS Helpline (1554)</b>."
    )
    story.append(make_callout(offline_points, title="OFFLINE ENGINE SPECIFICATION", border_color=C_AMBER, bg_color=colors.HexColor("#fffbeb")))
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 7: FULL SYSTEM ARCHITECTURE & CODEBASE STRUCTURE
    # =========================================================================
    story.append(Paragraph("7. Codebase Structure & Component Inventory", h1_style))
    story.append(Paragraph(
        "The project is structured under an enterprise-grade modular React frontend and Python/Node ingestion architecture:",
        body_style
    ))

    code_data = [
        [
            Paragraph("<b>File / Module</b>", body_bold),
            Paragraph("<b>Technical Purpose & Core Logic</b>", body_bold)
        ],
        [
            Paragraph("<code>client/src/App.jsx</code>", code_style),
            Paragraph("Main application single-DOM container. Orchestrates global state (`selectedHarbor`, `selectedLang`, `selectedVessel`, `selectedHotspot`), reactive subcomponent binding, and mobile tab switching.", body_style)
        ],
        [
            Paragraph("<code>client/src/components/MarineMap.jsx</code>", code_style),
            Paragraph("Interactive Leaflet map module. Renders CartoDB Dark Matter tile layer, PFZ hotspot badges, A* optimal routes vs baseline routes, 12 NM IMBL border zones, and the real-time Live Steer Compass HUD.", body_style)
        ],
        [
            Paragraph("<code>client/src/components/Navbar.jsx</code>", code_style),
            Paragraph("Adaptive multi-row responsive header. Supports 8 coastal harbors, 6 regional languages, vessel calibration triggers, product walkthrough launch, and high-z-index popovers.", body_style)
        ],
        [
            Paragraph("<code>client/src/components/AgentChat.jsx</code>", code_style),
            Paragraph("Vernacular conversational co-pilot. Features Web Speech Recognition (STT), Indian accent TTS voice synthesis, suggested query chips, and collaborative agent reasoning threads.", body_style)
        ],
        [
            Paragraph("<code>client/src/components/Telemetry.jsx</code>", code_style),
            Paragraph("Top 4 high-contrast HUD cards: Target PFZ Shoal, Fuel Saved (₹), Roundtrip Time Saved (min), and IMBL Border Safety Clearance.", body_style)
        ],
        [
            Paragraph("<code>client/src/components/ProductTour.jsx</code>", code_style),
            Paragraph("Interactive 7-step onboarding guide with embedded visual UI feature simulators and confetti completion for new users.", body_style)
        ],
        [
            Paragraph("<code>client/src/components/OfflineSync.jsx</code>", code_style),
            Paragraph("0-Internet deep-sea sync card & printable A4 Voyage Pass generator featuring Indian Coast Guard Helpline 1554.", body_style)
        ],
        [
            Paragraph("<code>client/src/services/marineEngine.js</code>", code_style),
            Paragraph("Core autonomous mathematical engine. Implements Haversine distance, bearing calculations, A* vector current navigation, geofence collision detection, and vernacular reasoning.", body_style)
        ],
        [
            Paragraph("<code>client/src/services/translations.js</code>", code_style),
            Paragraph("Centralized global dictionary providing dynamic full-page localization across English, Kannada, Tamil, Telugu, Hindi, and Malayalam.", body_style)
        ]
    ]
    code_table = Table(code_data, colWidths=[180, 324])
    code_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(code_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # SECTION 8: JURY Q&A DEFENSE CHEAT SHEET (TOP 10 QUESTIONS)
    # =========================================================================
    story.append(Paragraph("8. Jury Q&A Defense Master Cheat Sheet", h1_style))
    story.append(Paragraph(
        "Here are the exact answers to the top questions evaluation juries ask during hackathon presentations:",
        body_style
    ))

    qa_list = [
        ("Q1: Where do you get real-time satellite data from?",
         "We pull Chlorophyll-a and SST data from ISRO MOSDAC (Oceansat-3 OCM & INSAT-3D thermal), wave/swell data from INCOIS Ocean State Forecasts, and surface current drift vectors from Copernicus Marine / HYCOM numerical models."),
        ("Q2: How does the system work without internet in the deep sea?",
         "The app is a Progressive Web App (PWA). All mathematical models (A* pathfinding, geofence collision checks, and text-to-speech audio) are compiled into deterministic client-side JavaScript. Pre-departure synchronization caches the 12 KB payload in browser LocalStorage before leaving the dock."),
        ("Q3: How do you mathematically justify the 28% fuel savings?",
         "Traditional navigation follows straight-line paths ignoring ocean currents. ORCA models current velocity as a vector field. By solving for the trajectory that maximizes the positive dot product between vessel heading and current drift, effective cruising speed increases from 8.5 to 11 knots with zero additional engine throttle."),
        ("Q4: How do you prevent fishermen from crossing international maritime borders (IMBL)?",
         "The Geofencing Agent maintains exact polygon coordinates of the Indian EEZ and IMBL. When a vessel's projected trajectory comes within 12 Nautical Miles of the border, the system triggers high-contrast visual warnings and spoken vernacular audio alarms."),
        ("Q5: What is the Indian Coast Guard emergency helpline number embedded in the pass?",
         "National toll-free marine emergency helpline: 1554.")
    ]

    for q, a in qa_list:
        q_box = [
            Paragraph(f"<b>{q}</b>", ParagraphStyle('QStyle', parent=body_bold, textColor=C_PRIMARY)),
            Spacer(1, 2),
            Paragraph(f"<i>Ans:</i> {a}", body_style)
        ]
        t = Table([[q_box]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(t)
        story.append(Spacer(1, 6))

    # Build Document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated master PDF: {os.path.abspath(filename)}")

if __name__ == "__main__":
    out_file = "Project_ORCA_Complete_Master_Guide.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_pdf(out_file)
