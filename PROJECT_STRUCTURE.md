# 📁 Project Structure

This document provides an overview of the SankatMitra project structure.

```
sankatmitra/
│
├── 📄 README.md                 # Main project documentation
├── 📄 LICENSE                   # MIT License
├── 📄 CHANGELOG.md              # Version history
├── 📄 CONTRIBUTING.md           # Contribution guidelines
├── 📄 QUICKSTART.md             # Quick setup guide
├── 📄 SECURITY.md               # Security policy
├── 📄 .gitignore                # Git ignore rules
│
├── 📂 backend/                  # Flask backend application
│   ├── app.py                   # Main Flask application
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Virtual environment (gitignored)
│
└── 📂 frontend/                 # React frontend application
    ├── package.json             # Node.js dependencies
    ├── package-lock.json        # Locked dependency versions
    │
    ├── 📂 public/               # Static public files
    │   ├── index.html           # HTML template
    │   ├── manifest.json        # PWA manifest
    │   └── service-worker.js    # Service worker for PWA
    │
    └── 📂 src/                  # React source code
        ├── index.js             # Application entry point
        ├── App.js               # Main app component
        ├── App.css              # Global styles
        │
        └── 📂 components/       # React components
            ├── Sidebar.jsx      # Navigation sidebar
            ├── Sidebar.css      # Sidebar styles
            ├── Layout.jsx       # Layout wrapper
            ├── Layout.css       # Layout styles
            ├── LiveAlerts.jsx   # Live alerts display
            ├── EmergencyActions.jsx  # Emergency guidelines
            ├── SmartEvacuation.jsx   # Evacuation routing
            ├── AreaRisk.jsx     # Area risk monitoring
            └── AdminDashboard.jsx    # Admin interface
```

## 🔍 Key Files Explained

### Backend (`backend/`)

- **`app.py`**: Main Flask application with:
  - REST API endpoints (`/report`, `/alerts`, `/get-safe-route`)
  - Socket.IO real-time communication
  - MongoDB integration
  - Rate limiting logic
  - AI severity classification

- **`requirements.txt`**: Python package dependencies

### Frontend (`frontend/`)

- **`src/index.js`**: 
  - React app entry point
  - Service worker registration
  - Notification permission request
  - Router setup

- **`src/App.js`**: 
  - Main app component
  - Route definitions
  - Report alert form
  - Layout wrapper

- **`src/components/`**: 
  - Modular React components
  - Each feature in separate file
  - Reusable UI components

- **`public/manifest.json`**: 
  - PWA configuration
  - App metadata
  - Icon definitions

- **`public/service-worker.js`**: 
  - Offline support
  - Background notifications
  - Cache management

## 🗂️ Component Responsibilities

| Component | Purpose |
|-----------|---------|
| `Sidebar.jsx` | Fixed navigation sidebar with route links |
| `Layout.jsx` | Wrapper providing 2-column layout structure |
| `LiveAlerts.jsx` | Displays real-time alerts with Socket.IO |
| `EmergencyActions.jsx` | Expandable accordion with safety guidelines |
| `SmartEvacuation.jsx` | Safe route calculation and display |
| `AreaRisk.jsx` | Area-based risk monitoring dashboard |
| `AdminDashboard.jsx` | Admin statistics and alert management |

## 📊 Data Flow

```
User Input → React Component → Fetch API → Flask Backend → MongoDB
                                                      ↓
                                            Socket.IO Broadcast
                                                      ↓
                                            All Connected Clients
```

## 🔄 Real-Time Updates

1. User submits alert via form
2. POST request to `/report` endpoint
3. Backend saves to MongoDB
4. Socket.IO emits `new_alert` event
5. All connected clients receive update
6. React components update state
7. UI reflects new alert immediately

## 🎨 Styling Architecture

- **`App.css`**: Global styles, card components, buttons, alerts
- **`Sidebar.css`**: Sidebar-specific styles
- **`Layout.css`**: Layout and feature page styles
- **Component CSS**: Co-located with components where needed

## 📦 Dependencies

### Backend
- Flask (web framework)
- Flask-SocketIO (WebSocket support)
- Flask-CORS (CORS handling)
- PyMongo (MongoDB driver)
- Eventlet (async networking)

### Frontend
- React (UI library)
- React Router (routing)
- Socket.IO Client (WebSocket client)
- React Scripts (build tooling)

## 🚀 Build Outputs

- **Frontend Build**: `frontend/build/` (created on `npm run build`)
- **Backend**: No build step, runs directly with Python

## 📝 Notes

- Virtual environments (`venv/`) are gitignored
- `node_modules/` is gitignored
- Build artifacts are gitignored
- Environment files (`.env`) are gitignored

