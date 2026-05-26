@echo off
title ANT ARM - Dev Server
echo Starting ANT ARM development server...
echo.
echo [1/2] Starting backend server (Express :3001)...
start "ANT ARM Backend" cmd /k "npm run server:dev"
timeout /t 2 /nobreak >nul
echo [2/2] Starting frontend server (Vite :3000)...
start "ANT ARM Frontend" cmd /k "npm run dev:frontend"
echo.
echo Both servers starting...
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo Press Ctrl+C in each window to stop.
pause
