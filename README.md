# 🛡️ SankatMitra - Real-Time Disaster Alert System

A full-stack disaster management platform built with React and Flask, featuring real-time alerts, smart evacuation routing, and comprehensive emergency action guidelines.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-4.6.1-brightgreen)
![Socket.IO](https://img.shields.io/badge/Socket.IO-5.3.6-orange)

## 🌟 Features

### 📢 Live Alerts
- Real-time community-reported disaster alerts
- AI-powered severity classification (High/Medium/Low)
- Expandable safety action guidelines per alert
- Browser notifications for new alerts
- Auto-location detection

### 🛡️ Emergency Actions
- Categorized safety guidelines by disaster type:
  - 🌊 Flood Safety
  - 🌀 Cyclone Safety
  - 🌍 Earthquake Safety
  - 🔥 Fire Safety
  - 🆘 General Emergency Preparedness
- Expandable accordion layout for easy navigation

### 🚗 Smart Evacuation (SankatMitra)
- Safe route calculation avoiding flooded roads
- Traffic congestion avoidance
- Step-by-step evacuation instructions
- Color-coded warnings (flooded roads in red, traffic in orange)

### 📊 Area Risk Monitoring
- Real-time risk assessment by geographic area
- Total alerts, high severity counts per area
- Risk level badges (High/Medium/Low)
- Pulse animation for high-risk areas

### 👮 Admin Dashboard
- Comprehensive statistics overview
- Total alerts, severity breakdowns
- Alert review and management interface
- Real-time updates via WebSocket

## 🚀 Tech Stack

### Frontend
- **React 18** - Functional components with hooks
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **PWA Support** - Service worker + notifications
- **Modern CSS** - Clean, responsive design

### Backend
- **Flask 3.0** - Python web framework
- **Flask-SocketIO** - WebSocket support
- **MongoDB** - Document database
- **Flask-CORS** - Cross-origin resource sharing
- **Eventlet** - Async networking library

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm
- **MongoDB** (local installation or MongoDB Atlas)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sankatmitra.git
cd sankatmitra
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. MongoDB Setup

Make sure MongoDB is running on your system:

```bash
# MongoDB should be running on default port 27017
# Or update the connection string in backend/app.py
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sankatmitra/
├── backend/
│   ├── app.py                 # Flask application
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json      # PWA manifest
│   │   └── service-worker.js  # Service worker
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── Layout.jsx            # Main layout wrapper
│   │   │   ├── LiveAlerts.jsx        # Live alerts component
│   │   │   ├── EmergencyActions.jsx  # Emergency guidelines
│   │   │   ├── SmartEvacuation.jsx    # Evacuation routing
│   │   │   ├── AreaRisk.jsx          # Area risk monitoring
│   │   │   └── AdminDashboard.jsx    # Admin interface
│   │   │
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Global styles
│   │   └── index.js          # Entry point
│   │
│   └── package.json          # Node dependencies
│
└── README.md
```

## 🔌 API Endpoints

### POST `/report`
Submit a new disaster alert.

**Request Body:**
```json
{
  "message": "Water rising near the river",
  "location": "Bengaluru"
}
```

**Response:**
```json
{
  "severity": "High",
  "alert": {
    "message": "Water rising near the river",
    "location": "Bengaluru",
    "severity": "High",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### GET `/alerts`
Retrieve all alerts.

**Response:**
```json
{
  "alerts": [
    {
      "message": "...",
      "location": "...",
      "severity": "High",
      "timestamp": "..."
    }
  ]
}
```

### POST `/get-safe-route`
Calculate safest evacuation route.

**Request Body:**
```json
{
  "current_location": "MG Road",
  "destination": "Nearest Shelter"
}
```

**Response:**
```json
{
  "safest_route": [
    "Start at MG Road",
    "Take Lake View Road",
    "Avoid Bridge Road (Flooded)",
    "Reach Safe Shelter"
  ],
  "avoided_roads": {
    "flooded": ["Bridge Road"],
    "traffic": ["Market Road"]
  },
  "message": "Safest evacuation path calculated..."
}
```

## 🔐 Rate Limiting

The system implements rate limiting:
- **1 alert per 10 seconds per IP address**
- Returns HTTP 429 when limit exceeded

## 🎨 UI Features

- **Modern Dashboard Layout** - Fixed sidebar navigation
- **Responsive Design** - Mobile-friendly interface
- **Color-Coded Severity** - Visual indicators for alert levels
- **Smooth Animations** - Fade-in effects, hover transitions
- **PWA Support** - Installable as a web app
- **Browser Notifications** - Real-time alert notifications

## 🔄 Real-Time Updates

The application uses **Flask-SocketIO** for real-time communication:
- New alerts are broadcast to all connected clients
- No page refresh needed
- Instant updates across all dashboard views

## 🧪 AI Severity Classification

The system automatically classifies alert severity based on keywords:

**High Severity Keywords:**
- flood
- cyclone
- earthquake
- fire
- water rising

**Default:** Low severity for other alerts

## 📱 PWA Features

- **Service Worker** - Offline support
- **Web App Manifest** - Installable on devices
- **Background Notifications** - Alerts even when app is closed

## 🚨 Disclaimer

> **This is a community-driven alert system and not an official government alert service.**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- Flask community
- React team
- MongoDB documentation
- Socket.IO developers

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

Made with ❤️ for disaster management and community safety.

