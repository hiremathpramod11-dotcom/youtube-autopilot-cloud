@echo off
cd /d "%~dp0\.."
if not exist logs mkdir logs
echo [%date% %time%] Starting YouTube Autonomous Daemon... >> logs\daemon.log
node scripts\autonomous-30day-daemon.js >> logs\daemon.log 2>&1
