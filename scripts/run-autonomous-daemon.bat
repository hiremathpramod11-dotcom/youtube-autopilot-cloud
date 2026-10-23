@echo off
cd /d "%~dp0\.."
echo Starting YouTube 30-Day Autonomous Auto-Publish Daemon...
node scripts/autonomous-30day-daemon.js >> logs/daemon.log 2>&1

