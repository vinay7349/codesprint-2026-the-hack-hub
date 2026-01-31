from datetime import datetime, timezone
from time import time
import random
import hashlib

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo import MongoClient
from bson import ObjectId


app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Socket.IO with CORS
socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB configuration
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "disaster_db"
COLLECTION_NAME = "alerts"

mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
alerts_collection = db[COLLECTION_NAME]
families_collection = db["families"]
shelters_collection = db["shelters"]


KEYWORDS_HIGH_SEVERITY = ["flood", "cyclone", "earthquake", "fire", "water rising"]


def analyze_alert_meta(message: str) -> dict:
    """
    SankatMitra AI: Analyzes severity and categorizes disaster type.
    """
    lowered = (message or "").lower()
    sev = "Low"
    t = "alert"
    
    # Alert Type detection
    if any(k in lowered for k in ["flood", "water", "rising", "tsunami"]): t = "flood"
    elif any(k in lowered for k in ["fire", "smoke", "blaze", "burning"]): t = "fire"
    elif any(k in lowered for k in ["wind", "cyclone", "storm", "hurricane"]): t = "cyclone"
    elif any(k in lowered for k in ["earthquake", "quake", "tremor", "collapsed"]): t = "earthquake"
    
    # Severity Detection
    if any(k in lowered for k in KEYWORDS_HIGH_SEVERITY): sev = "High"
    if any(k in lowered for k in ["critical", "sos", "emergency", "immediate", "urgent"]): sev = "Critical"
    
    return {"severity": sev, "type": t}



def analyze_credibility(message: str, is_registered: bool = False, is_admin: bool = False, votes_up: int = 0, votes_down: int = 0) -> dict:
    """
    SankatMitra AI Verification Engine.
    Cross-references source registration, semantic integrity, and community consensus.
    """
    if is_admin:
        return {"score": 100, "verified": True, "reason": "SankatMitra Official Broadcast (Vetted Source)"}
        
    score = 75 if is_registered else 35
    reasons = ["Registered Citizen Signal" if is_registered else "Standard Public Channel"]
    
    lowered = (message or "").lower()
    if len(message) > 40:
        score += 15
        reasons.append("High contextual density")
    
    suspicious = ["prank", "fake", "test", "checking", "haha", "lol", "spam", "just kidding"]
    if any(s in lowered for s in suspicious):
        return {"score": 12, "verified": False, "reason": "SankatMitra AI: Potential Disinformation Patterns Detected"}
        
    # Semantic check for emergency context
    emergency_context = ["flood", "water", "fire", "smoke", "help", "trapped", "danger", "warning", "rescue"]
    if any(e in lowered for e in emergency_context):
        score += 10
        reasons.append("Emergency semantic match")

    # Community Consensus Recalibration
    net_votes = votes_up - (votes_down * 2) # Spam votes are weighted more heavily
    if net_votes > 0:
        score += (net_votes * 5)
        reasons.append(f"Community Confirmed ({votes_up} votes)")
    elif net_votes < 0:
        score += (net_votes * 10)
        reasons.append(f"Community Flagged ({votes_down} spam reports)")

    final_verified = score >= 85
    if score < 15: score = 15 # Minimum floor for non-spam signals
    if score < 40: final_verified = False # Mandatory threshold for verification
    
    return {
        "score": max(0, min(100, score)),
        "verified": final_verified,
        "reason": " | ".join(reasons)
    }


# Mock road condition data for evacuation routing
FLOODED_ROADS = ["Bridge Road", "River Side Street"]
HEAVY_TRAFFIC_ROADS = ["Market Road", "Central Junction"]


def compute_safe_route(current_location: str, destination: str):
    """
    Simulate safe evacuation routing.
    - Returns a "safest" path description.
    - Provides mock GPS coordinates for each step.
    - Calculates a Safety Score and ETA.
    """
    import random
    
    # Base coordinates for the route (Mock data centered in Bengaluru for demo)
    base_lat, base_lng = 12.9716, 77.5946
    
    # Construct a friendly, safety-first route description with coordinates
    route_steps = [
        {
            "instruction": f"Start near {current_location or 'Current Position'}",
            "lat": base_lat, "lng": base_lng,
            "type": "start"
        },
        {
            "instruction": "Head North on Lake View Road (Clear path detected)",
            "lat": base_lat + 0.005, "lng": base_lng + 0.002,
            "type": "path"
        },
        {
            "instruction": "Avoiding Bridge Road (FLOODED)",
            "lat": base_lat + 0.008, "lng": base_lng - 0.003,
            "type": "avoid", "reason": "Flood"
        },
        {
            "instruction": "Diverting to Green Park Street (Safest Alternative)",
            "lat": base_lat + 0.012, "lng": base_lng + 0.005,
            "type": "path"
        },
        {
            "instruction": f"Arrive at safe point: {destination or 'Main Shelter'}",
            "lat": base_lat + 0.015, "lng": base_lng + 0.008,
            "type": "end"
        }
    ]

    # Calculate mock analytics
    safety_score = random.randint(85, 99)
    eta = random.randint(15, 45) # minutes
    
    avoided_flooded = ["Bridge Road", "River Side Street"]
    avoided_traffic = ["Market Road", "Central Junction"]

    message = (
        f"Safest path identified with {safety_score}% reliability. "
        "Dynamic rerouting enabled to bypass active hazards."
    )

    return {
        "steps": route_steps,
        "avoided_roads": {
            "flooded": avoided_flooded,
            "traffic": avoided_traffic,
        },
        "analytics": {
            "safety_score": safety_score,
            "eta_minutes": eta,
            "total_distance_km": 4.2
        },
        "message": message,
    }


# In-memory rate limiting storage: {ip: last_timestamp}
RATE_LIMIT_SECONDS = 10
_last_alert_by_ip = {}


def is_rate_limited(ip: str) -> bool:
    """Return True if this IP is currently rate limited."""
    now = time()
    last_time = _last_alert_by_ip.get(ip)
    if last_time is None:
        return False
    return (now - last_time) < RATE_LIMIT_SECONDS


def mark_request(ip: str):
    """Record the current time for a given IP."""
    _last_alert_by_ip[ip] = time()


@app.route("/report", methods=["POST"])
def report_alert():
    """
    POST /report
    Body: { "message": string, "location": string, "is_registered": bool, "is_admin": bool }
    - AI Analyzes severity and categorizes disaster type
    - AI Verification Engine checks credibility
    - Emits real-time notification to all dashboards
    """
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown")

    if is_rate_limited(ip):
        return (
            jsonify(
                {
                    "error": "Rate limit exceeded. AI Sentry is cooling down. Please wait 10s.",
                    "retry_after_seconds": RATE_LIMIT_SECONDS,
                }
            ),
            429,
        )

    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    location = data.get("location", "").strip()
    is_registered = data.get("is_registered", False)
    is_admin = data.get("is_admin", False)

    if not message or not location:
        return jsonify({"error": "Both 'message' and 'location' are required for AI analysis."}), 400

    # Execute AI Meta Analysis
    meta = analyze_alert_meta(message)
    severity = meta["severity"]
    alert_type = meta["type"]
    
    # Execute AI Credibility Check
    credibility = analyze_credibility(message, is_registered, is_admin)

    # Mock high-fidelity geolocation for reporting
    lat = 12.9 + random.uniform(0, 0.2)
    lng = 77.5 + random.uniform(0, 0.2)
    timestamp = datetime.now(timezone.utc).isoformat()

    alert_doc = {
        "message": message,
        "location": location,
        "severity": severity,
        "type": alert_type,
        "timestamp": timestamp,
        "ip": ip,
        "credibility": credibility,
        "coordinates": {"lat": lat, "lng": lng},
        "votes_up": 0,
        "votes_down": 0,
        "voters": [] # List of IPs or user IDs
    }

    result = alerts_collection.insert_one(alert_doc)

    # Prepare a JSON-serializable alert object
    alert_for_client = {
        "_id": str(result.inserted_id),
        "message": message,
        "location": location,
        "severity": severity,
        "type": alert_type,
        "timestamp": timestamp,
        "credibility": credibility,
        "coordinates": {"lat": lat, "lng": lng},
        "votes_up": 0,
        "votes_down": 0
    }

    # Emit Socket.IO event to all connected clients
    socketio.emit("new_alert", alert_for_client)

    # Mark this request against rate limiting after successful processing
    mark_request(ip)

    return jsonify({"severity": severity, "alert": alert_for_client}), 201


@app.route("/alerts", methods=["GET"])
def list_alerts():
    """
    GET /alerts
    Returns a list of alerts, newest first.
    """
    alerts_cursor = alerts_collection.find().sort("timestamp", -1)
    alerts = []
    for doc in alerts_cursor:
        alerts.append(
            {
                "_id": str(doc.get("_id")),
                "message": doc.get("message", ""),
                "location": doc.get("location", ""),
                "severity": doc.get("severity", "Low"),
                "type": doc.get("type", "alert"),
                "timestamp": doc.get("timestamp", ""),
                "credibility": doc.get("credibility", {"score": 35, "verified": False, "reason": "Legacy intelligence signal - analysis pending"}),
                "votes_up": doc.get("votes_up", 0),
                "votes_down": doc.get("votes_down", 0)
            }
        )
    return jsonify({"alerts": alerts})


@app.route("/vote", methods=["POST"])
def vote_alert():
    """
    POST /vote
    { "alert_id": str, "vote_type": "up" | "down" }
    Recalculates credibility based on community pulse.
    """
    data = request.get_json(silent=True) or {}
    alert_id = data.get("alert_id")
    vote_type = data.get("vote_type") # "up" or "down"
    
    if not alert_id or not vote_type:
        return jsonify({"error": "Missing alert_id or vote_type"}), 400
        
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown")
    
    alert = alerts_collection.find_one({"_id": ObjectId(alert_id)})
    if not alert:
        return jsonify({"error": "Alert not found"}), 404
        
    if ip in alert.get("voters", []):
        return jsonify({"error": "Already voted on this intelligence signal"}), 403
        
    update_field = "votes_up" if vote_type == "up" else "votes_down"
    
    # Update vote counts
    alerts_collection.update_one(
        {"_id": ObjectId(alert_id)},
        {
            "$inc": {update_field: 1},
            "$push": {"voters": ip}
        }
    )
    
    # Get updated counts for recalibration
    updated_alert = alerts_collection.find_one({"_id": ObjectId(alert_id)})
    v_up = updated_alert.get("votes_up", 0)
    v_down = updated_alert.get("votes_down", 0)
    
    # Recalibrate credibility
    is_registered = "Registered" in updated_alert.get("credibility", {}).get("reason", "")
    is_admin = "Official" in updated_alert.get("credibility", {}).get("reason", "")
    
    new_credibility = analyze_credibility(
        updated_alert.get("message", ""),
        is_registered=is_registered,
        is_admin=is_admin,
        votes_up=v_up,
        votes_down=v_down
    )
    
    alerts_collection.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"credibility": new_credibility}}
    )
    
    # Broadcast update to all clients
    socketio.emit("alert_updated", {
        "_id": alert_id,
        "credibility": new_credibility,
        "votes_up": v_up,
        "votes_down": v_down
    })
    
    return jsonify({"message": "Vote recorded", "credibility": new_credibility}), 200


@app.route("/get-safe-route", methods=["POST"])
def get_safe_route():
    """
    POST /get-safe-route
    Body: { "current_location": string, "destination": string }
    Returns a simulated safest evacuation route based on mock flooded and
    heavy-traffic road conditions.
    """
    data = request.get_json(silent=True) or {}
    current_location = data.get("current_location", "").strip()
    destination = data.get("destination", "").strip()

    if not current_location or not destination:
        return (
          jsonify(
              {
                  "error": "Both 'current_location' and 'destination' are required.",
              }
          ),
          400,
        )

    route_payload = compute_safe_route(current_location, destination)
    return jsonify(route_payload)


@app.route("/register_family", methods=["POST"])
def register_family():
    """
    POST /register_family
    Body: { "head_name": str, "members": int, "location": str, "phone": str }
    """
    data = request.get_json(silent=True) or {}
    head_name = data.get("head_name", "").strip()
    location = data.get("location", "").strip()
    phone = data.get("phone", "").strip()
    members = data.get("members", 1)

    if not head_name or not location:
        return jsonify({"error": "Name and Location are required"}), 400

    aadhaar_raw = data.get("aadhaar", "").strip()
    aadhaar_hashed = hashlib.sha256(aadhaar_raw.encode()).hexdigest() if aadhaar_raw else ""

    family_doc = {
        "head_name": head_name,
        "members": members,
        "location": location,
        "phone": phone,
        "aadhaar": aadhaar_hashed,
        "emergency_contact": data.get("emergency_contact", "").strip(),
        "special_needs": data.get("special_needs", "").strip(),
        "status": data.get("status", "safe"),  # safe, help, missing
        "shelter_id": None,
        "registered_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = families_collection.insert_one(family_doc)
    return jsonify({"message": "Family registered", "id": str(result.inserted_id)}), 201


@app.route("/families", methods=["GET"])
def get_families():
    """GET /families - List all registered families"""
    cursor = families_collection.find().sort("registered_at", -1)
    families = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        families.append(doc)
    return jsonify(families)


@app.route("/shelters", methods=["GET", "POST"])
def manage_shelters():
    """
    GET /shelters - List shelters
    POST /shelters - Add a new shelter (Body: {name, location, capacity})
    """
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        shelter_doc = {
            "name": data.get("name"),
            "location": data.get("location"),
            "capacity": data.get("capacity", 50),
            "occupied": 0
        }
        result = shelters_collection.insert_one(shelter_doc)
        return jsonify({"message": "Shelter added", "id": str(result.inserted_id)}), 201
    
    # GET
    cursor = shelters_collection.find()
    shelters = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        shelters.append(doc)
    return jsonify(shelters)


@app.route("/assign_shelter", methods=["POST"])
def assign_shelter():
    """
    POST /assign_shelter
    Body: { "family_id": str, "shelter_id": str }
    """
    data = request.get_json(silent=True) or {}
    print(f"Assigning shelter: {data}") # Debug log
    from bson.objectid import ObjectId
    
    try:
        family_id = data.get("family_id")
        shelter_id = data.get("shelter_id")
        
        if not family_id or not shelter_id:
            return jsonify({"error": "Missing IDs"}), 400

        # Update family status
        families_collection.update_one(
            {"_id": ObjectId(family_id)},
            {"$set": {"status": "In Shelter", "shelter_id": shelter_id}}
        )
        
        # Increment shelter occupancy (simple mock logic, could be more robust)
        shelters_collection.update_one(
            {"_id": ObjectId(shelter_id)},
            {"$inc": {"occupied": 1}}
        )

        return jsonify({"message": "Assigned to shelter successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@app.route("/sos", methods=["POST"])
def trigger_sos():
    """
    POST /sos
    Body: { "location": str, "aadhaar": str, "phone": str, "name": str }
    - Creates a high-severity alert
    - Updates family status if registered
    """
    data = request.get_json(silent=True) or {}
    location = data.get("location", "Unknown Location")
    phone = data.get("phone", "Unknown")
    
    # 1. Create High Severity Alert
    message = f"SOS SIGNAL: Immediate assistance needed at {location}. Contact: {phone}"
    
    alert_doc = {
        "message": message,
        "location": location,
        "severity": "Critical",
        "type": "sos",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ip": request.headers.get("X-Forwarded-For", request.remote_addr or "unknown"),
        "credibility": {"score": 100, "verified": True, "reason": "SankatMitra SOS Priority Channel"},
        "coordinates": {"lat": 12.9716, "lng": 77.5946},
        "votes_up": 0,
        "votes_down": 0,
        "voters": []
    }
    
    result = alerts_collection.insert_one(alert_doc)
    
    # Emit Full Serialized Object
    alert_for_client = alert_doc.copy()
    alert_for_client["_id"] = str(result.inserted_id)
    alert_for_client["votes_up"] = 0
    alert_for_client["votes_down"] = 0
    socketio.emit("new_alert", alert_for_client)
    
    # 3. Update Family Status if Aadhaar provided
    aadhaar = data.get("aadhaar")
    if aadhaar:
        families_collection.update_one(
            {"aadhaar": aadhaar},
            {"$set": {"status": "help"}}
        )
        
    return jsonify({"message": "SOS Alert Sent! Rescue teams notified."}), 200


@socketio.on("connect")
def handle_connect():
    # A simple handler to confirm connection if needed
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


if __name__ == "__main__":
    # Run the app on port 5000 with debug=True for auto-reloading
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)


