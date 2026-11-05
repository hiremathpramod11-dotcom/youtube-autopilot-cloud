@echo off
title YouTube Lifetime Autopilot - Aperture Shadow Engine
cd /d "%~dp0"
echo =================================================================
echo   YOUTUBE LIFETIME PERPETUAL AUTOPILOT
echo   Channel: P.Kannadiga (100%% English Aperture Curiosity Shadow)
echo =================================================================
echo.
echo [1/2] Checking Node.js environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

echo [2/2] Launching Lifetime Autopilot Daemon...
echo System will produce videos, expand calendar, and sync to GitHub cloud.
echo.
node scripts\lifetime-autopilot.js --daemon

pause
