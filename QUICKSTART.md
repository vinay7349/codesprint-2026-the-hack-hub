# 🚀 Quick Start Guide

Get SankatMitra up and running in 5 minutes!

## Prerequisites Check

- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ MongoDB running locally (or MongoDB Atlas account)

## Step-by-Step Setup

### 1️⃣ Clone & Navigate

```bash
git clone https://github.com/yourusername/sankatmitra.git
cd sankatmitra
```

### 2️⃣ Backend Setup (Terminal 1)

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

✅ Backend running on `http://localhost:5000`

### 3️⃣ Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm start
```

✅ Frontend running on `http://localhost:3000`

### 4️⃣ Open Browser

Navigate to: **http://localhost:3000**

## 🎯 First Steps

1. **Report an Alert**: Fill out the form on the Live Alerts page
2. **View Alerts**: See real-time updates in the alerts list
3. **Check Emergency Actions**: Browse safety guidelines by disaster type
4. **Test Evacuation**: Try the Smart Evacuation feature
5. **Monitor Areas**: Check Area Risk Monitoring dashboard

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem**: `pymongo.errors.ServerSelectionTimeoutError`

**Solution**: 
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check connection string in `backend/app.py` (default: `mongodb://localhost:27017/`)

### Port Already in Use

**Problem**: `Address already in use`

**Solution**:
- Backend: Change port in `backend/app.py` (line with `socketio.run`)
- Frontend: React will prompt to use a different port automatically

### Module Not Found

**Problem**: `ModuleNotFoundError` or `Cannot find module`

**Solution**:
- Backend: Ensure virtual environment is activated and run `pip install -r requirements.txt`
- Frontend: Run `npm install` in the frontend directory

### CORS Errors

**Problem**: CORS policy blocking requests

**Solution**: 
- Ensure backend is running on port 5000
- Check `backend/app.py` has CORS enabled (should be by default)

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Explore the codebase in `frontend/src/components/`

## 💡 Tips

- Keep both terminals open (backend + frontend)
- Use browser DevTools to see WebSocket connections
- Check browser console for any errors
- MongoDB data persists between restarts

---

**Need Help?** Open an issue on GitHub or check the full documentation.

