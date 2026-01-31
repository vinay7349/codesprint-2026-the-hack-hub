project name
## SankatMitra
problem statement id 
## CS04DS
Team name
## the hack hub
college name
## Karavali Institute Of Technology Mangalore 

## Problem statement
 During disasters (floods, landslides, cyclones, fire accidents):
People don’t receive timely alerts
Emergency response is delayed
No centralized platform for live updates
No smart evacuation guidance
Authorities struggle to manage area risk efficiently

 ## Proposed solution
 1️⃣ Real-Time Disaster Alerts.

Live alerts for floods, fire, cyclone, landslides
Location-based notifications
Admin-controlled alert publishing

2️⃣ Area Risk Monitoring

Risk level display (Low / Medium / High)
Color-coded map view
Historical risk data

3️⃣ Smart Evacuation Guidance

Suggest nearest safe zones
Provide recommended evacuation routes
Display emergency shelters nearby

4️⃣ Emergency Action Panel

One-click SOS feature
Contact emergency services
Quick safety instructions based on disaster type

5️⃣ Admin Dashboard

Authorities can:
Add new alerts
Update risk level
Broadcast emergency announcements
Monitor affected zones

## Innovation & Creativity
* our web-based flood and cyclone alert system is unique because it skips hardware entirely and leverages existing government sources for instant,national wide coverage 
* ⁠why it is different,
* ⁠no hardware mess
* ⁠flood + cyclone together 
* ⁠no one can use our id’s
* ⁠it will detect the fake news
* ⁠we can track location easily in affected areas

## Teachinal Complexity & Stack
    language used : python
    front end :React
    backend:Flask
    java script library: leaflet
## Usability & Impact
    user features 
    if the user register before we can find where exactly affected in areas
    enter the user name and adhaar card verification etc

Key user benefits:
    browser notification + SMS options 
    accessible anywhere:no app download open website on any phone 

Real-world impact 
    Lives and property saved 
    early warning(15-60 mins before flood/cyclone)enable evaluation,reducing casualties by 30-50% based on similar systems 
    scalable in India 
    reaches rural village + cities instantly (no hardware needed)
    free to use 
    govt can adopt easily    

## Setup Instructions
 SankatMitra - Setup Guide
Complete instructions to run the SankatMitra Disaster Management System locally on your machine.
## 📋 Prerequisites
Before you begin, ensure you have the following installed on your system:
### Required Software
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- Python (v3.8 or higher) - [Download](https://www.python.org/)
- Git (optional but recommended) - [Download](https://git-scm.com/)
### Verify Installation
Open your terminal/command prompt and run:
bash
node --version
npm --version
python --version
pip --version
All commands should return version numbers.
## 📦 Project Structure
codesprint-2026-the-hack-hub/
├── frontend/          # React.js Web Application
├── backend/           # Flask REST API Server
├── run_all.bat        # One-click launcher (Windows)
└── README.md          # Project overview
## ⚙️ Installation Steps
### Step 1: Clone or Navigate to Project Directory
bash
# If cloning from Git
git clone <repository-url>
cd codesprint-2026-the-hack-hub
# Or navigate to existing project directory
cd d:\codesprint-2026-the-hack-hub
### Step 2: Backend Setup (Flask API)
Navigate to the backend directory:
bash
cd backend
#### Install Python Dependencies
bash
pip install -r requirements.txt
Dependencies installed:
- Flask==3.0.0
- Flask-Cors==4.0.0
- Flask-SocketIO==5.3.6
- pymongo==4.6.1
- eventlet==0.36.1
### Step 3: Frontend Setup (React)
Navigate to the frontend directory:
bash
cd ../frontend
#### Install Node Dependencies
bash
npm install
Key Dependencies:
- React 18.2.0
- React DOM
- React Router DOM
- Leaflet (Maps)
- React Leaflet
- Socket.io Client (Real-time updates)
- Tailwind CSS (Styling)
- Lucide React (Icons)
## 🏃 Running the Application
### Option A: One-Click Launch (Windows)
Double-click the batch file in the project root:
run_all.bat
This will:
1. ✅ Verify Node.js and Python are installed
2. ✅ Install backend dependencies
3. ✅ Install frontend dependencies
4. ✅ Start both servers automatically
### Option B: Manual Launch (All Platforms)
#### Terminal 1 - Start Backend Server
bash
cd backend
python app.py
Expected Output:
Running on http://localhost:5000
#### Terminal 2 - Start Frontend Development Server
bash
cd frontend
npm start
Expected Output:
Compiled successfully!
You can now view disaster-alert-frontend in the browser.
  http://localhost:3000
## 📍 Entry Points
| Component | URL | Port |
|-----------|-----|------|
| Frontend (Web App) | http://localhost:3000 | 3000 |
| Backend (API) | http://localhost:5000 | 5000 |
### Accessing the Application
1. Open your web browser
2. Navigate to: http://localhost:3000
3. You should see the SankatMitra landing page
## 🔑 Key Routes & Features
### Frontend Routes
- / - Landing Page
- /login - User Login
- /register - Family Registration
- /admin-login - Admin Dashboard Login
- /dashboard - User Dashboard with Live Alerts
- /map - Disaster Map with Risk Levels
- /evacuation - Smart Evacuation Guidance
- /emergency - Emergency Actions Panel
### Backend APIs (Sample)
- GET /api/alerts - Fetch live disaster alerts
- POST /api/alerts - Admin: Create new alert
- GET /api/risks/:region - Get area risk levels
- POST /api/evacuations - Calculate evacuation routes
## 🛠️ Troubleshooting
### Issue: "Python not found"
Solution: 
bash
# On Windows, try:
py --version
# If this works, use 'py' instead of 'python' in commands
### Issue: "Port 3000 or 5000 already in use"
Solution: Kill the process using the port or change the port:
bash
# For Windows
netstat -ano | findstr :3000
# For Linux/Mac
lsof -i :3000
### Issue: npm install fails
Solution:
bash
# Clear npm cache
npm cache clean --force
# Remove node_modules and lock file
rm -rf node_modules package-lock.json
# Reinstall
npm install
### Issue: Flask app won't start
Solution:
bash
# Install missing dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
## 📝 Environment Configuration
### Backend Configuration (optional)
Create a .env file in the backend/ directory:
env
FLASK_ENV=development
FLASK_DEBUG=True
MONGO_URI=mongodb://localhost:27017/sankatmitra
### Frontend Configuration (optional)
Create a .env file in the frontend/ directory:
env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
## 📱 Features Overview
✅ Real-Time Disaster Alerts - Location-based notifications
✅ Live Risk Monitoring - Color-coded map with risk levels
✅ Smart Evacuation - Nearest safe zones and routes
✅ Emergency SOS Panel - Quick emergency contacts
✅ Admin Dashboard - Manage alerts and updates
✅ Cross-Platform - Works on any browser without app download
## 🚀 Build for Production
### Frontend Build
bash
cd frontend
npm run build
Creates an optimized production build in frontend/build/
### Backend Deployment
bash

## 📞 Support & Issues
If you encounter any issues:
1. Check that all prerequisites are installed
2. Verify ports 3000 and 5000 are available
3. Clear cache and reinstall dependencies
4. Check the console for error messages
## 📄 License
This project is part of the CodeSprint 2026 competition.
Happy Disaster Prevention! 🌍
