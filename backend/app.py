from datetime import datetime, timezone
from time import time

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo import MongoClient


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


KEYWORDS_HIGH_SEVERITY = ["flood", "cyclone", "earthquake", "fire", "water rising"]


def analyze_severity(message: str) -> str:
    """
    Simple AI-like validation based on keyword matching.
    If the message contains any of the configured keywords (case-insensitive),
    mark severity as "High", otherwise "Low".
    """
    if not message:
        return "Low"

    lowered = message.lower()
    for keyword in KEYWORDS_HIGH_SEVERITY:
        if keyword in lowered:
            return "High"
    return "Low"


# Mock road condition data for evacuation routing
FLOODED_ROADS = ["Bridge Road", "River Side Street"]
HEAVY_TRAFFIC_ROADS = ["Market Road", "Central Junction"]


def compute_safe_route(current_location: str, destination: str):
    """
    Simulate safe evacuation routing.
    - Exclude flooded roads entirely.
    - Avoid heavy traffic roads when possible.
    - Return a "safest" path description instead of the shortest.
    This is a mock implementation and does not call real mapping APIs.
    """
    avoided_flooded = []
    avoided_traffic = []

    # For demonstration, assume that any known flooded/traffic roads
    # near the current area are avoided and reported back.
    # In a real system, this would be based on geo-coordinates and live data.
    for road in FLOODED_ROADS:
        avoided_flooded.append(road)
    for road in HEAVY_TRAFFIC_ROADS:
        avoided_traffic.append(road)

    # Construct a friendly, safety-first route description
    safest_route = [
        f"Start near {current_location or 'your current location'}",
        "Move towards Lake View Road, avoiding low-lying areas.",
        "Avoid Bridge Road (Flooded)",
        "Follow Green Park Street which is currently clear.",
        f"Proceed to the safe point near {destination or 'your chosen shelter'}",
        "Reach designated Safe Shelter",
    ]

    message = (
        "Safest evacuation path calculated based on simulated flood risk "
        "and traffic congestion. Flooded roads are excluded; heavy-traffic "
        "segments are avoided whenever possible."
    )

    return {
        "safest_route": safest_route,
        "avoided_roads": {
            "flooded": avoided_flooded,
            "traffic": avoided_traffic,
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
    Body: { "message": string, "location": string }
    - Analyze severity
    - Add timestamp
    - Save to MongoDB
    - Emit "new_alert" Socket.IO event
    - Return severity and stored alert in JSON response
    - Enforce simple rate limiting (1 alert / 10 seconds per IP)
    """
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown")

    if is_rate_limited(ip):
        return (
            jsonify(
                {
                    "error": "Rate limit exceeded. Please wait before sending another alert.",
                    "retry_after_seconds": RATE_LIMIT_SECONDS,
                }
            ),
            429,
        )

    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    location = data.get("location", "").strip()

    if not message or not location:
        return jsonify({"error": "Both 'message' and 'location' are required."}), 400

    severity = analyze_severity(message)

    timestamp = datetime.now(timezone.utc).isoformat()
    alert_doc = {
        "message": message,
        "location": location,
        "severity": severity,
        "timestamp": timestamp,
        "ip": ip,
    }

    result = alerts_collection.insert_one(alert_doc)

    # Prepare a JSON-serializable alert object (convert _id to string)
    alert_for_client = {
        "_id": str(result.inserted_id),
        "message": message,
        "location": location,
        "severity": severity,
        "timestamp": timestamp,
    }

    # Emit Socket.IO event to all connected clients
    socketio.emit("new_alert", alert_for_client, broadcast=True)

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
                "timestamp": doc.get("timestamp", ""),
            }
        )
    return jsonify({"alerts": alerts})


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


@socketio.on("connect")
def handle_connect():
    # A simple handler to confirm connection if needed
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


if __name__ == "__main__":
    # Run the app on port 5000 as required
    socketio.run(app, host="0.0.0.0", port=5000)


