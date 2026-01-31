@echo off
setlocal
echo ===================================================
echo   SankatMitra Disaster Management Suite - LAUNCHER
echo ===================================================
echo.

:: 1. Verify Environment
echo [1/4] Verifying environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js.
    pause
    exit /b
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python.
    pause
    exit /b
)

:: 2. Install Dependencies (Backend)
echo [2/4] Syncing Backend Dependencies...
cd backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Backend dependency sync failed. Continuing anyway...
)
cd ..

:: 3. Install Dependencies (Frontend)
echo [3/4] Syncing Frontend Dependencies...
cd frontend
:: We use --no-audit for speed
call npm install --no-audit
if %errorlevel% neq 0 (
    echo [WARNING] Frontend dependency sync failed. Continuing anyway...
)
cd ..

:: 4. Launch Everything
echo.
echo [4/4] Launching Services...
echo.
echo -> Backend will start on: http://localhost:5000
echo -> Frontend will start on: http://localhost:3000
echo.

:: Launch Backend in a new window
start "SankatMitra Backend" cmd /k "cd backend && python app.py"

:: Wait a bit for backend to initialize
timeout /t 3 >nul

:: Launch Frontend in a new window
start "SankatMitra Frontend" cmd /k "cd frontend && npm start"

echo.
echo ===================================================
echo   SYSTEMS ACTIVE. Check new windows for logs.
echo ===================================================
echo.
pause
