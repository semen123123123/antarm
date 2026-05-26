@echo off
echo Stopping old server...
taskkill /F /IM node.exe 2>nul
timeout /t 1 /nobreak >nul
echo Starting server...
start /B "" "D:\ProgramFile\node.exe" "C:\Users\stara\Desktop\ant-arm\server\index.js"
echo Server started. Check http://localhost:3001/api/health
